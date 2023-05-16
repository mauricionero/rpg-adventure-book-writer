// Book class
class Book {
  constructor(title_or_index, description = null, visibility = null, entries = []) {
    let title = title_or_index;

    if (typeof title_or_index == 'number') {
      const book = BooksManager.getBookByIndexFromLocalStorage(title_or_index);

      title = book.title;
      description = book.description;
      visibility = book.visibility;
      entries = book.entries;
    }

    this.title = title;
    this.description = description;
    this.visibility = visibility;
    this.entries = entries;
  }
}

// Instantiate the BooksManager
const booksManager = new BooksManager();

// Function to handle form submission (create or edit)
function handleFormSubmit(event) {
  event.preventDefault();

  const titleInput = document.getElementById('title');
  const descriptionInput = document.getElementById('description');

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const visibility = 'private';

  if (!title) {
    alert('Title is mandatory!');
    return;
  }

  const index = parseInt(document.getElementById('formIndex').value);
  if (isNaN(index)) {
    // Creating a new book
    if (!booksManager.isTitleUnique(title)) {
      alert('Title must be unique!');
      return;
    }
    newEntries = [{ entryIndex: 1, title: 'Intro', text: '' }];
    const book = new Book(title, description, visibility, newEntries);
    booksManager.addBook(book);
  } else {
    // Editing an existing book
    const book = new Book(title, description, visibility);
    booksManager.editBook(index, book);
    // Clear form index after editing
    document.getElementById('formIndex').value = '';
  }

  // Clear the form inputs
  titleInput.value = '';
  descriptionInput.value = '';

  // Reload the book list
  loadBookList();
}

// Function to load the book list
function loadBookList() {
  const bookList = document.querySelector('.book-list ul');
  bookList.innerHTML = '';

  booksManager.books.forEach((book, index) => {
    const listItem = document.createElement('li');
    listItem.classList.add('book-list-item');
    listItem.innerHTML = `
      <a class="title" href="write.html?bookIndex=${index}">${book.title}</a><br>
      ${book.description}<br>
      <button class="btn edit-btn" onclick="editBook(${index})">✏️ Edit</button>
      <button class="btn delete-btn" onclick="deleteBook(${index})">🗑️ Delete</button>
    `;
    bookList.appendChild(listItem);
  });
}

// Function to handle book editing
function editBook(index) {
  const book = booksManager.books[index];
  const titleInput = document.getElementById('title');
  const descriptionInput = document.getElementById('description');
  const formIndexInput = document.getElementById('formIndex');

  // Populate form with existing book details
  titleInput.value = book.title;
  descriptionInput.value = book.description;

  // Store the index in the formIndex input for reference
  formIndexInput.value = index;
}

// Function to handle book deletion
function deleteBook(index) {
  const confirmation = confirm('Are you sure you want to delete this book?');
  if (confirmation) {
    booksManager.deleteBook(index);
    loadBookList();
  }
}

// Function to handle book title click
function openWritePage(index) {
  const book = booksManager.books[index];
  const bookTitle = document.getElementById('bookTitle');
  bookTitle.textContent = book.title;
  
  // Set the book index in the URL query parameter
  const writeURL = `write.html?index=${index}`;
  window.location.href = writeURL;
}

// Event listener for form submission
document.querySelector('form').addEventListener('submit', handleFormSubmit);

// Load books from local storage
booksManager.loadBooks();

// Load book list on page load
loadBookList();
