// Test Data
let testsData = [];
let filteredTests = [];

document.addEventListener('DOMContentLoaded', () => {
  fetchTests();
  document.getElementById('applyFilters').addEventListener('click', applyFilters);
});

async function fetchTests() {
  try {
    const response = await fetch('data/tests.json');
    if (!response.ok) throw new Error('Failed to fetch tests');
    testsData = await response.json();
    filteredTests = [...testsData];
    renderTests();
  } catch (error) {
    console.error('Error loading tests:', error);
    document.getElementById('testsGrid').innerHTML = '<p class="text-center" style="grid-column: 1/-1; color: var(--color-error)">Failed to load tests. Please try again later.</p>';
  }
}

function applyFilters() {
  const type = document.getElementById('filterType').value;
  const skill = document.getElementById('filterSkill').value;
  const difficulty = document.getElementById('filterDifficulty').value;

  filteredTests = testsData.filter(test => {
    return (type === 'all' || test.type === type) &&
      (skill === 'all' || test.skill === skill) &&
      (difficulty === 'all' || test.difficulty === difficulty);
  });

  renderTests();
}

function renderTests() {
  const grid = document.getElementById('testsGrid');

  if (filteredTests.length === 0) {
    grid.innerHTML = '<div class="card" style="grid-column: 1 / -1; text-center; padding: 60px;"><p>No tests found matching your filters.</p></div>';
    return;
  }

  grid.innerHTML = filteredTests.map(test => `
    <div class="card">
      <div class="flex-between mb-3">
        <span class="badge badge-${test.type === 'ielts' ? 'primary' : 'success'}">${test.type.toUpperCase()} ${test.skill}</span>
        <span style="color: var(--color-gray-500); font-size: 0.875rem;">⏱️ ${test.duration} min</span>
      </div>
      <h3 style="margin-bottom: 12px; font-size: 1.125rem;">${test.title}</h3>
      <p style="color: var(--color-gray-600); font-size: 0.875rem; margin-bottom: 16px;">
        ${test.sections} sections • ${test.questions} questions
      </p>
      <div class="flex-between" style="font-size: 0.875rem; color: var(--color-gray-500); margin-bottom: 16px;">
        <span>👥 ${formatNumber(test.attempts)}</span>
        <span>⭐ ${test.rating}</span>
      </div>
      <div class="flex gap-2">
        <a href="test-interface.html?id=${test.id}" class="btn btn-primary btn-sm" style="flex: 1;">Start Test</a>
        <button class="btn btn-outline btn-sm" onclick="showTestDetails(${test.id})">Details</button>
      </div>
    </div>
  `).join('');
}

function showTestDetails(id) {
  const test = testsData.find(t => t.id === id);
  showAlert(`${test.title} - ${test.questions} questions, ${test.duration} minutes`, 'info');
}
