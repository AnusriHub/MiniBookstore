// API Configuration - Change this to your backend URL
const API_BASE_URL = 'http://localhost:8080/api';

// Store books in memory (until you set up backend)
let books = [];

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    loadBooksFromLocalStorage();
    displayBooks();
});

// Initialize app
function initializeApp() {
    console.log('Mini Bookstore App Initialized');
}

// Setup event listeners
function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', switchTab);
    });

    // Add book form
    document.getElementById('add-book-form').addEventListener('submit', handleAddBook);

    // Search
    document.getElementById('search-btn').addEventListener('click', handleSearch);
    document.getElementById('search-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Sell book form
    document.getElementById('sell-book-form').addEventListener('submit', handleSellBook);

    // Save button
    document.getElementById('save-btn').addEventListener('click', saveInventory);
}

// Switch tabs
function switchTab(e) {
    // Remove active class from all buttons and contents
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    // Add active class to clicked button and corresponding content
    e.target.classList.add('active');
    const tabId = e.target.getAttribute('data-tab');
    document.getElementById(tabId).classList.add('active');
}

// Load books from local storage
function loadBooksFromLocalStorage() {
    const stored = localStorage.getItem('bookstoreInventory');
    if (stored) {
        books = JSON.parse(stored);
    }
}

// Save to local storage
function saveBooksToLocalStorage() {
    localStorage.setItem('bookstoreInventory', JSON.stringify(books));
}

// Display all books
function displayBooks() {
    const booksList = document.getElementById('books-list');
    
    if (books.length === 0) {
        booksList.innerHTML = '<p class="loading">No books in inventory.</p>';
        return;
    }

    booksList.innerHTML = books.map(book => createBookCard(book)).join('');
}

// Create book card HTML
function createBookCard(book) {
    const stockClass = book.quantity > 5 ? 'stock-high' : book.quantity > 0 ? 'stock-low' : 'stock-none';
    const stockText = book.quantity > 5 ? '✅ In Stock' : book.quantity > 0 ? '⚠️ Low Stock' : '❌ Out of Stock';

    return `
        <div class="book-card">
            <span class="book-id">ID: ${book.id}</span>
            <h3>${book.title}</h3>
            <p><span class="label">Author:</span> ${book.author}</p>
            <p class="price">$${book.price.toFixed(2)}</p>
            <div class="stock-status">
                <p><span class="label">Quantity:</span> <span class="${stockClass}">${book.quantity} ${stockText}</span></p>
            </div>
        </div>
    `;
}

// Handle add book
function handleAddBook(e) {
    e.preventDefault();

    const book = {
        id: parseInt(document.getElementById('book-id').value),
        title: document.getElementById('book-title').value,
        author: document.getElementById('book-author').value,
        price: parseFloat(document.getElementById('book-price').value),
        quantity: parseInt(document.getElementById('book-quantity').value)
    };

    // Check if book ID already exists
    if (books.some(b => b.id === book.id)) {
        showMessage('add-message', 'A book with this ID already exists!', 'error');
        return;
    }

    books.push(book);
    saveBooksToLocalStorage();
    
    // Reset form
    e.target.reset();
    showMessage('add-message', `Book "${book.title}" added successfully!`, 'success');
    
    // Refresh inventory view
    displayBooks();
}

// Handle search
function handleSearch() {
    const keyword = document.getElementById('search-input').value.toLowerCase();
    
    if (!keyword.trim()) {
        document.getElementById('search-results').innerHTML = '<p class="loading">Enter a search term...</p>';
        return;
    }

    const results = books.filter(book =>
        book.title.toLowerCase().includes(keyword) ||
        book.author.toLowerCase().includes(keyword)
    );

    const resultsDiv = document.getElementById('search-results');
    
    if (results.length === 0) {
        resultsDiv.innerHTML = '<p class="loading">No books found matching your search.</p>';
        return;
    }

    resultsDiv.innerHTML = results.map(book => createBookCard(book)).join('');
}

// Handle sell book
function handleSellBook(e) {
    e.preventDefault();

    const bookId = parseInt(document.getElementById('sell-book-id').value);
    const quantity = parseInt(document.getElementById('sell-quantity').value);

    const book = books.find(b => b.id === bookId);

    if (!book) {
        showMessage('sell-message', 'Book ID not found!', 'error');
        return;
    }

    if (book.quantity < quantity) {
        showMessage('sell-message', 'Not enough stock to sell!', 'error');
        return;
    }

    book.quantity -= quantity;
    saveBooksToLocalStorage();
    
    e.target.reset();
    showMessage('sell-message', `Sold ${quantity} copy/copies of "${book.title}"`, 'success');
    
    // Refresh inventory view
    displayBooks();
}

// Show message
function showMessage(elementId, message, type) {
    const messageDiv = document.getElementById(elementId);
    messageDiv.textContent = message;
    messageDiv.className = `message show ${type}`;
    
    // Auto-hide after 4 seconds
    setTimeout(() => {
        messageDiv.classList.remove('show');
    }, 4000);
}

// Save inventory
function saveInventory() {
    saveBooksToLocalStorage();
    alert('✅ Inventory saved successfully!');
}

// Export data as JSON (for backup)
function exportData() {
    const dataStr = JSON.stringify(books, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bookstore_backup.json';
    link.click();
}

// Import data from JSON
function importData(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            books = JSON.parse(e.target.result);
            saveBooksToLocalStorage();
            displayBooks();
            alert('✅ Data imported successfully!');
        } catch (error) {
            alert('❌ Error importing data: ' + error.message);
        }
    };
    reader.readAsText(file);
}
