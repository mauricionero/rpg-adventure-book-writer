// BooksManager class
class BooksManager {
  constructor() {
    this.books = [];
  }
  
  addBook(book) {
    this.books.push(book);
    this.saveBooks();
  }
  
  editBook(bookIndex, updatedBook) {
    const book = this.getBookByIndex(bookIndex);
    console.log('book', book);
    console.log('updatedBook', updatedBook);
    if (book) {
      // Preserve the existing entries in the book
      updatedBook.entries = book.entries;
      this.books[bookIndex] = updatedBook;
      this.saveBooks();
    }
  }
  
  deleteBook(bookIndex) {
    this.books.splice(bookIndex, 1);
    this.saveBooks();
  }
  
  saveBooks() {
    localStorage.setItem('books', JSON.stringify(this.books));
  }
  
  loadBooks() {
    const storedBooks = localStorage.getItem('books');
    if (storedBooks) {
      this.books = JSON.parse(storedBooks);
    }
  }
  
  getNextIndex() {
    return this.books.length + 1;
  }
  
  isTitleUnique(title, bookIndex) {
    const filteredBooks = this.books.filter((book, i) => {
      return book.title.toLowerCase() === title.toLowerCase() && i !== bookIndex;
    });
    return filteredBooks.length === 0;
  }

  static getBookByIndexFromLocalStorage(bookIndex) {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    return books[bookIndex];
  }

  static getEntriesFromBook(bookIndex) {
    const book = BooksManager.getBookByIndexFromLocalStorage(bookIndex)
    if (book && book.entries) {
      return book.entries;
    }
    return []
  }

  getBookByIndex(index) {
    const book = this.books[index];
    if (book) {
      // Check if entries property exists, otherwise create it as an empty array
      book.entries = book.entries || [];
      return book;
    }
    return null;
  }

  addEntry(bookIndex, entry) {
    const booksData = localStorage.getItem('books');
    let books = JSON.parse(booksData) || [];
  
    const book = books[bookIndex];
    if (book) {
      // Check if the entry already exists
      if (book.entries == undefined) {
        book.entries = [];
      }
      const existingEntry = book.entries.find(e => e.entryIndex === entry.entryIndex);
      if (existingEntry) {
        // Update the existing entry
        existingEntry.title = entry.title;
        existingEntry.text = entry.text;
      } else {
        // Generate a new entry index
        const lastEntryIndex = this.getLastEntryIndex();
        console.log('lastEntryIndex', lastEntryIndex);
        const newEntryIndex = lastEntryIndex + 1;
        console.log('newEntryIndex', newEntryIndex);
  
        // Create a new entry
        const newEntry = {
          entryIndex: newEntryIndex,
          title: entry.title,
          text: entry.text
        };
  
        // Add the new entry to the book
        book.entries.push(newEntry);
      }
    }
  
    // Update the books data in localStorage
    localStorage.setItem('books', JSON.stringify(books));
  }

  getLastEntryIndex(bookIndex = null) {
    if (bookIndex == null) {
      bookIndex = getBookIndexFromURL();
    }
    const book = this.getBookByIndex(bookIndex); // Get the book by index
    const entries = book.entries; // Get the entries array

    if (entries == undefined || entries.length === 0) {
      return 0; // No entries in the book, return 0 as the last index
    }

    const lastEntry = entries[entries.length - 1]; // Get the last entry
    return lastEntry.entryIndex; // Return the entryIndex of the last entry
  }

  updateEntry(bookIndex, entryIndex, updatedEntry) {
    const book = this.getBookByIndex(bookIndex);
    if (book.entries == undefined) {
      book.entries = [];
    }
    if (book && book.entries.length > entryIndex) {
      const existingEntry = book.entries[entryIndex];
      if (existingEntry) {
        existingEntry.title = updatedEntry.title;
        existingEntry.text = updatedEntry.text;
        this.saveBooks();
      }
    }
  }

  deleteEntry(bookIndex, entryIndex) {
    const book = this.getBookByIndex(bookIndex);
    if (book && book.entries.length > entryIndex) {
      book.entries.splice(entryIndex, 1);
      this.saveBooks();
    }
  }

  loadEntries(index) {
    const book = this.getBookByIndex(index);
    if (book) {
      return book.entries ? book.entries : [];
    } else {
      []
    }
  }

  getNextEntryIndex(bookIndex) {
    const book = this.getBookByIndex(bookIndex);
    return book ? book.entries.length + 1 : 1;
  }
}
