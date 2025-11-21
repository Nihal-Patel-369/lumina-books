# 🚀 How to Run Your PWA Locally

## The Problem:
PWAs **require HTTPS** or **localhost** to work. Opening `index.html` directly in your browser (`file://`) won't enable PWA features.

---

## ✅ Solution: Run a Local Server

### Option 1: Using Python (Easiest)

**If you have Python installed:**

```bash
# Navigate to your project folder
cd "c:\Work\book selling app"

# Run a simple HTTP server
python -m http.server 8000
```

Then open: **http://localhost:8000**

---

### Option 2: Using Node.js (Recommended)

**If you have Node.js installed:**

```bash
# Install a simple server (one-time)
npm install -g http-server

# Navigate to your project folder
cd "c:\Work\book selling app"

# Run the server
http-server -p 8000
```

Then open: **http://localhost:8000**

---

### Option 3: Using VS Code (Super Easy!)

**If you use VS Code:**

1. Install "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"
4. It opens automatically!

---

### Option 4: Using npx (No Installation)

```bash
# Navigate to your project folder
cd "c:\Work\book selling app"

# Run server (no installation needed)
npx serve -s . -p 8000
```

Then open: **http://localhost:8000**

---

## 📱 After Running the Server:

1. **Open** http://localhost:8000 in Chrome
2. **Wait 3 seconds** - install prompt will appear
3. **Click "Install Now"** in the popup
4. **App installs** to your desktop/home screen!

---

## 🧪 Testing PWA Features:

### Check if PWA is Working:

1. Open Chrome DevTools (F12)
2. Go to **Application** tab
3. Check **Manifest** - should show "Lumina Books"
4. Check **Service Workers** - should show "activated"

### Test Install Button:

1. Look for **install icon (⊕)** in Chrome address bar
2. Click it to install
3. App opens in standalone window

### Test Offline:

1. Install the app
2. Open DevTools → Network → Check "Offline"
3. Refresh - app should still work!

---

## 🎯 Quick Start (Copy & Paste):

```bash
cd "c:\Work\book selling app"
python -m http.server 8000
```

Then open: **http://localhost:8000**

---

## ⚠️ Important Notes:

- **File:// won't work** - Must use http://localhost
- **HTTPS required** for production (not localhost)
- **Chrome/Edge** work best for testing
- **Install prompt** appears after 3 seconds

---

## 🌐 For Production (Real Website):

Deploy to any of these (all have free HTTPS):

- **Netlify** - Drag & drop your folder
- **Vercel** - Connect GitHub repo
- **GitHub Pages** - Push to GitHub
- **Firebase Hosting** - `firebase deploy`

All automatically enable HTTPS and PWA features!

---

**Start the server and your PWA will work! 🎉**
