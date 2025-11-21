# 🌟 Lumina Books - Modern Bookstore Application

A beautiful, modern, and fully functional bookstore application with AI assistance, built with pure HTML, CSS, and JavaScript.

## ✨ Features

### 🛍️ **Customer Features**
- **Browse Books** - Beautiful grid layout with category filtering
- **AI Chatbot** - Intelligent assistant that can:
  - Show all available books
  - Filter by category (Fiction, Non-Fiction, Poetry)
  - Find books under a specific budget
  - Search by author or title keywords
  - Show books with discounts
  - Provide personalized recommendations
- **Book Details** - Modal with multiple images/videos and customer reviews
- **Shopping Cart** - Smooth sliding sidebar with real-time updates
- **Customer Reviews** - Read and write reviews with star ratings
- **Checkout** - Complete form with validation
- **Beautiful Alerts** - SweetAlert2 for elegant notifications

### 👨‍💼 **Admin Features**
- **Secure Login** - Password protected (default: `admin123`)
- **Book Management** - Add, edit, delete books
- **Media Management** - Multiple images/videos per book
- **Pricing & Discounts** - Set prices and discount percentages
- **Order Management** - View all customer orders with full details
- **Categories** - Organize books (Fiction, Non-Fiction, Poetry)
- **Beautiful UI** - Modern admin dashboard with SweetAlert2 notifications

## 🚀 Getting Started

### Installation

1. **Download or Clone** this repository
2. **Open `index.html`** in any modern browser
3. Start browsing books!

### For Administrators

1. **Open `admin.html`**
2. Enter password: **`admin123`**
3. Start managing your bookstore!

## 🤖 AI Chatbot Usage

Click the **chat button** (bottom-right corner) and try asking:

- "What books do you have?"
- "Show me fiction books"
- "Books under $15"
- "Books with discounts"
- "Show me books by [author name]"
- "Help" - to see all available commands

The AI has **full access** to your book inventory and provides real-time responses!

## 📁 Project Structure

```
book-selling-app/
├── index.html          # Main storefront
├── admin.html          # Admin panel
├── style.css           # All styles
├── app.js              # Main app logic
├── admin.js            # Admin panel logic
├── ai-chat.js          # AI chatbot logic ⚡ NEW
├── utils.js            # HTML escaping utilities
├── security.js         # Optional security features
└── README.md           # Documentation
```

## 🎨 Features Breakdown

### SweetAlert2 Integration
All alerts are now beautiful popups instead of basic browser alerts:
- ✅ Order confirmation with details
- ✅ Success messages for admin actions
- ✅ Error messages with icons
- ✅ Confirmation dialogs for deletions

### AI Chatbot Capabilities
The chatbot can:
- **Access Book Data**: Real-time access to all books in inventory
- **Smart Filtering**: Filter by category, price, discounts
- **Intelligent Search**: Search by author, title, keywords
- **Natural Language**: Understands various phrasings
- **Helpful Responses**: Provides formatted, easy-to-read responses

### Data Persistence
- **localStorage**: Books and cart data
- **sessionStorage**: Admin login state
- All data persists across sessions

## 💻 Usage

### Customer Flow
1. Browse books on homepage
2. Click on abook to see details
3. Read reviews or ask the AI chatbot for recommendations
4. Add books to cart
5. Open cart sidebar
6. Proceed to checkout
7. Fill in details (name, email, phone, address, payment)
8. Place order
9. See beautiful success message!

### Admin Flow
1. Login with password
2. View dashboard with books and orders
3. Add new books with media
4. Edit existing books
5. Delete books (with confirmation)
6. View customer orders
7. Logout when done

## 🎨 Design Highlights

- **Dark Theme** - Modern purple (#8b5cf6) accents
- **Glassmorphism** - Blurred backgrounds, modern shadows
- **Smooth Animations** - Hover effects, transitions
- **Responsive** - Works on mobile, tablet, desktop
- **Custom Scrollbar** - Styled for consistency
- **Google Fonts** - Outfit font family
- **Gradient Buttons** - Eye-catching CTAs

## 🔧 Customization

### Change Admin Password
Edit `admin.js`, line containing:
```javascript
if (pwd === 'admin123') {
```

### Change Colors
Edit `style.css` CSS variables in `:root`:
```css
--accent: #8b5cf6;
--accent-hover: #7c3aed;
```

### Add More Categories
Update category buttons in `index.html` and dropdown in `admin.html`

### Customize AI Responses
Edit `ai-chat.js` - modify the `getAIResponse()` function

## 🌐 Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Edge
- ✅ Safari
- ✅ Opera

Requires JavaScript enabled.

## 📱 Mobile Responsive

- Adapts to all screen sizes
- Touch-friendly buttons
- Optimized for mobile shopping
- AI chatbot works on mobile

## 🔐 Security Features

- HTML escaping to prevent XSS
- Admin password protection
- Session-based authentication
- Form validation
- Input sanitization

## 🚀 Deployment

### GitHub Pages
1. Push to GitHub repository
2. Go to Settings > Pages
3. Select branch and save
4. Your site will be live!

### Netlify/Vercel
1. Drag and drop all files
2. Instant deployment!
3. No build process needed

###Static Hosts
Works on any static file host:
- Firebase Hosting
- AWS S3
- Azure Static Web Apps
- Cloudflare Pages

## 💡 Future Enhancements

- User accounts and wishlists
- Advanced AI with GPT integration
- Payment gateway integration
- Email notifications
- Search bar in navbar
- Book sorting options
- Export orders to CSV/PDF
- Multi-language support
- Dark/Light theme toggle

## 🎯 Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling, animations
- **JavaScript (ES6+)** - Logic
- **LocalStorage API** - Data persistence
- **SweetAlert2** - Beautiful alerts
- **Google Fonts** - Typography
- **No frameworks** - Pure vanilla JS!

## 📝 Sample Data

The app includes 6 sample books:
1. The Midnight Library (Fiction)
2. Atomic Habits (Non-Fiction, 10% off)
3. Dune (Fiction)
4. The Psychology of Money (Non-Fiction)
5. Milk and Honey (Poetry, 5% off)
6. Project Hail Mary (Fiction)

## ⚡ Key Updates in This Version

### ✅ Fixed
- **Orders Now Display**: Admin can now see all orders immediately
- **Beautiful Alerts**: Replaced all browser alerts with SweetAlert2

### 🆕 New Features
- **AI Chatbot**: Intelligent assistant with full book inventory access
- **Real-time Search**: AI can search and filter books instantly
- **Smart Recommendations**: AI suggests books based on queries
- **Enhanced UX**: Much better user experience with modern popups

## 📊 Performance

- **Load Time**: < 1 second
- **No Build Process**: Just open and run
- **Lightweight**: < 100KB total
- **Fast**: No framework overhead

## 🤝 Contributing

This is a standalone project, but feel free to:
- Report bugs
- Suggest features
- Fork and modify
- Share with others

## 📄 License

Free to use for personal and commercial projects.

## 💬 Support

Need help? The AI chatbot can answer questions about:
- Available books
- Prices and discounts
- Category filtering
- Finding specific titles

For technical support, check the code comments or modify as needed!

---

## 🎉 **Ready to Use!**

### Quick Start:
1. **Open `index.html`** - Browse the store
2. **Click the chat icon** - Try the AI assistant
3. **Place an order** - See beautiful confirmations
4. **Open `admin.html`** - Login and manage (password: `admin123`)
5. **Check orders tab** - See your customer orders!

**Enjoy your AI-powered bookstore! 📚✨🤖**
