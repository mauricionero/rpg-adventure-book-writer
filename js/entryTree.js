class EntryTree {
  constructor() {
    this.entryIndices = [];
    this.currentEntry = getEntryIndexFromURL();
  }

  renderEntryTree(entryIndex) {
    const bookIndex = getBookIndexFromURL();

    const entries = new Entry();
    entries.loadEntries(bookIndex);
    const entry = entries.getEntryByIndex(entryIndex);
    if (!entry) {
      return ''; // Entry not found
    }

    const relatedEntryIndices = this.extractRelatedEntryIndices(entry.text);
    const hasRelatedEntries = relatedEntryIndices.length > 0;
    const isCurrentIndex = this.currentEntry == entryIndex;
    const currentEntryIndicator = isCurrentIndex ? '➡️' : '';

    const entryLinkText = `${currentEntryIndicator} #${entry.entryIndex} - ${entry.title}`;

    const entryLink = `write.html?bookIndex=${bookIndex}&entryIndex=${entry.entryIndex}`;
    let entryTree = isCurrentIndex ? `<li>${entryLinkText}` : `<li><a href="${entryLink}">${entryLinkText}</a>`;
    entryTree += hasRelatedEntries ? '<ul>' : '';

    // Prevent infinite loop
    if (! this.entryIndices.includes(entryIndex)) {
      this.entryIndices.push(entryIndex);
      for (const relatedEntryIndex of relatedEntryIndices) {
        const relatedEntryTree = this.renderEntryTree(relatedEntryIndex);
        entryTree += relatedEntryTree;
      }
    }

    entryTree += hasRelatedEntries ? '</ul>' : '';
    entryTree += '</li>';

    const entryColor = hasRelatedEntries ? 'green' : 'red';
    entryTree = `<span class="li-items" style="color:${entryColor}">${entryTree}</span>`;

    return entryTree;
  }

  renderEntryTreePlaceholder(entryIndex) {
    this.entryIndices = [];
    let entryTreeElement = document.getElementById('entryTree');
    entryTreeElement.innerHTML = this.renderEntryTree(entryIndex);

    this.entryIndices = [];
    entryTreeElement = document.getElementById('entryTreeComplete');
    entryIndex = getFirstEntryIndex();
    entryTreeElement.innerHTML = this.renderEntryTree(entryIndex);
  }

  extractRelatedEntryIndices(text) {
    const regex = /\[ENTRY\((\d+)\)\]/g;
    const relatedEntryIndices = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
      const entryIndex = parseInt(match[1]);
      relatedEntryIndices.push(entryIndex);
    }

    return relatedEntryIndices;
  }
}
