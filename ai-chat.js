// SMART AI CHATBOT - Works Locally (No Server Needed!)

let chatOpen = false;
const chatMessages = [];

// Initialize chatbot
document.addEventListener('DOMContentLoaded', function () {
    const chatBtn = document.getElementById('ai-chat-btn');
    const chatWindow = document.getElementById('ai-chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-chat');
    const messagesContainer = document.getElementById('chat-messages');

    // Toggle chat window
    chatBtn.addEventListener('click', function () {
        chatOpen = !chatOpen;
        chatWindow.style.display = chatOpen ? 'flex' : 'none';

        if (chatOpen && chatMessages.length === 0) {
            // Welcome message
            addMessage('bot', '👋 Hello! I\'m your intelligent book assistant. I can help you:\n\n• Find books by category, author, or price\n• Get personalized recommendations\n• Compare different books\n• Answer questions about our collection\n\nWhat are you looking for today?');
        }
    });

    closeChat.addEventListener('click', function () {
        chatOpen = false;
        chatWindow.style.display = 'none';
    });

    // Send message
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') sendMessage();
    });

    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        addMessage('user', message);
        chatInput.value = '';

        // Show typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.style.cssText = 'padding: 1rem; border-radius: 12px; background: var(--card-bg); border: 1px solid var(--border); max-width: 85%; animation: pulse 1.5s infinite;';
        typingDiv.innerHTML = '💭 Thinking...';
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Simulate AI thinking (more natural)
        setTimeout(() => {
            typingDiv.remove();
            const response = getIntelligentResponse(message);
            addMessage('bot', response);
        }, 800);
    }

    function addMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.style.cssText = `
            padding: 1rem;
            border-radius: 12px;
            animation: slideIn 0.3s ease;
            ${sender === 'user'
                ? 'background: var(--gradient-primary); color: white; margin-left: auto; max-width: 80%;'
                : 'background: var(--card-bg); border: 1px solid var(--border); max-width: 85%;'}
        `;
        msgDiv.innerHTML = text.replace(/\n/g, '<br>');
        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        chatMessages.push({ sender, text });
    }

    function getIntelligentResponse(userMessage) {
        const msg = userMessage.toLowerCase();
        const books = Store.getBooks();

        // Greeting responses
        if (msg.match(/^(hi|hello|hey|hola|namaste)/)) {
            return `Hello! 😊 I'm here to help you find the perfect book. We have ${books.length} amazing titles in our collection. What kind of book are you interested in today?`;
        }

        // Thank you
        if (msg.includes('thank')) {
            return `You're very welcome! 😊 Feel free to ask if you need any more book recommendations. Happy reading! 📚`;
        }

        // Help/capabilities
        if (msg.includes('help') || msg.includes('what can you do') || msg.includes('how do you work')) {
            return `I'm your intelligent book assistant! Here's what I can help with:\n\n✨ <strong>Find books by:</strong>\n• Category (fiction, non-fiction, poetry)\n• Price range or budget\n• Author name\n• Specific themes or topics\n\n💡 <strong>Get recommendations for:</strong>\n• Your mood or interests\n• Gifts for others\n• Books on sale\n\n🔍 <strong>Learn about:</strong>\n• Book details and descriptions\n• Author information\n• Comparisons between books\n\nJust ask me naturally - I'll understand! 😊`;
        }

        // Show all books
        if (msg.match(/what books|show (me )?(all|books)|list (all )?books|available books|have books/)) {
            if (books.length === 0) return 'We currently have no books in stock. Please check back later! 📚';

            let response = `📚 <strong>Our Complete Collection (${books.length} books):</strong>\n\n`;
            books.forEach((book, index) => {
                const finalPrice = book.price * (1 - book.discount / 100);
                const discountBadge = book.discount > 0 ? ` 🏷️ <span style="color: #22c55e;">${book.discount}% OFF!</span>` : '';
                response += `${index + 1}. <strong>"${book.title}"</strong> by ${book.author}\n   ${book.category.charAt(0).toUpperCase() + book.category.slice(1)} • $${finalPrice.toFixed(2)}${discountBadge}\n\n`;
            });
            response += `Which one catches your eye? I can tell you more about any of these! 😊`;
            return response;
        }

        // Fiction books
        if (msg.match(/fiction|novel|story|stories/) && !msg.includes('non')) {
            const fictionBooks = books.filter(b => b.category === 'fiction');
            if (fictionBooks.length === 0) return 'We don\'t have fiction books right now, but check out our other categories! 📖';

            let response = `📖 <strong>Our Fiction Collection:</strong>\n\n`;
            fictionBooks.forEach((book, i) => {
                const finalPrice = book.price * (1 - book.discount / 100);
                response += `${i + 1}. <strong>"${book.title}"</strong> by ${book.author}\n   $${finalPrice.toFixed(2)}${book.discount > 0 ? ` (${book.discount}% off!)` : ''}\n   <em>${book.description.substring(0, 100)}...</em>\n\n`;
            });
            response += `These are all great reads! Want to know more about any of them?`;
            return response;
        }

        // Non-fiction books
        if (msg.match(/non-?fiction|self-?help|educational|learning|guide/)) {
            const nonFictionBooks = books.filter(b => b.category === 'non-fiction');
            if (nonFictionBooks.length === 0) return 'We don\'t have non-fiction books currently, but we have great fiction and poetry! 📘';

            let response = `📘 <strong>Non-Fiction & Self-Help Books:</strong>\n\n`;
            nonFictionBooks.forEach((book, i) => {
                const finalPrice = book.price * (1 - book.discount / 100);
                response += `${i + 1}. <strong>"${book.title}"</strong> by ${book.author}\n   $${finalPrice.toFixed(2)}${book.discount > 0 ? ` (Save ${book.discount}%!)` : ''}\n   <em>${book.description.substring(0, 100)}...</em>\n\n`;
            });
            response += `Perfect for personal growth! Which one interests you?`;
            return response;
        }

        // Poetry books
        if (msg.match(/poetry|poem|verse/)) {
            const poetryBooks = books.filter(b => b.category === 'poetry');
            if (poetryBooks.length === 0) return 'We don\'t have poetry books at the moment, but check out our fiction collection! ✨';

            let response = `✨ <strong>Poetry Collection:</strong>\n\n`;
            poetryBooks.forEach((book, i) => {
                const finalPrice = book.price * (1 - book.discount / 100);
                response += `${i + 1}. <strong>"${book.title}"</strong> by ${book.author}\n   $${finalPrice.toFixed(2)}${book.discount > 0 ? ` (${book.discount}% discount)` : ''}\n   <em>${book.description.substring(0, 100)}...</em>\n\n`;
            });
            response += `Beautiful verses await! Interested in any?`;
            return response;
        }

        // Price-based queries
        const priceMatch = msg.match(/under \$?(\d+)|less than \$?(\d+)|below \$?(\d+)|cheaper than \$?(\d+)|budget.*\$?(\d+)/);
        if (priceMatch) {
            const maxPrice = parseInt(priceMatch[1] || priceMatch[2] || priceMatch[3] || priceMatch[4] || priceMatch[5]);
            const affordableBooks = books.filter(b => {
                const finalPrice = b.price * (1 - b.discount / 100);
                return finalPrice <= maxPrice;
            });

            if (affordableBooks.length === 0) {
                return `I couldn't find books under $${maxPrice}. Our cheapest book is $${Math.min(...books.map(b => b.price * (1 - b.discount / 100))).toFixed(2)}. Would you like to see it?`;
            }

            let response = `💰 <strong>Books Under $${maxPrice}:</strong>\n\n`;
            affordableBooks.forEach((book, i) => {
                const finalPrice = book.price * (1 - book.discount / 100);
                response += `${i + 1}. <strong>"${book.title}"</strong> by ${book.author}\n   Just $${finalPrice.toFixed(2)}! ${book.discount > 0 ? `(${book.discount}% off)` : ''}\n\n`;
            });
            response += `Great value picks! Which one would you like to know more about?`;
            return response;
        }

        // Cheapest book
        if (msg.match(/cheapest|lowest price|most affordable|budget/)) {
            const cheapest = books.reduce((min, book) => {
                const price = book.price * (1 - book.discount / 100);
                const minPrice = min.price * (1 - min.discount / 100);
                return price < minPrice ? book : min;
            });
            const finalPrice = cheapest.price * (1 - cheapest.discount / 100);
            return `💰 Our most affordable book is <strong>"${cheapest.title}"</strong> by ${cheapest.author} at just $${finalPrice.toFixed(2)}${cheapest.discount > 0 ? ` (${cheapest.discount}% off!)` : ''}!\n\n<em>${cheapest.description}</em>\n\nA great choice for any budget! Would you like to add it to your cart?`;
        }

        // Discounts/Sales
        if (msg.match(/discount|sale|offer|deal|cheap|save/)) {
            const discountedBooks = books.filter(b => b.discount > 0);
            if (discountedBooks.length === 0) {
                return 'No books are on sale right now, but all our books are priced affordably! 💰 Want to see our collection?';
            }

            let response = `🏷️ <strong>Books on Sale - Save Now!</strong>\n\n`;
            discountedBooks.forEach((book, i) => {
                const finalPrice = book.price * (1 - book.discount / 100);
                const savings = book.price - finalPrice;
                response += `${i + 1}. <strong>"${book.title}"</strong> by ${book.author}\n   <strike>$${book.price.toFixed(2)}</strike> → <span style="color: #22c55e;"><strong>$${finalPrice.toFixed(2)}</strong></span>\n   Save $${savings.toFixed(2)} (${book.discount}% OFF!) 🎉\n\n`;
            });
            response += `Don't miss these deals! Which one interests you?`;
            return response;
        }

        // Best/Recommended
        if (msg.match(/best|recommend|suggest|good|popular|top/)) {
            const bestBook = books.reduce((best, book) => {
                return book.discount > best.discount ? book : best;
            });
            const finalPrice = bestBook.price * (1 - bestBook.discount / 100);
            return `⭐ I'd recommend <strong>"${bestBook.title}"</strong> by ${bestBook.author}!\n\n<em>${bestBook.description}</em>\n\nIt's ${bestBook.category} and currently priced at $${finalPrice.toFixed(2)}${bestBook.discount > 0 ? ` with a ${bestBook.discount}% discount!` : '.'}\n\nThis is one of our most popular picks! Would you like to know more?`;
        }

        // Search by author
        if (msg.includes('by ') || msg.includes('author')) {
            const words = msg.split(/\s+/);
            const authorBooks = books.filter(b => {
                return words.some(word => b.author.toLowerCase().includes(word));
            });

            if (authorBooks.length > 0) {
                let response = `📚 <strong>Books by that author:</strong>\n\n`;
                authorBooks.forEach((book, i) => {
                    const finalPrice = book.price * (1 - book.discount / 100);
                    response += `${i + 1}. <strong>"${book.title}"</strong> by ${book.author}\n   $${finalPrice.toFixed(2)} • ${book.category}\n\n`;
                });
                return response;
            }
        }

        // Search by title or keywords
        const searchWords = msg.split(' ').filter(w => w.length > 3 && !['what', 'show', 'have', 'book', 'books', 'looking', 'want', 'need', 'find'].includes(w));
        if (searchWords.length > 0) {
            const matchingBooks = books.filter(b => {
                const titleLower = b.title.toLowerCase();
                const descLower = b.description.toLowerCase();
                const authorLower = b.author.toLowerCase();
                return searchWords.some(word =>
                    titleLower.includes(word) ||
                    descLower.includes(word) ||
                    authorLower.includes(word)
                );
            });

            if (matchingBooks.length > 0) {
                let response = `🔍 <strong>I found these books for you:</strong>\n\n`;
                matchingBooks.forEach((book, i) => {
                    const finalPrice = book.price * (1 - book.discount / 100);
                    response += `${i + 1}. <strong>"${book.title}"</strong> by ${book.author}\n   $${finalPrice.toFixed(2)} • ${book.category}\n   <em>${book.description.substring(0, 80)}...</em>\n\n`;
                });
                response += `Any of these catch your interest?`;
                return response;
            }
        }

        // Gift suggestions
        if (msg.match(/gift|present|someone|friend|mom|dad|girlfriend|boyfriend/)) {
            const giftBook = books[Math.floor(Math.random() * books.length)];
            const finalPrice = giftBook.price * (1 - giftBook.discount / 100);
            return `🎁 <strong>Perfect Gift Idea:</strong>\n\n<strong>"${giftBook.title}"</strong> by ${giftBook.author}\n\n<em>${giftBook.description}</em>\n\nPriced at $${finalPrice.toFixed(2)}${giftBook.discount > 0 ? ` (${giftBook.discount}% off!)` : ''}, this ${giftBook.category} book makes a thoughtful gift!\n\nWould you like to see more gift options?`;
        }

        // Default intelligent response
        return `I'd love to help you find the perfect book! 😊\n\nCould you tell me more about what you're looking for? For example:\n\n• "Show me fiction books"\n• "Books under $20"\n• "What's on sale?"\n• "I need a gift for someone"\n• "Books about [topic]"\n\nOr just browse our collection by asking "What books do you have?"`;
    }
});

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
`;
document.head.appendChild(style);
