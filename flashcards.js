// Mock Flashcard Decks
const decksData = [
    { id: 1, name: 'IELTS Academic Vocabulary', total: 500, mastered: 320, learning: 150, new: 30, lastStudied: '2026-01-29' },
    { id: 2, name: 'TOEIC Business English', total: 350, mastered: 200, learning: 100, new: 50, lastStudied: '2026-01-28' },
    { id: 3, name: 'Common Phrasal Verbs', total: 200, mastered: 150, learning: 40, new: 10, lastStudied: '2026-01-27' },
    { id: 4, name: 'Advanced Adjectives', total: 180, mastered: 80, learning: 70, new: 30, lastStudied: '2026-01-26' },
    { id: 5, name: 'Academic Writing Vocabulary', total: 300, mastered: 120, learning: 130, new: 50, lastStudied: '2026-01-25' },
    { id: 6, name: 'Everyday Conversations', total: 250, mastered: 180, learning: 50, new: 20, lastStudied: '2026-01-24' },
];

document.addEventListener('DOMContentLoaded', () => {
    renderDecks();
    document.getElementById('createDeckBtn').addEventListener('click', createDeck);
});

function renderDecks() {
    const grid = document.getElementById('decksGrid');

    grid.innerHTML = decksData.map(deck => {
        const progress = Math.round((deck.mastered / deck.total) * 100);

        return `
      <div class="card">
        <h3 style="margin-bottom: 16px;">${deck.name}</h3>
        
        <div class="mb-4">
          <div class="flex-between mb-2" style="font-size: 0.875rem;">
            <span style="color: var(--color-gray-600);">Progress</span>
            <span style="font-weight: 600; color: var(--color-primary);">${progress}%</span>
          </div>
          <div style="height: 8px; background: var(--color-gray-200); border-radius: var(--radius-full); overflow: hidden;">
            <div style="height: 100%; width: ${progress}%; background: var(--gradient-primary);"></div>
          </div>
        </div>
        
        <div class="grid grid-3 gap-2 mb-4" style="font-size: 0.875rem; text-align: center;">
          <div>
            <div style="font-weight: 700; color: var(--color-secondary);">${deck.mastered}</div>
            <div style="color: var(--color-gray-500);">Mastered</div>
          </div>
          <div>
            <div style="font-weight: 700; color: var(--color-primary);">${deck.learning}</div>
            <div style="color: var(--color-gray-500);">Learning</div>
          </div>
          <div>
            <div style="font-weight: 700; color: var(--color-gray-600);">${deck.new}</div>
            <div style="color: var(--color-gray-500);">New</div>
          </div>
        </div>
        
        <p style="font-size: 0.875rem; color: var(--color-gray-500); margin-bottom: 16px;">
          Last studied: ${formatDate(deck.lastStudied)}
        </p>
        
        <div class="flex gap-2">
          <a href="flashcard-study.html?id=${deck.id}" class="btn btn-primary btn-sm" style="flex: 1;">Study Now</a>
          <button class="btn btn-outline btn-sm" onclick="editDeck(${deck.id})">Edit</button>
        </div>
      </div>
    `;
    }).join('');
}

function createDeck() {
    showAlert('Create deck feature - Add your own flashcards here!', 'info');
}

function editDeck(id) {
    const deck = decksData.find(d => d.id === id);
    showAlert(`Edit deck: ${deck.name}`, 'info');
}
