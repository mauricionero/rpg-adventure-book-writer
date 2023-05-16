class Entry {
  constructor() {
    this.entries = [];
    this.currentEntryIndex = 0;
  }

  getCurrentEntry() {
    const entryIndex = this.currentEntryIndex;
    const entry = this.entries.find(entry => entry.entryIndex === entryIndex);
    return entry;
  }

  loadEntries(bookIndex = null) {
    if (bookIndex == null) {
      bookIndex = getBookIndexFromURL();
    }
    const booksData = localStorage.getItem('books');
    const books = JSON.parse(booksData) || [];

    const book = books[bookIndex];
    if (book) {
      this.entries = book.entries || [];
    } else {
      this.entries = [];
    }

    const entryIndex = getEntryIndexFromURL(bookIndex);
    this.currentEntryIndex = entryIndex;
  }

  getEntryByIndex(entryIndex) {
    return this.entries.find(entry => entry.entryIndex === entryIndex);
  }

  updateCurrentEntryText(text) {
    const currentEntry = this.getCurrentEntry();
    if (currentEntry) {
      currentEntry.text = text;
    }
  }

  renderCurrentEntryTextPlaceholder() {
    const entryTextElement = document.getElementById('entryText');
    let entryText = entryTextElement.value;

    const updatedEntryText = Entry.formatAndReplaceMagicWordsText(entryText);

    const placeholderElement = document.getElementById('entryTextPlaceholder');
    placeholderElement.innerHTML = updatedEntryText;
  }

  static formatAndReplaceMagicWordsText(entryText, inpageLinks = false) {
    // Replace line breaks with <br />
    entryText = entryText.replace(/\n/g, '<br />');
  
    const updatedEntryText = entryText.replace(/\[ENTRY\((\d+)\)\]/g, (match, entryIndex) => {
      const bookIndex = getBookIndexFromURL();
      let link;
      
      if (inpageLinks) {
        link = `#entry_${entryIndex}`;
      } else {
        link = `write.html?bookIndex=${bookIndex}&entryIndex=${entryIndex}`;
      }

      return `<a class="entryLink" href="${link}">${entryIndex}</a>`;
    });

    return updatedEntryText;
  }
}

// Helper function to get the book index from the URL
function getBookIndexFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('bookIndex');
}

// Helper function to get the entry index from the URL or return the first entry index if not present
function getEntryIndexFromURL(bookIndex = null) {
  if (bookIndex == null) {
    bookIndex = getBookIndexFromURL();
  }
  const params = new URLSearchParams(window.location.search);
  const entryIndexParam = params.get('entryIndex');

  if (entryIndexParam) {
    return parseInt(entryIndexParam);
  } else {
    const book = booksManager.getBookByIndex(bookIndex);
    if (book && book.entries.length > 0) {
      return book.entries[0].entryIndex;
    }
  }

  return 0;
}

const entries = new Entry(); // Initialize the entries object
