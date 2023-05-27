// Function to handle form submission
function handleFormSubmit(event = null) {
  if (event) {
    event.preventDefault();
  }

  const titleInput = document.querySelector('#entryItem input[type="text"]');
  const textInput = document.querySelector('#entryItem textarea');

  const title = titleInput.value.trim();
  const text = textInput.value.trim();

  if (!title) {
    alert('First create a title to the current entry!');
    return false;
  }

  const bookIndex = getBookIndexFromURL();
  const entryIndex = getEntryIndexFromURL(bookIndex);

  const entry = { entryIndex, title, text };

  booksManager.addEntry(bookIndex, entry);

  // Reload the preview
  entries.renderCurrentEntryTextPlaceholder(); // Update the placeholder element

  const entryTree = new EntryTree();
  entryTree.renderEntryTreePlaceholder(entryIndex);

  return true;
}

// Function to retrieve the first entry for the given book index
function getFirstEntry(bookIndex = null) {
  if (bookIndex == null) {
    bookIndex = getBookIndexFromURL();
  }

  return entries.length > 0 ? entries[0] : null;
}

// Function to retrieve the first entry for the given book index
function getFirstEntryIndex(bookIndex = null) {
  if (bookIndex == null) {
    bookIndex = getBookIndexFromURL();
  }

  const entry = getFirstEntry(bookIndex);

  if (entry) {
    return entry.entryIndex;
  }

  return 1;
}

// Function to load the entry list
function loadEntry() {
  const bookIndex = getBookIndexFromURL();
  const entryIndex = getEntryIndexFromURL(bookIndex);

  const book = booksManager.getBookByIndex(bookIndex);
  if (book) {
    entries.loadEntries(bookIndex);

    const entry = entries.getEntryByIndex(entryIndex);
    if (entry) {
      // Populate the form with the existing entry data
      document.getElementById('entryIndexPlaceholder').innerHTML = entry.entryIndex;
      document.getElementById('entryTitle').value = entry.title;
      document.getElementById('entryText').value = entry.text;
    } else {
      // Clear the form if the entry doesn't exist (for creating a new entry)
      document.getElementById('entryIndexPlaceholder').innerHTML = '';
      document.getElementById('entryTitle').value = '';
      document.getElementById('entryText').value = '';
    }

    entries.renderCurrentEntryTextPlaceholder(); // Update the placeholder element
  }

  const entryTree = new EntryTree();
  entryTree.renderEntryTreePlaceholder(entryIndex);
}

// Helper function to create a new entry row
function createEntryRow(title, text, entryIndex) {
  const entryRow = document.createElement('tr');
  entryRow.classList.add('entry-list-item');
  entryRow.innerHTML = `
    <td>
      ${entryIndex}
    </td>
    <td>
      Title:<br />
      <input type="text" class="form-control" maxlength="20" id="entryTitle" value="${title}">
      Text:<br />
      <textarea class="form-control entry-text" id="entryText">${text}</textarea>
    </td>
  `;
  return entryRow;
}

// Function to delete an entry
function deleteEntry(bookIndex, entryIndex) {
  const confirmation = confirm('Are you sure you want to delete this entry?');
  if (confirmation) {
    booksManager.deleteEntry(bookIndex, entryIndex);
    loadEntry();
  }
}

function addEntryButton(action = 'new') {
  // save before inserting the new entry to make sure this entry exists first
  if (! handleFormSubmit()) {
    return false;
  }

  const bookIndex = getBookIndexFromURL(); // Retrieve the book index from the URL
  const book = booksManager.getBookByIndex(bookIndex);
  let entryIndex = booksManager.getLastEntryIndex() + 1; // Get the new entry index

  let title = `Entry ${entryIndex}`;
  const text = '';
  if (action == 'new') {
    let newTitle = prompt('Type a new title (optional)');

    if (newTitle == null) {
      return ;
    }

    newTitle ||= title;

    const entry = { entryIndex, title, text };

    booksManager.addEntry(bookIndex, entry);
  } else if (action == 'existing') {
    entryIndex = prompt('Type the index number');

    if (entryIndex == null) {
      return ;
    }
  } else {
    console.error('This action doent exist yet:' + action);
  }

  // Create the magic word with the new entry index
  const magicWord = `[ENTRY(${entryIndex})]`;

  // Append the magic word to the textarea
  const entryTextArea = document.getElementById('entryText');
  entryTextArea.value += magicWord;

  handleFormSubmit();
};

// Event listener for form submission
document.querySelector('form').addEventListener('submit', handleFormSubmit);

// Load the book title on page load
loadBookTitle();

// Load the entry list on page load
loadEntry();
