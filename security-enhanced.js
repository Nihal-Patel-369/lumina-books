// ENHANCED SECURITY MODULE

// ============================================
// 1. SECURE PASSWORD HASHING
// ============================================

const SECURITY_CONFIG = {
    SALT: 'lumina_bookstore_2024_secure_salt',
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 5 * 60 * 1000, // 5 minutes
    SECRET_KEY: generateSecretKey()
};

// Generate a secret key for HMAC (stored in memory only)
function generateSecretKey() {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// Hash password using SHA-256
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + SECURITY_CONFIG.SALT);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Pre-computed hash for 'admin123' (change this to set new password)
const ADMIN_PASSWORD_HASH = 'b5c883e76de75c8650ce54010b9017edc598c2328eeb87aec9b025c013d31abd'; // SHA-256 of 'admin123' + salt

// Verify password
async function verifyPassword(inputPassword) {
    const inputHash = await hashPassword(inputPassword);
    return inputHash === ADMIN_PASSWORD_HASH;
}

// ============================================
// 2. RATE LIMITING
// ============================================

const loginAttempts = {
    count: 0,
    lastAttempt: 0,
    lockoutUntil: 0
};

function checkRateLimit() {
    const now = Date.now();

    // Check if currently locked out
    if (now < loginAttempts.lockoutUntil) {
        const remainingSeconds = Math.ceil((loginAttempts.lockoutUntil - now) / 1000);
        throw new Error(`Too many failed login attempts. Please try again in ${remainingSeconds} seconds.`);
    }

    // Reset counter if more than 1 minute has passed
    if (now - loginAttempts.lastAttempt > 60000) {
        loginAttempts.count = 0;
    }

    // Increment attempt counter
    loginAttempts.count++;
    loginAttempts.lastAttempt = now;

    // Lock out after max attempts
    if (loginAttempts.count >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
        loginAttempts.lockoutUntil = now + SECURITY_CONFIG.LOCKOUT_DURATION;
        throw new Error(`Too many failed attempts. Account locked for 5 minutes.`);
    }
}

function resetLoginAttempts() {
    loginAttempts.count = 0;
    loginAttempts.lastAttempt = 0;
    loginAttempts.lockoutUntil = 0;
}

// ============================================
// 3. SECURE SESSION MANAGEMENT
// ============================================

function createSecureSession() {
    const sessionId = generateCSRFToken();
    const sessionData = {
        id: sessionId,
        createdAt: Date.now(),
        lastActivity: Date.now(),
        csrfToken: generateCSRFToken()
    };
    sessionStorage.setItem('admin_session', JSON.stringify(sessionData));
    return sessionData;
}

function validateSession() {
    try {
        const sessionStr = sessionStorage.getItem('admin_session');
        if (!sessionStr) return false;

        const session = JSON.parse(sessionStr);
        const now = Date.now();

        // Check if session expired
        if (now - session.lastActivity > SECURITY_CONFIG.SESSION_TIMEOUT) {
            destroySession();
            return false;
        }

        // Update last activity
        session.lastActivity = now;
        sessionStorage.setItem('admin_session', JSON.stringify(session));
        return true;
    } catch (error) {
        console.error('Session validation error:', error);
        return false;
    }
}

function destroySession() {
    sessionStorage.removeItem('admin_session');
    sessionStorage.removeItem('admin_logged_in');
}

// ============================================
// 4. CSRF TOKEN GENERATION
// ============================================

function generateCSRFToken() {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

function getCSRFToken() {
    const sessionStr = sessionStorage.getItem('admin_session');
    if (!sessionStr) return null;
    const session = JSON.parse(sessionStr);
    return session.csrfToken;
}

function validateCSRFToken(token) {
    return token === getCSRFToken();
}

// ============================================
// 5. LOCALSTORAGE INTEGRITY CHECKS
// ============================================

async function generateHMAC(data, key) {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key);
    const messageData = encoder.encode(data);

    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
    return Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

async function secureSetItem(key, value) {
    const data = JSON.stringify(value);
    const signature = await generateHMAC(data, SECURITY_CONFIG.SECRET_KEY);
    localStorage.setItem(key, data);
    localStorage.setItem(key + '_sig', signature);
}

async function secureGetItem(key) {
    const data = localStorage.getItem(key);
    const signature = localStorage.getItem(key + '_sig');

    if (!data) return null;

    // If no signature exists (legacy data), return data but warn
    if (!signature) {
        console.warn(`No signature found for ${key}. Data may have been tampered with.`);
        return JSON.parse(data);
    }

    const expectedSig = await generateHMAC(data, SECURITY_CONFIG.SECRET_KEY);
    if (signature !== expectedSig) {
        console.error(`Data tampering detected for ${key}!`);
        return null;
    }

    return JSON.parse(data);
}

// ============================================
// 6. ENHANCED XSS PROTECTION
// ============================================

function sanitizeHTML(str) {
    if (typeof str !== 'string') return '';

    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML
        .replace(/'/g, '&#39;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\//g, '&#x2F;')
        .replace(/`/g, '&#x60;')
        .replace(/=/g, '&#x3D;');
}

function sanitizeURL(url) {
    if (typeof url !== 'string') return '';

    try {
        const parsed = new URL(url);
        // Only allow http and https protocols
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            return '';
        }
        return url;
    } catch {
        return '';
    }
}

// ============================================
// 7. INPUT VALIDATION
// ============================================

const validators = {
    bookTitle: (val) => {
        if (typeof val !== 'string') return false;
        if (val.length < 1 || val.length > 200) return false;
        // Allow letters, numbers, spaces, and common punctuation
        return /^[a-zA-Z0-9\s\-:,.'!?&()]+$/.test(val);
    },

    author: (val) => {
        if (typeof val !== 'string') return false;
        if (val.length < 1 || val.length > 100) return false;
        return /^[a-zA-Z\s\-.']+$/.test(val);
    },

    price: (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0 && num <= 10000;
    },

    discount: (val) => {
        const num = parseInt(val);
        return !isNaN(num) && num >= 0 && num <= 100;
    },

    category: (val) => {
        return ['fiction', 'non-fiction', 'poetry'].includes(val);
    },

    description: (val) => {
        if (typeof val !== 'string') return false;
        if (val.length < 10 || val.length > 2000) return false;
        return true;
    },

    email: (val) => {
        if (typeof val !== 'string') return false;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    },

    phone: (val) => {
        if (typeof val !== 'string') return false;
        // Allow various phone formats
        return /^[\d\s\-+()]{10,20}$/.test(val);
    },

    name: (val) => {
        if (typeof val !== 'string') return false;
        if (val.length < 2 || val.length > 100) return false;
        return /^[a-zA-Z\s\-.']+$/.test(val);
    }
};

function validateInput(type, value) {
    if (!validators[type]) {
        console.warn(`No validator found for type: ${type}`);
        return true;
    }
    return validators[type](value);
}

// ============================================
// 8. ADMIN ACCESS CONTROL
// ============================================

function requireAdmin() {
    if (!validateSession()) {
        console.error('Unauthorized access attempt detected!');
        window.location.href = 'admin.html';
        throw new Error('Unauthorized: Session invalid or expired');
    }
}

// ============================================
// 9. SECURITY UTILITIES
// ============================================

// Prevent timing attacks on password comparison
function constantTimeCompare(a, b) {
    if (a.length !== b.length) return false;
    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
}

// Generate secure random ID
function generateSecureId() {
    return Date.now() + '_' + Array.from(crypto.getRandomValues(new Uint8Array(8)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// ============================================
// 10. SECURITY EVENT LOGGING
// ============================================

const securityLog = [];

function logSecurityEvent(event, details) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        event: event,
        details: details,
        userAgent: navigator.userAgent
    };

    securityLog.push(logEntry);

    // Keep only last 100 events
    if (securityLog.length > 100) {
        securityLog.shift();
    }

    console.log('[SECURITY]', event, details);
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.Security = {
    // Password
    hashPassword,
    verifyPassword,

    // Rate Limiting
    checkRateLimit,
    resetLoginAttempts,

    // Session
    createSecureSession,
    validateSession,
    destroySession,

    // CSRF
    generateCSRFToken,
    getCSRFToken,
    validateCSRFToken,

    // Storage
    secureSetItem,
    secureGetItem,

    // Sanitization
    sanitizeHTML,
    sanitizeURL,

    // Validation
    validateInput,
    validators,

    // Access Control
    requireAdmin,

    // Utilities
    generateSecureId,
    logSecurityEvent,

    // Config
    config: SECURITY_CONFIG
};

console.log('🔒 Enhanced Security Module Loaded');
console.log('✅ Password Hashing: Enabled');
console.log('✅ Rate Limiting: Enabled');
console.log('✅ Session Management: Enabled');
console.log('✅ CSRF Protection: Enabled');
console.log('✅ Input Validation: Enabled');
