// ADMIN PANEL SCRIPT - SECURED

// ============================================
// SECURE LOGIN HANDLER
// ============================================
async function handleLogin() {
    const pwd = document.getElementById('admin-password').value;

    try {
        // Check rate limiting
        Security.checkRateLimit();

        // Verify password with hashing
        const isValid = await Security.verifyPassword(pwd);

        if (isValid) {
            // Reset login attempts on success
            Security.resetLoginAttempts();

            // Create secure session
            Security.createSecureSession();

            // Log security event
            Security.logSecurityEvent('LOGIN_SUCCESS', { timestamp: new Date().toISOString() });

            // Show admin panel
            document.getElementById('login-modal').style.display = 'none';
            document.getElementById('admin-main').style.display = 'grid';

            // Load data
            if (typeof Store !== 'undefined') {
                renderBooksTable(Store.getBooks());
                renderOrdersTable();
            }

            // Show success message
            Swal.fire({
                icon: 'success',
                title: 'Login Successful!',
                text: 'Welcome to the admin panel',
                confirmButtonColor: '#8b5cf6',
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            // Log failed attempt
            Security.logSecurityEvent('LOGIN_FAILED', { reason: 'Invalid password' });

            Swal.fire({
                icon: 'error',
                title: 'Invalid Password!',
                text: 'Please check your password and try again.',
                confirmButtonColor: '#8b5cf6'
            });
        }
    } catch (error) {
        // Rate limit exceeded
        Security.logSecurityEvent('LOGIN_RATE_LIMIT', { error: error.message });

        Swal.fire({
            icon: 'warning',
            title: 'Too Many Attempts!',
            text: error.message,
            confirmButtonColor: '#8b5cf6'
        });
    }
}

// ============================================
// RENDER FUNCTIONS
// ============================================
function renderBooksTable(books) {
    const tbody = document.getElementById('books-table-body');
    if (!tbody || !books) return;

    tbody.innerHTML = books.map(book => `
        <tr style="border-bottom: 1px solid var(--border); transition: all 0.3s ease;" onmouseover="this.style.background='rgba(139, 92, 246, 0.05)'" onmouseout="this.style.background='transparent'">
            <td style="padding: 1rem;">${escapeHTML(book.title)}</td>
            <td style="padding: 1rem;">${escapeHTML(book.author)}</td>
            <td style="padding: 1rem;">$${book.price.toFixed(2)}</td>
            <td style="padding: 1rem;">${book.discount}%</td>
            <td style="padding: 1rem;">
                <button class="action-btn btn-primary" onclick="editBook(${book.id})" style="padding: 0.5rem 1rem; margin-right: 0.5rem; background: rgba(139, 92, 246, 0.1); color: var(--accent); border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteBook(${book.id})" style="padding: 0.5rem 1rem; background: rgba(239, 68, 68, 0.1); color: #ef4444; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Delete</button>
            </td>
        </tr>
    `).join('');
}

function renderOrdersTable() {
    const tbody = document.getElementById('orders-table-body');
    if (!tbody) return;

    const orders = Store.getOrders();

    if (orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="padding: 3rem; text-align: center; color: var(--text-muted);">
                    No orders yet. Check back after customers make purchases!
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = orders.map(order => `
        <tr style="border-bottom: 1px solid var(--border); transition: all 0.3s ease;" onmouseover="this.style.background='rgba(139, 92, 246, 0.05)'" onmouseout="this.style.background='transparent'">
            <td style="padding: 1rem; font-weight: 600; color: var(--accent);">#${order.id.toString().slice(-6)}</td>
            <td style="padding: 1rem;">
                <div style="font-weight: 600;">${escapeHTML(order.customer.name)}</div>
                <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">${escapeHTML(order.customer.email)}</div>
                <div style="font-size: 0.85rem; color: var(--text-muted);">${escapeHTML(order.customer.phone || 'N/A')}</div>
            </td>
            <td style="padding: 1rem;">${order.items.map(i => `${escapeHTML(i.title)} (x${i.quantity})`).join(', ')}</td>
            <td style="padding: 1rem; font-weight: 700; color: var(--accent);">$${order.total.toFixed(2)}</td>
            <td style="padding: 1rem;">${new Date(order.date).toLocaleDateString()}</td>
            <td style="padding: 1rem;">
                <span style="background: rgba(34, 197, 94, 0.1); color: #22c55e; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">✓ Paid</span>
            </td>
        </tr>
    `).join('');
}

// ============================================
// TAB SWITCHING
// ============================================
function switchTab(tabName) {
    // Require admin access
    try {
        Security.requireAdmin();
    } catch (error) {
        return;
    }

    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-nav-btn').forEach(b => b.classList.remove('active'));

    const tabElement = document.getElementById(`${tabName}-tab`);
    if (tabElement) {
        tabElement.classList.add('active');
        tabElement.style.display = 'block';
    }

    if (event && event.target) {
        event.target.classList.add('active');
    }

    if (tabName === 'books') renderBooksTable(Store.getBooks());
    if (tabName === 'orders') renderOrdersTable();
}

// ============================================
// LOGOUT
// ============================================
function logout() {
    // Destroy secure session
    Security.destroySession();
    Security.logSecurityEvent('LOGOUT', { timestamp: new Date().toISOString() });

    // Show login modal
    document.getElementById('login-modal').style.display = 'flex';
    document.getElementById('admin-main').style.display = 'none';

    Swal.fire({
        icon: 'info',
        title: 'Logged Out',
        text: 'You have been securely logged out.',
        confirmButtonColor: '#8b5cf6',
        timer: 2000,
        showConfirmButton: false
    });
}

// ============================================
// BOOK FORM MANAGEMENT
// ============================================
function openBookForm(bookId = null) {
    const modal = document.getElementById('admin-book-modal');
    const form = document.getElementById('book-form');
    const mediaInputs = document.getElementById('media-inputs');

    form.reset();
    mediaInputs.innerHTML = `
        <div class="media-input-group">
            <input type="url" placeholder="Image/Video URL" class="media-url" required style="flex: 1;">
            <select class="media-type" style="padding: 0.5rem; background: var(--bg-color); border: 1px solid var(--border); color: var(--text-main); border-radius: 4px;">
                <option value="image">Image</option>
                <option value="video">Video</option>
            </select>
        </div>
    `;

    if (bookId) {
        const books = Store.getBooks();
        const book = books.find(b => b.id === bookId);
        if (!book) return;

        document.getElementById('modal-form-title').textContent = 'Edit Book';
        document.getElementById('book-id').value = book.id;
        document.getElementById('book-title').value = book.title;
        document.getElementById('book-author').value = book.author;
        document.getElementById('book-price').value = book.price;
        document.getElementById('book-discount').value = book.discount;
        document.getElementById('book-category').value = book.category;
        document.getElementById('book-desc').value = book.description;

        if (book.media && book.media.length > 0) {
            mediaInputs.innerHTML = book.media.map(m => `
                <div class="media-input-group">
                    <input type="url" value="${m.url}" class="media-url" required style="flex: 1;">
                    <select class="media-type" style="padding: 0.5rem; background: var(--bg-color); border: 1px solid var(--border); color: var(--text-main); border-radius: 4px;">
                        <option value="image" ${m.type === 'image' ? 'selected' : ''}>Image</option>
                        <option value="video" ${m.type === 'video' ? 'selected' : ''}>Video</option>
                    </select>
                    <button type="button" class="remove-item" onclick="this.parentElement.remove()" style="background: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer;">&times;</button>
                </div>
            `).join('');
        }
    } else {
        document.getElementById('modal-form-title').textContent = 'Add New Book';
        document.getElementById('book-id').value = '';
    }

    modal.classList.add('active');
}

function closeBookForm() {
    document.getElementById('admin-book-modal').classList.remove('active');
}

function addMediaInput() {
    const div = document.createElement('div');
    div.className = 'media-input-group';
    div.innerHTML = `
        <input type="url" placeholder="Image/Video URL" class="media-url" required style="flex: 1;">
        <select class="media-type" style="padding: 0.5rem; background: var(--bg-color); border: 1px solid var(--border); color: var(--text-main); border-radius: 4px;">
            <option value="image">Image</option>
            <option value="video">Video</option>
        </select>
        <button type="button" class="remove-item" onclick="this.parentElement.remove()" style="background: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer;">&times;</button>
    `;
    document.getElementById('media-inputs').appendChild(div);
}

// ============================================
// DELETE BOOK
// ============================================
function deleteBook(id) {
    Swal.fire({
        title: 'Delete Book?',
        text: 'This action cannot be undone!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            let books = Store.getBooks().filter(b => b.id !== id);
            Store.saveBooks(books);
            renderBooksTable(books);

            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Book has been removed.',
                confirmButtonColor: '#8b5cf6',
                timer: 2000
            });
        }
    });
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    // Check if logged in with secure session
    if (Security.validateSession()) {
        document.getElementById('login-modal').style.display = 'none';
        document.getElementById('admin-main').style.display = 'grid';
        renderBooksTable(Store.getBooks());
        renderOrdersTable();
    }

    // Book form with validation
    const bookForm = document.getElementById('book-form');
    if (bookForm) {
        bookForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Require admin access
            try {
                Security.requireAdmin();
            } catch (error) {
                return;
            }

            const id = document.getElementById('book-id').value;
            const title = document.getElementById('book-title').value.trim();
            const author = document.getElementById('book-author').value.trim();
            const price = parseFloat(document.getElementById('book-price').value);
            const discount = parseFloat(document.getElementById('book-discount').value) || 0;
            const category = document.getElementById('book-category').value;
            const description = document.getElementById('book-desc').value.trim();

            // Validate all inputs
            const validationErrors = [];

            if (!Security.validateInput('bookTitle', title)) {
                validationErrors.push('Invalid book title (1-200 characters, alphanumeric only)');
            }
            if (!Security.validateInput('author', author)) {
                validationErrors.push('Invalid author name (1-100 characters, letters only)');
            }
            if (!Security.validateInput('price', price)) {
                validationErrors.push('Invalid price (must be between $0 and $10,000)');
            }
            if (!Security.validateInput('discount', discount)) {
                validationErrors.push('Invalid discount (must be between 0% and 100%)');
            }
            if (!Security.validateInput('category', category)) {
                validationErrors.push('Invalid category');
            }
            if (!Security.validateInput('description', description)) {
                validationErrors.push('Invalid description (10-2000 characters required)');
            }

            // Show validation errors
            if (validationErrors.length > 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Validation Error',
                    html: validationErrors.map(err => `• ${err}`).join('<br>'),
                    confirmButtonColor: '#8b5cf6'
                });
                return;
            }

            // Collect and validate media
            const media = [];
            document.querySelectorAll('.media-input-group').forEach(group => {
                const url = group.querySelector('.media-url').value.trim();
                const type = group.querySelector('.media-type').value;

                if (url) {
                    // Sanitize URL
                    const sanitizedUrl = Security.sanitizeURL(url);
                    if (sanitizedUrl) {
                        media.push({ type, url: sanitizedUrl });
                    }
                }
            });

            if (media.length === 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Media Required',
                    text: 'Please add at least one image or video URL',
                    confirmButtonColor: '#8b5cf6'
                });
                return;
            }

            let books = Store.getBooks();

            if (id) {
                // Edit existing book
                const index = books.findIndex(b => b.id == id);
                if (index !== -1) {
                    books[index] = {
                        ...books[index],
                        title: Security.sanitizeHTML(title),
                        author: Security.sanitizeHTML(author),
                        price,
                        discount,
                        category,
                        description: Security.sanitizeHTML(description),
                        media
                    };
                    Security.logSecurityEvent('BOOK_UPDATED', { bookId: id, title });
                }
            } else {
                // Add new book
                const newBook = {
                    id: Security.generateSecureId(),
                    title: Security.sanitizeHTML(title),
                    author: Security.sanitizeHTML(author),
                    price,
                    discount,
                    category,
                    description: Security.sanitizeHTML(description),
                    media,
                    reviews: []
                };
                books.push(newBook);
                Security.logSecurityEvent('BOOK_CREATED', { bookId: newBook.id, title });
            }

            // Save with integrity check
            await Security.secureSetItem('lumina_books', books);
            Store.saveBooks(books);
            renderBooksTable(books);
            closeBookForm();

            Swal.fire({
                icon: 'success',
                title: id ? 'Book Updated!' : 'Book Added!',
                text: 'Changes saved successfully',
                confirmButtonColor: '#8b5cf6',
                timer: 2000
            });
        });
    }

    // Enter key for login
    const pwd = document.getElementById('admin-password');
    if (pwd) {
        pwd.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') handleLogin();
        });
    }
});

// ============================================
// EXPOSE FUNCTIONS GLOBALLY
// ============================================
window.handleLogin = handleLogin;
window.switchTab = switchTab;
window.openBookForm = openBookForm;
window.editBook = openBookForm;
window.closeBookForm = closeBookForm;
window.deleteBook = deleteBook;
window.addMediaInput = addMediaInput;
window.logout = logout;
