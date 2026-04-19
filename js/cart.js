/**
 * Cart & Wishlist Module
 * Handles localStorage state and UI updates for cart and wishlist
 */

// Keys
const CART_KEY = 'bookstore_cart';
const WISHLIST_KEY = 'bookstore_wishlist';

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  
  // Expose these as global if there's any dynamic inline generic listeners missing
  window.addToCart = addToCart;
  window.toggleWishlist = toggleWishlist;
});

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function getWishlist() {
  return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
}

function updateCartBadge() {
  const badge = document.getElementById('cart-count');
  if (badge) {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems;
    
    // Add pop animation
    badge.style.transform = 'scale(1.5)';
    setTimeout(() => {
      badge.style.transform = 'scale(1)';
    }, 200);
  }
}

function addToCart(bookId) {
  if (typeof booksDatabase === 'undefined') return;
  
  const book = booksDatabase.find(b => b.id === parseInt(bookId));
  if (!book) return;

  const cart = getCart();
  const existingItem = cart.find(item => item.id === book.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...book,
      quantity: 1
    });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
  
  // Show quick alert (could be replaced by a nice toast UI)
  alert(`"${book.title}" added to cart!`);
}

function toggleWishlist(bookId, btnElement) {
  if (typeof booksDatabase === 'undefined') return;

  const book = booksDatabase.find(b => b.id === parseInt(bookId));
  if (!book) return;

  let wishlist = getWishlist();
  const existingIndex = wishlist.findIndex(item => item.id === book.id);

  if (existingIndex > -1) {
    // Remove
    wishlist.splice(existingIndex, 1);
    if(btnElement) btnElement.classList.remove('wishlist-active');
    alert(`"${book.title}" removed from wishlist!`);
  } else {
    // Add
    wishlist.push(book);
    if(btnElement) btnElement.classList.add('wishlist-active');
    alert(`"${book.title}" added to wishlist!`);
  }

  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
}

// ------------------------------------
// Cart Page Specific Functions
// ------------------------------------
function renderCartPage() {
  const cartContainer = document.getElementById('cart-items-container');
  const cartEmpty = document.getElementById('cart-empty');
  const cartSummary = document.getElementById('cart-summary');
  
  if (!cartContainer) return; // Not on cart page

  const cart = getCart();

  if (cart.length === 0) {
    cartContainer.style.display = 'none';
    cartSummary.style.display = 'none';
    cartEmpty.style.display = 'block';
    return;
  }

  cartEmpty.style.display = 'none';
  cartContainer.style.display = 'block';
  cartSummary.style.display = 'block';

  let html = '';
  let subtotal = 0;

  cart.forEach(item => {
    subtotal += (item.price * item.quantity);
    const coverUrl = `https://covers.openlibrary.org/b/isbn/${item.isbn}-M.jpg`;
    
    html += `
      <div class="cart-item">
        <img src="${coverUrl}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/80x120?text=No+Cover'">
        <div class="cart-item-details">
          <h4>${item.title}</h4>
          <p>${item.author}</p>
          <div class="cart-item-price">₹${item.price}</div>
        </div>
        <div class="cart-item-qty">
          <button onclick="updateCartQty(${item.id}, -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="updateCartQty(${item.id}, 1)">+</button>
        </div>
        <div class="cart-item-total">
          ₹${item.price * item.quantity}
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
  });

  cartContainer.innerHTML = html;

  // Update Summary
  document.getElementById('summary-subtotal').textContent = `₹${subtotal}`;
  const discount = subtotal > 1000 ? subtotal * 0.1 : 0; // 10% off over ₹1000
  document.getElementById('summary-discount').textContent = `-₹${discount.toFixed(0)}`;
  document.getElementById('summary-total').textContent = `₹${(subtotal - discount).toFixed(0)}`;
}

function updateCartQty(bookId, change) {
  let cart = getCart();
  const item = cart.find(i => i.id === bookId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCartPage();
    updateCartBadge();
  }
}

function removeFromCart(bookId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== bookId);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCartPage();
  updateCartBadge();
}

// ------------------------------------
// Wishlist Page Specific Functions
// ------------------------------------
function renderWishlistPage() {
  const container = document.getElementById('wishlist-grid');
  const emptyState = document.getElementById('wishlist-empty');
  
  if (!container) return; // Not on wishlist page

  const wishlist = getWishlist();

  if (wishlist.length === 0) {
    container.style.display = 'none';
    if(emptyState) emptyState.style.display = 'block';
    return;
  }

  if(emptyState) emptyState.style.display = 'none';
  container.style.display = 'grid';

  let html = '';
  wishlist.forEach(book => {
    const coverUrl = `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`;
    
    html += `
      <div class="book-card">
        <div class="book-img-wrapper">
          <div class="book-genre">${book.genre}</div>
          <img src="${coverUrl}" alt="${book.title}" onerror="this.src='https://via.placeholder.com/250x350?text=No+Cover'">
        </div>
        <div class="book-info">
          <h3>${book.title}</h3>
          <p class="book-author">${book.author}</p>
        </div>
        <div class="book-bottom">
          <span class="book-price">₹${book.price}</span>
          <div class="book-actions">
            <button onclick="moveToCart(${book.id})" class="btn btn-primary" style="font-size:0.8rem; padding: 5px 10px; width:auto; border-radius:4px; border:none; height:auto; color:white;">Move to Cart</button>
            <button onclick="removeFromWishlist(${book.id})" style="color:#e63946;"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function moveToCart(bookId) {
  addToCart(bookId);
  removeFromWishlist(bookId);
}

function removeFromWishlist(bookId) {
  let wishlist = getWishlist();
  wishlist = wishlist.filter(item => item.id !== bookId);
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  renderWishlistPage();
}
