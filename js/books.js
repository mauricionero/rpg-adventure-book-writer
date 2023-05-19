const COMPLEXITY_WEB = 1
const COMPLEXITY_E_READER = 2

// Book class
class Book {
  constructor(title_or_index, description = null, visibility = null, complexity = COMPLEXITY_WEB, entries = []) {
    let title = title_or_index;

    if (typeof title_or_index == 'number') {
      const book = BooksManager.getBookByIndexFromLocalStorage(title_or_index);

      title = book.title;
      description = book.description;
      visibility = book.visibility;
      entries = book.entries;
      complexity = book.complexity;
    }

    this.title = title;
    this.description = description;
    this.visibility = visibility;
    this.complexity = complexity;
    this.entries = entries;
  }

  static COMPLEXITY_WEB() {
    return COMPLEXITY_WEB;
  }
  static COMPLEXITY_E_READER() {
    return COMPLEXITY_E_READER;
  }
}

// Instantiate the BooksManager
const booksManager = new BooksManager();

// Function to handle form submission (create or edit)
function handleFormSubmit(event) {
  event.preventDefault();

  const titleInput = document.getElementById('title');
  const descriptionInput = document.getElementById('description');
  const complexityInput = document.querySelector('input[name="complexity"]:checked');

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const visibility = 'private';
  const complexity = complexityInput.value;

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
    const book = new Book(title, description, visibility, complexity, newEntries);
    booksManager.addBook(book);
  } else {
    // Editing an existing book
    const book = new Book(title, description, visibility, complexity);
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
      <br />
      <a class="title" href="write.html?bookIndex=${index}">${book.complexity == COMPLEXITY_E_READER ? '📕 e-reader' : '📱 Web'} ${book.title}</a><br>
      ${book.description}<br />
      <button class="btn edit-btn" onclick="editBook(${index})">✏️ Edit</button>
      <button class="btn delete-btn" onclick="deleteBook(${index})">🗑️ Delete</button>
      <br />
    `;
    bookList.appendChild(listItem);
  });
}

// Function to handle book editing
function editBook(index) {
  const book = booksManager.books[index];
  const titleInput = document.getElementById('title');
  const descriptionInput = document.getElementById('description');
  const complexityInput = document.querySelector(`input[name="complexity"][value="${book.complexity || COMPLEXITY_WEB}"]`);
  const formIndexInput = document.getElementById('formIndex');

  // Populate form with existing book details
  titleInput.value = book.title;
  descriptionInput.value = book.description;
  complexityInput.checked = true;

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
