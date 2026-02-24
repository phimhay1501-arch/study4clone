// Dictionary Mock Data
const dictionaryData = {
    'hello': {
        word: 'hello',
        pronunciation: '/həˈloʊ/',
        definitions: [
            { type: 'exclamation', text: 'Used as a greeting or to begin a phone conversation' },
            { type: 'noun', text: 'An utterance of "hello"; a greeting' }
        ],
        examples: [
            'Hello, how are you today?',
            'She answered the phone with a cheerful hello',
            'Hello! Is anyone there?'
        ],
        synonyms: ['hi', 'hey', 'greetings', 'salutations'],
        antonyms: ['goodbye', 'farewell'],
        vietnamese: 'xin chào, chào'
    },
    'study': {
        word: 'study',
        pronunciation: '/ˈstʌdi/',
        definitions: [
            { type: 'verb', text: 'Devote time and attention to gaining knowledge of an academic subject' },
            { type: 'noun', text: 'The devotion of time and attention to gaining knowledge' },
            { type: 'noun', text: 'A room used or designed for reading, writing, or academic work' }
        ],
        examples: [
            'I need to study for my exam tomorrow',
            'She is studying medicine at university',
            'The study of languages requires dedication'
        ],
        synonyms: ['learn', 'research', 'examine', 'analyze'],
        antonyms: ['ignore', 'neglect'],
        vietnamese: 'học, nghiên cứu'
    },
    'practice': {
        word: 'practice',
        pronunciation: '/ˈpræktɪs/',
        definitions: [
            { type: 'noun', text: 'The actual application or use of an idea, belief, or method' },
            { type: 'verb', text: 'Perform an activity repeatedly to improve skill' },
            { type: 'noun', text: 'The customary or expected procedure' }
        ],
        examples: [
            'Practice makes perfect',
            'I practice the piano every day',
            'It is common practice to shake hands when meeting someone'
        ],
        synonyms: ['exercise', 'rehearse', 'train', 'drill'],
        antonyms: ['theory', 'neglect'],
        vietnamese: 'thực hành, luyện tập'
    },
    'learn': {
        word: 'learn',
        pronunciation: '/lɜːrn/',
        definitions: [
            { type: 'verb', text: 'Gain or acquire knowledge of or skill in something' },
            { type: 'verb', text: 'Become aware of something by information or from observation' }
        ],
        examples: [
            'Children learn best through play',
            'I learned to speak French in school',
            'We learned that the meeting was cancelled'
        ],
        synonyms: ['study', 'master', 'grasp', 'understand'],
        antonyms: ['forget', 'unlearn'],
        vietnamese: 'học, học hỏi'
    },
    'vocabulary': {
        word: 'vocabulary',
        pronunciation: '/voʊˈkæbjəleri/',
        definitions: [
            { type: 'noun', text: 'The body of words used in a particular language' },
            { type: 'noun', text: 'The words known to an individual person' }
        ],
        examples: [
            'Reading helps expand your vocabulary',
            'She has an impressive vocabulary',
            'Technical vocabulary can be difficult to learn'
        ],
        synonyms: ['lexicon', 'wordbook', 'glossary'],
        antonyms: [],
        vietnamese: 'từ vựng'
    }
};

// State
let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
let favoriteWords = JSON.parse(localStorage.getItem('favoriteWords')) || [];
let currentWord = null;
let showingVietnamese = false;

// Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const wordResult = document.getElementById('wordResult');
const emptyState = document.getElementById('emptyState');
const suggestions = document.getElementById('suggestions');
const suggestionsList = document.getElementById('suggestionsList');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderRecentSearches();
    renderFavorites();

    // Event listeners
    searchBtn.addEventListener('click', handleSearch);
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchInput.focus();
    });

    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        } else {
            showSuggestions();
        }
    });

    searchInput.addEventListener('focus', showSuggestions);

    document.getElementById('favoriteBtn')?.addEventListener('click', toggleFavorite);
    document.getElementById('showEnglish')?.addEventListener('click', () => switchLanguage(false));
    document.getElementById('showVietnamese')?.addEventListener('click', () => switchLanguage(true));
});

// Search functionality
function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return;

    const wordData = dictionaryData[query];

    if (wordData) {
        currentWord = query;
        displayWord(wordData);
        addToRecentSearches(query);
        suggestions.style.display = 'none';
    } else {
        showAlert('Word not found. Try another word.', 'error');
    }
}

function showSuggestions() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
        suggestions.style.display = 'none';
        return;
    }

    const matches = Object.keys(dictionaryData).filter(word =>
        word.startsWith(query) && word !== query
    );

    if (matches.length > 0) {
        suggestionsList.innerHTML = matches.map(word =>
            `<button class="btn btn-sm btn-ghost" onclick="selectSuggestion('${word}')">${word}</button>`
        ).join('');
        suggestions.style.display = 'block';
    } else {
        suggestions.style.display = 'none';
    }
}

function selectSuggestion(word) {
    searchInput.value = word;
    handleSearch();
}

// Display word
function displayWord(wordData) {
    emptyState.style.display = 'none';
    wordResult.style.display = 'block';

    document.getElementById('wordTitle').textContent = wordData.word;
    document.getElementById('wordPronunciation').textContent = wordData.pronunciation;

    // Definitions
    const definitionsHTML = `
    <h3 style="margin-bottom: 16px;">Definitions</h3>
    ${wordData.definitions.map((def, i) => `
      <div style="margin-bottom: 16px;">
        <span class="badge badge-primary">${def.type}</span>
        <p style="margin-top: 8px; color: var(--color-gray-700);">${i + 1}. ${def.text}</p>
      </div>
    `).join('')}
  `;
    document.getElementById('definitions').innerHTML = definitionsHTML;

    // Examples
    const examplesHTML = `
    <h3 style="margin-bottom: 16px;">Examples</h3>
    ${wordData.examples.map(ex => `
      <p style="padding: 12px; background: var(--color-gray-100); border-radius: var(--radius-md); margin-bottom: 8px;">
        "${ex}"
      </p>
    `).join('')}
  `;
    document.getElementById('examples').innerHTML = examplesHTML;

    // Synonyms
    if (wordData.synonyms.length > 0) {
        document.getElementById('synonymsSection').innerHTML = `
      <div>
        <h4 style="margin-bottom: 12px;">Synonyms</h4>
        <div class="flex gap-2" style="flex-wrap: wrap;">
          ${wordData.synonyms.map(syn => `
            <span class="badge badge-success">${syn}</span>
          `).join('')}
        </div>
      </div>
    `;
    }

    // Antonyms
    if (wordData.antonyms.length > 0) {
        document.getElementById('antonymsSection').innerHTML = `
      <div>
        <h4 style="margin-bottom: 12px;">Antonyms</h4>
        <div class="flex gap-2" style="flex-wrap: wrap;">
          ${wordData.antonyms.map(ant => `
            <span class="badge badge-error">${ant}</span>
          `).join('')}
        </div>
      </div>
    `;
    }

    // Update favorite button
    updateFavoriteButton();
}

// Language switch
function switchLanguage(toVietnamese) {
    showingVietnamese = toVietnamese;
    const wordData = dictionaryData[currentWord];

    if (toVietnamese) {
        document.getElementById('showVietnamese').classList.remove('btn-outline');
        document.getElementById('showVietnamese').classList.add('btn-primary');
        document.getElementById('showEnglish').classList.remove('btn-primary');
        document.getElementById('showEnglish').classList.add('btn-outline');

        document.getElementById('definitions').innerHTML = `
      <h3 style="margin-bottom: 16px;">Vietnamese Translation</h3>
      <p style="font-size: 1.25rem; color: var(--color-primary); font-weight: 600;">${wordData.vietnamese}</p>
    `;
    } else {
        document.getElementById('showEnglish').classList.remove('btn-outline');
        document.getElementById('showEnglish').classList.add('btn-primary');
        document.getElementById('showVietnamese').classList.remove('btn-primary');
        document.getElementById('showVietnamese').classList.add('btn-outline');

        displayWord(wordData);
    }
}

// Recent searches
function addToRecentSearches(word) {
    recentSearches = recentSearches.filter(w => w !== word);
    recentSearches.unshift(word);
    recentSearches = recentSearches.slice(0, 10);
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    renderRecentSearches();
}

function renderRecentSearches() {
    const container = document.getElementById('recentSearches');
    if (recentSearches.length === 0) {
        container.innerHTML = '<p class="text-muted text-sm">No recent searches</p>';
        return;
    }

    container.innerHTML = `
    <div class="flex-col gap-2">
      ${recentSearches.map(word => `
        <button class="btn btn-ghost btn-sm" style="justify-content: flex-start;" onclick="selectSuggestion('${word}')">
          ${word}
        </button>
      `).join('')}
    </div>
  `;
}

// Favorites
function toggleFavorite() {
    if (!currentWord) return;

    if (favoriteWords.includes(currentWord)) {
        favoriteWords = favoriteWords.filter(w => w !== currentWord);
        showAlert('Removed from favorites', 'info');
    } else {
        favoriteWords.push(currentWord);
        showAlert('Added to favorites', 'success');
    }

    localStorage.setItem('favoriteWords', JSON.stringify(favoriteWords));
    updateFavoriteButton();
    renderFavorites();
}

function updateFavoriteButton() {
    const btn = document.getElementById('favoriteBtn');
    if (favoriteWords.includes(currentWord)) {
        btn.textContent = '⭐ Favorited';
        btn.classList.remove('btn-secondary');
        btn.classList.add('btn-primary');
    } else {
        btn.textContent = '⭐ Add to Favorites';
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-secondary');
    }
}

function renderFavorites() {
    const container = document.getElementById('favoriteWords');
    if (favoriteWords.length === 0) {
        container.innerHTML = '<p class="text-muted text-sm">No favorites yet</p>';
        return;
    }

    container.innerHTML = `
    <div class="flex-col gap-2">
      ${favoriteWords.map(word => `
        <button class="btn btn-ghost btn-sm" style="justify-content: flex-start;" onclick="selectSuggestion('${word}')">
          ⭐ ${word}
        </button>
      `).join('')}
    </div>
  `;
}
