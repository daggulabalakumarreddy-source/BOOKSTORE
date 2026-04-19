// mock database for books
const booksDatabase = [
  { id: 1, title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", genre: "Fantasy", price: 499, rating: 5, isbn: "9780590353403" },
  { id: 2, title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Classic", price: 299, rating: 4, isbn: "9780743273565" },
  { id: 3, title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Fiction", price: 349, rating: 5, isbn: "9780060935467" },
  { id: 4, title: "1984", author: "George Orwell", genre: "Dystopian", price: 329, rating: 5, isbn: "9780451524935" },
  { id: 5, title: "The Alchemist", author: "Paulo Coelho", genre: "Philosophy", price: 399, rating: 4, isbn: "9780061122415" },
  { id: 6, title: "Atomic Habits", author: "James Clear", genre: "Self-Help", price: 549, rating: 5, isbn: "9780735211292" },
  { id: 7, title: "The Da Vinci Code", author: "Dan Brown", genre: "Mystery", price: 449, rating: 4, isbn: "9780307474278" },
  { id: 8, title: "Pride and Prejudice", author: "Jane Austen", genre: "Romance", price: 279, rating: 5, isbn: "9780141439518" },
  { id: 9, title: "The Hunger Games", author: "Suzanne Collins", genre: "Sci-Fi", price: 429, rating: 4, isbn: "9780439023481" },
  { id: 10, title: "Dune", author: "Frank Herbert", genre: "Sci-Fi", price: 599, rating: 5, isbn: "9780441172719" },
  { id: 11, title: "The Notebook", author: "Nicholas Sparks", genre: "Romance", price: 369, rating: 4, isbn: "9780446605236" },
  { id: 12, title: "Sherlock Holmes", author: "Arthur Conan Doyle", genre: "Mystery", price: 319, rating: 5, isbn: "9780553212419" },
  { id: 13, title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", genre: "Finance", price: 499, rating: 4, isbn: "9781612680194" },
  { id: 14, title: "The Subtle Art of Not Giving a F*ck", author: "Mark Manson", genre: "Self-Help", price: 399, rating: 4, isbn: "9780062457714" },
  { id: 15, title: "Gone Girl", author: "Gillian Flynn", genre: "Thriller", price: 449, rating: 4, isbn: "9780307588371" },
  { id: 16, title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy", price: 529, rating: 5, isbn: "9780345339683" },
  { id: 17, title: "Sapiens", author: "Yuval Noah Harari", genre: "History", price: 599, rating: 5, isbn: "9780062316097" },
  { id: 18, title: "A Brief History of Time", author: "Stephen Hawking", genre: "Science", price: 479, rating: 4, isbn: "9780553380163" },
  { id: 19, title: "The Kite Runner", author: "Khaled Hosseini", genre: "Drama", price: 389, rating: 5, isbn: "9781594631931" },
  { id: 20, title: "Ikigai", author: "Héctor García", genre: "Self-Help", price: 349, rating: 4, isbn: "9780143130727" },
  { id: 21, title: "Thinking, Fast and Slow", author: "Daniel Kahneman", genre: "Psychology", price: 529, rating: 4, isbn: "9780374533557" },
  { id: 22, title: "The Midnight Library", author: "Matt Haig", genre: "Fiction", price: 419, rating: 4, isbn: "9780525559474" }
];

// Reusable function to render a book card
function renderBookToGrid(book) {
  // We use error fallback for images if they fail to load
  const coverUrl = `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`;

  // Render stars
  let starsHtml = '';
  for(let i=1; i<=5; i++) {
    if (i <= book.rating) {
      starsHtml += '<i class="fas fa-star" style="color:#FFD700;"></i>';
    } else {
      starsHtml += '<i class="far fa-star" style="color:#ccc;"></i>';
    }
  }

  // Check wishlist state 
  let wishlistClass = '';
  try {
    const list = JSON.parse(localStorage.getItem('bookstore_wishlist')) || [];
    if (list.find(item => item.id === book.id)) {
      wishlistClass = 'wishlist-active';
    }
  } catch(e) {}

  return `
    <div class="book-card skeleton-box">
      <div class="book-img-wrapper" onclick="window.location.href='book-detail.html?id=${book.id}'" style="cursor:pointer;">
        <div class="book-genre">${book.genre}</div>
        <img src="${coverUrl}" alt="${book.title}" onload="this.parentElement.parentElement.classList.remove('skeleton-box')" onerror="this.src='https://via.placeholder.com/250x350?text=No+Cover'; this.parentElement.parentElement.classList.remove('skeleton-box')">
      </div>
      <div class="book-info">
        <h3>${book.title}</h3>
        <p class="book-author">${book.author}</p>
        <div style="margin-bottom:10px; font-size:0.8rem;">
          ${starsHtml}
        </div>
      </div>
      <div class="book-bottom">
        <span class="book-price">₹${book.price}</span>
        <div class="book-actions">
          <button class="${wishlistClass}" onclick="toggleWishlist(${book.id}, this)" title="Add to Wishlist"><i class="fas fa-heart"></i></button>
          <button onclick="addToCart(${book.id})" title="Add to Cart"><i class="fas fa-cart-plus"></i></button>
        </div>
      </div>
      <div style="text-align: center; margin-top: 15px; padding-top: 10px; border-top: 1px solid #eee;">
        <a href="https://openlibrary.org/isbn/${book.isbn}" target="_blank" style="color: var(--color-primary); font-weight: bold; font-size: 0.9rem; text-decoration: none;">
          <i class="fas fa-book-reader"></i> Read / Study Online
        </a>
      </div>
    </div>
  `;
}
