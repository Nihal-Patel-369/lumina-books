// --- Data Management (LocalStorage) ---

const DEFAULT_BOOKS = [
    {
        id: 1,
        title: "The Midnight Library",
        author: "Matt Haig",
        price: 18.99,
        discount: 0,
        category: "fiction",
        description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.",
        media: [{ type: 'image', url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800" }],
        reviews: []
    },
    {
        id: 2,
        title: "Atomic Habits",
        author: "James Clear",
        price: 21.50,
        discount: 10,
        category: "non-fiction",
        description: "No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear, one of the world's leading experts on habit formation, reveals practical strategies.",
        media: [{ type: 'image', url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800" }],
        reviews: []
    },
    {
        id: 3,
        title: "Dune",
        author: "Frank Herbert",
        price: 14.99,
        discount: 0,
        category: "fiction",
        description: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the 'spice' melange.",
        media: [{ type: 'image', url: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800" }],
        reviews: []
    },
    {
        id: 4,
        title: "The Psychology of Money",
        author: "Morgan Housel",
        price: 16.00,
        discount: 0,
        category: "non-fiction",
        description: "Doing well with money isn't necessarily about what you know. It's about how you behave. And behavior is hard to teach, even to really smart people.",
        media: [{ type: 'image', url: "https://images.unsplash.com/photo-1554774853-719586f8c277?auto=format&fit=crop&q=80&w=800" }],
        reviews: []
    },
    {
        id: 5,
        title: "Milk and Honey",
        author: "Rupi Kaur",
        price: 12.99,
        discount: 5,
        category: "poetry",
        description: "A collection of poetry and prose about survival. About the experience of violence, abuse, love, loss, and femininity.",
        media: [{ type: 'image', url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800" }],
        reviews: []
    },
    {
        id: 6,
        title: "Project Hail Mary",
        author: "Andy Weir",
        price: 22.00,
        discount: 0,
        category: "fiction",
        description: "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish.",
        media: [{ type: 'image', url: "https://images.unsplash.com/photo-1614544048536-0d28caf77f41?auto=format&fit=crop&q=80&w=800" }],
        reviews: []
    }
];

class Store {
    static getBooks() {
        const stored = localStorage.getItem('lumina_books');
        if (!stored) {
            localStorage.setItem('lumina_books', JSON.stringify(DEFAULT_BOOKS));
            return DEFAULT_BOOKS;
        }
        return JSON.parse(stored);
    }

    static saveBooks(books) {
        localStorage.setItem('lumina_books', JSON.stringify(books));
    }

    static getCart() {
        return JSON.parse(localStorage.getItem('lumina_cart')) || [];
    }

    static saveCart(cart) {
        localStorage.setItem('lumina_cart', JSON.stringify(cart));
    }

    static getOrders() {
        return JSON.parse(localStorage.getItem('lumina_orders')) || [];
    }

    static saveOrder(order) {
        const orders = this.getOrders();
        orders.unshift(order);
        localStorage.setItem('lumina_orders', JSON.stringify(orders));
    }
}

// --- App Logic ---

let books = Store.getBooks();
let cart = Store.getCart();
let currentBookId = null;

// DOM Elements (Shared)
const bookGrid = document.getElementById('book-grid');
const cartBtn = document.getElementById('cart-btn');
const cartCount = document.getElementById('cart-count');
const cartSidebar = document.getElementById('cart-sidebar');
const closeSidebar = document.querySelector('.close-sidebar');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const overlay = document.getElementById('overlay');
const categoryBtns = document.querySelectorAll('.cat-btn');
const checkoutBtn = document.getElementById('checkout-btn');
const checkoutModal = document.getElementById('checkout-modal');
const closeCheckoutModal = document.querySelector('.close-modal-checkout');
const checkoutForm = document.getElementById('checkout-form');

// Modal Elements
const bookModal = document.getElementById('book-modal');
const closeModal = document.querySelector('.close-modal');
const modalMediaContainer = document.getElementById('modal-media-container'); // New container for media
const modalTitle = document.getElementById('modal-title');
const modalAuthor = document.getElementById('modal-author');
const modalPrice = document.getElementById('modal-price');
const modalDesc = document.getElementById('modal-desc');
const modalCategory = document.getElementById('modal-category');
const addToCartModalBtn = document.getElementById('add-to-cart-modal');
const reviewsContainer = document.getElementById('reviews-container'); // New container for reviews

// Initialization
function init() {
    // Only run render logic if we are on the main page (bookGrid exists)
    if (bookGrid) {
        renderBooks(books);
        updateCartUI();
        setupEventListeners();
    }
}

// Render Books
function renderBooks(booksToRender) {
    bookGrid.innerHTML = booksToRender.map(book => {
        const mainImage = book.media.find(m => m.type === 'image')?.url || book.media[0]?.url;
        const finalPrice = book.price * (1 - book.discount / 100);

        return `
        <div class="book-card" onclick="openBookDetails(${book.id})">
            <div class="book-cover-wrapper">
                <img src="${mainImage}" alt="${book.title}" class="book-cover">
                ${book.discount > 0 ? `<span class="discount-badge">-${book.discount}%</span>` : ''}
            </div>
            <div class="book-info">
                <span class="book-category">${escapeHTML(book.category)}</span>
                <h3 class="book-title">${escapeHTML(book.title)}</h3>
                <p class="book-author">${escapeHTML(book.author)}</p>
                <div class="book-footer">
                    <div class="price-block">
                        <span class="book-price">$${finalPrice.toFixed(2)}</span>
                        ${book.discount > 0 ? `<span class="original-price">$${book.price.toFixed(2)}</span>` : ''}
                    </div>
                    <button class="add-btn" onclick="event.stopPropagation(); addToCart(${book.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 5v14M5 12h14"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `}).join('');
}

// Filter Books
function filterBooks(category) {
    if (category === 'all') {
        renderBooks(books);
    } else {
        const filtered = books.filter(book => book.category === category);
        renderBooks(filtered);
    }
}

// Cart Functions
function addToCart(id) {
    const book = books.find(b => b.id === id);
    const existingItem = cart.find(item => item.id === id);
    const finalPrice = book.price * (1 - book.discount / 100);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: book.id,
            title: book.title,
            price: finalPrice,
            image: book.media[0].url,
            quantity: 1
        });
    }

    Store.saveCart(cart);
    updateCartUI();

    // Animation feedback
    if (cartBtn) {
        cartBtn.style.transform = 'scale(1.2)';
        setTimeout(() => cartBtn.style.transform = 'scale(1)', 200);
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    Store.saveCart(cart);
    updateCartUI();
}

function updateCartUI() {
    if (!cartCount) return;

    // Update count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update sidebar list
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your cart is empty.</div>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${escapeHTML(item.title)}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        `).join('');
    }

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalPrice.textContent = '$' + total.toFixed(2);
}

// Modal Functions
function openBookDetails(id) {
    const book = books.find(b => b.id === id);
    currentBookId = id;
    const finalPrice = book.price * (1 - book.discount / 100);

    // Media Handling (Carousel-ish)
    modalMediaContainer.innerHTML = book.media.map(m => {
        if (m.type === 'video') {
            return `<video src="${m.url}" controls class="modal-media"></video>`;
        }
        return `<img src="${m.url}" alt="${book.title}" class="modal-media">`;
    }).join('');

    modalTitle.textContent = book.title;
    modalAuthor.textContent = `by ${book.author}`;
    modalPrice.innerHTML = `$${finalPrice.toFixed(2)} ${book.discount > 0 ? `<span class="original-price-modal">$${book.price.toFixed(2)}</span>` : ''}`;
    modalDesc.textContent = book.description;
    modalCategory.textContent = book.category;

    // Render Reviews
    renderReviews(book.reviews);

    bookModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function renderReviews(reviews) {
    if (!reviews || reviews.length === 0) {
        reviewsContainer.innerHTML = '<p class="no-reviews">No reviews yet. Be the first!</p>';
        return;
    }
    reviewsContainer.innerHTML = reviews.map(r => `
        <div class="review-item">
            <div class="review-header">
                <span class="review-user">${escapeHTML(r.user)}</span>
                <span class="review-rating">★ ${escapeHTML(r.rating)}</span>
            </div>
            <p class="review-comment">${escapeHTML(r.comment)}</p>
        </div>
    `).join('');
}

function addReview(e) {
    e.preventDefault();
    const user = document.getElementById('review-name').value;
    const rating = document.getElementById('review-rating').value;
    const comment = document.getElementById('review-comment').value;

    const book = books.find(b => b.id === currentBookId);
    book.reviews.push({ user, rating, comment });

    Store.saveBooks(books);
    renderReviews(book.reviews);

    // Reset form
    document.getElementById('review-form').reset();
}

function closeBookModal() {
    bookModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Event Listeners
function setupEventListeners() {
    // Category Filtering
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterBooks(btn.dataset.category);
        });
    });

    // Cart Sidebar
    cartBtn.addEventListener('click', () => {
        cartSidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    closeSidebar.addEventListener('click', closeCart);
    overlay.addEventListener('click', () => {
        closeCart();
        closeBookModal();
        checkoutModal.classList.remove('active');
    });

    // Book Modal
    closeModal.addEventListener('click', closeBookModal);
    addToCartModalBtn.addEventListener('click', () => {
        if (currentBookId) {
            addToCart(currentBookId);
            closeBookModal();
            setTimeout(() => {
                cartSidebar.classList.add('active');
                overlay.classList.add('active');
            }, 300);
        }
    });

    // Review Form
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) reviewForm.addEventListener('submit', addReview);

    // Checkout
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) return alert('Your cart is empty!');
        closeCart();
        checkoutModal.classList.add('active');
        overlay.classList.add('active');
    });

    closeCheckoutModal.addEventListener('click', () => {
        checkoutModal.classList.remove('active');
        overlay.classList.remove('active');
    });

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const payment = document.getElementById('payment').value;

        const order = {
            id: Date.now(),
            customer: { name, email, phone, address, payment },
            items: cart,
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            date: new Date().toISOString(),
            status: 'Pending'
        };

        Store.saveOrder(order);

        // Beautiful success message with SweetAlert2
        Swal.fire({
            icon: 'success',
            title: 'Order Placed Successfully!',
            html: `
                <div style="text-align: left; padding: 1rem;">
                    <p style="margin-bottom: 0.5rem;"><strong>Order ID:</strong> #${order.id.toString().slice(-6)}</p>
                    <p style="margin-bottom: 0.5rem;"><strong>Total Amount:</strong> $${order.total.toFixed(2)}</p>
                    <p style="margin-bottom: 0.5rem;"><strong>Payment Method:</strong> ${payment.toUpperCase()}</p>
                    <p style="margin-top: 1rem; color: #22c55e;">✓ Thank you for shopping with Lumina Books!</p>
                </div>
            `,
            confirmButtonText: 'Awesome!',
            confirmButtonColor: '#8b5cf6',
            timer: 5000,
            timerProgressBar: true
        });

        cart = [];
        Store.saveCart(cart);
        updateCartUI();
        checkoutModal.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
        checkoutForm.reset();
    });
}

function closeCart() {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Start App
document.addEventListener('DOMContentLoaded', init);

// Expose functions
window.openBookDetails = openBookDetails;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.Store = Store; // Expose Store for Admin

