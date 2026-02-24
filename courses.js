// Courses Data
let coursesData = [];
let filteredCourses = [];

document.addEventListener('DOMContentLoaded', () => {
  fetchCourses();
  document.getElementById('applyFilters').addEventListener('click', applyFilters);
});

async function fetchCourses() {
  try {
    const response = await fetch('data/courses.json');
    if (!response.ok) throw new Error('Failed to fetch courses');
    coursesData = await response.json();
    filteredCourses = [...coursesData];
    renderCourses();
  } catch (error) {
    console.error('Error loading courses:', error);
    document.getElementById('coursesGrid').innerHTML = '<p class="text-center" style="grid-column: 1/-1; color: var(--color-error)">Failed to load courses. Please try again later.</p>';
  }
}

function applyFilters() {
  const category = document.getElementById('filterCategory').value;
  const level = document.getElementById('filterLevel').value;
  const sort = document.getElementById('sortBy').value;

  filteredCourses = coursesData.filter(course => {
    return (category === 'all' || course.category === category) &&
      (level === 'all' || course.level === level);
  });

  // Sort
  if (sort === 'popular') {
    filteredCourses.sort((a, b) => b.students - a.students);
  } else if (sort === 'rating') {
    filteredCourses.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'price') {
    filteredCourses.sort((a, b) => a.price - b.price);
  }

  renderCourses();
}

function renderCourses() {
  const grid = document.getElementById('coursesGrid');

  grid.innerHTML = filteredCourses.map(course => {
    const discount = Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100);

    return `
      <div class="card">
        <div style="width: 100%; height: 200px; background: linear-gradient(135deg, ${getCourseGradient(course.category)}); border-radius: 12px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; font-size: 4rem;">
          ${course.icon}
        </div>
        <div class="badge badge-primary mb-2">${course.category.toUpperCase()}</div>
        <h3 class="card-title">${course.title}</h3>
        <p style="color: var(--color-gray-600); margin-bottom: 16px;">${course.description}</p>
        
        <div class="flex-between mb-4" style="font-size: 0.875rem; color: var(--color-gray-500);">
          <span>⭐ ${course.rating} (${Math.floor(course.students / 20)})</span>
          <span>👥 ${formatNumber(course.students)}</span>
        </div>
        
        <div class="card-footer">
          <div>
            <span style="font-size: 1.5rem; font-weight: 700; color: var(--color-primary);">$${course.price}</span>
            <span style="text-decoration: line-through; color: var(--color-gray-400); margin-left: 8px;">$${course.originalPrice}</span>
            <span class="badge badge-success" style="margin-left: 8px;">-${discount}%</span>
          </div>
          <a href="course-detail.html?id=${course.id}" class="btn btn-primary btn-sm">View Course</a>
        </div>
      </div>
    `;
  }).join('');
}

function getCourseGradient(category) {
  const gradients = {
    ielts: 'var(--color-primary) 0%, var(--color-rose) 100%',
    toeic: 'var(--color-secondary) 0%, var(--color-indigo) 100%',
    speaking: 'var(--color-teal) 0%, var(--color-cyan) 100%',
    writing: 'var(--color-indigo) 0%, var(--color-rose) 100%'
  };
  return gradients[category] || gradients.ielts;
}
