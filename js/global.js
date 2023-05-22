function exportLocalStorage() {
  const localStorageData = JSON.stringify(localStorage);
  const blob = new Blob([localStorageData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'localStorageData.json'; // File name with suggested extension
  link.click();
}

function openImportModal() {
  const modalHTML = `
    <div id="importModal" class="modal">
      <div class="modal-content">
        <h2>Import Backup File <span class="closeButton" id="closeButton">X</span></h2>
        <p>Warning: Importing a backup file will replace the current data in localStorage.</p>
        <p>Please select a JSON backup file to import:</p>
        <input type="file" id="backupFileInput" accept=".json">
      </div>
    </div>
  `;

  // Append the modal HTML to the document body
  const modalContainer = document.createElement('div');
  modalContainer.innerHTML = modalHTML;
  document.body.appendChild(modalContainer);

  // Open the modal
  const modal = document.getElementById('importModal');
  modal.style.display = 'block';

  // Add event listener to handle file selection
  const fileInput = document.getElementById('backupFileInput');
  fileInput.addEventListener('change', handleFileSelect, false);

  // Add event listener to close the modal when the close button is clicked
  const closeButton = document.getElementById('closeButton');
  closeButton.addEventListener('click', () => {
    document.body.removeChild(modalContainer); // Remove the modal element from the DOM
  });

  function handleFileSelect(event) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const backupData = JSON.parse(e.target.result);
        localStorage.clear();
        for (const key in backupData) {
          localStorage.setItem(key, backupData[key]);
        }
        alert('Backup file imported successfully!');
        location.reload();
      } catch (error) {
        alert('Error importing backup file. Please make sure the file is valid JSON.');
      }
      modal.style.display = 'none';
      // Clean up event listener
      fileInput.removeEventListener('change', handleFileSelect);
      // Remove the modal from the DOM
      document.body.removeChild(modalContainer);
    };

    reader.readAsText(file);
  }
}

function exportBookToHtml(bookIndex = null) {
  if (bookIndex == null) {
    bookIndex = getBookIndexFromURL();
  }
  if (! bookIndex) {
    console.error('No book to export!');
    return;
  }

  const bookTitle = booksManager.getBookByIndex(bookIndex).title;
  const entries = BooksManager.getEntriesFromBook(bookIndex);

  let htmlContent = `<style type="text/css">
    h1 h2 { text-indent: 0; text-align: center; page-break-before: always }
    a.entryLink { border: 1px dashed #555; padding: 3px 6px; }
  </style>`;

  // Add book title as the first page
  htmlContent += `<h1>${bookTitle}</h1>`;

  // Add each entry as a separate page
  for (const entry of entries) {
    const inpageLinks = true;
    const formattedText = Entry.formatAndReplaceMagicWordsText(entry.text, inpageLinks);

    // Add entry index as a title on each entry page
    htmlContent += `<a name="entry_${entry.entryIndex}"><h2># ${entry.entryIndex}</h2></a>`;

    // Add entry text
    htmlContent += `<p>${formattedText}</p>`;
  }

  htmlContent += '<h2>--</h2>';

  // Generate the .html file using the htmlContent
  const htmlBlob = new Blob([htmlContent], { type: 'application/octet-stream' });
  const htmlURL = URL.createObjectURL(htmlBlob);
  const a = document.createElement('a');
  a.href = htmlURL;
  a.download = `${bookTitle}.html`;
  a.click();

  // Clean up the URL object
  URL.revokeObjectURL(htmlURL);
}

// Helper function to get the book index from the URL
function getBookIndexFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('bookIndex');
}

// Function to load the book title
function loadBookTitle() {
  const bookIndex = getBookIndexFromURL();
  // Load books from local storage
  booksManager.loadBooks();
  const book = booksManager.books[bookIndex];
  const bookTitle = document.getElementById('bookTitle');
  bookTitle.textContent = `📖 ${book.title}`;

  // Set the book index in a hidden input field for reference
  const bookIndexInput = document.createElement('input');
  bookIndexInput.type = 'hidden';
  bookIndexInput.id = 'bookIndex';
  bookIndexInput.value = bookIndex;
  document.body.appendChild(bookIndexInput);
}
