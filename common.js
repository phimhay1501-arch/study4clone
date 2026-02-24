// ========================================
// COMMON UTILITIES & SHARED FUNCTIONALITY
// ========================================

// Navigation Active State
function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Mobile Menu Toggle
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
      }
    });
    
    // Close menu when clicking a link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
      });
    });
  }
}

// Modal Management
class Modal {
  constructor(modalId) {
    this.modal = document.getElementById(modalId);
    this.backdrop = this.modal?.closest('.modal-backdrop');
    this.init();
  }
  
  init() {
    if (!this.modal || !this.backdrop) return;
    
    // Close button
    const closeBtn = this.backdrop.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }
    
    // Click outside to close
    this.backdrop.addEventListener('click', (e) => {
      if (e.target === this.backdrop) {
        this.close();
      }
    });
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.backdrop.classList.contains('active')) {
        this.close();
      }
    });
  }
  
  open() {
    if (this.backdrop) {
      this.backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }
  
  close() {
    if (this.backdrop) {
      this.backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
}

// Login/Register Modal Management
let loginModal, registerModal;

function initAuthModals() {
  // Create modals if they don't exist
  if (!document.getElementById('loginModal')) {
    createAuthModals();
  }
  
  loginModal = new Modal('loginModal');
  registerModal = new Modal('registerModal');
  
  // Login button
  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      loginModal.open();
    });
  }
  
  // Register button
  const registerBtn = document.getElementById('registerBtn');
  if (registerBtn) {
    registerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      registerModal.open();
    });
  }
  
  // Switch between login and register
  const showRegisterLink = document.getElementById('showRegister');
  const showLoginLink = document.getElementById('showLogin');
  
  if (showRegisterLink) {
    showRegisterLink.addEventListener('click', (e) => {
      e.preventDefault();
      loginModal.close();
      setTimeout(() => registerModal.open(), 200);
    });
  }
  
  if (showLoginLink) {
    showLoginLink.addEventListener('click', (e) => {
      e.preventDefault();
      registerModal.close();
      setTimeout(() => loginModal.open(), 200);
    });
  }
  
  // Form submissions
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }
}

function createAuthModals() {
  const modalsHTML = `
    <!-- Login Modal -->
    <div class="modal-backdrop" id="loginBackdrop">
      <div class="modal" id="loginModal" style="position: relative;">
        <button class="modal-close" aria-label="Close">×</button>
        <div class="modal-header">
          <h2 class="modal-title">Welcome Back</h2>
          <p class="text-muted">Login to continue your learning journey</p>
        </div>
        <form id="loginForm">
          <div class="form-group">
            <label class="form-label" for="loginEmail">Email</label>
            <input type="email" id="loginEmail" class="form-input" placeholder="your@email.com" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="loginPassword">Password</label>
            <input type="password" id="loginPassword" class="form-input" placeholder="••••••••" required>
          </div>
          <div class="form-group">
            <div class="form-checkbox">
              <input type="checkbox" id="rememberMe">
              <label for="rememberMe">Remember me</label>
            </div>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%;">Login</button>
          <p class="text-center mt-4">
            Don't have an account? <a href="#" id="showRegister" class="text-primary font-semibold">Register</a>
          </p>
        </form>
      </div>
    </div>
    
    <!-- Register Modal -->
    <div class="modal-backdrop" id="registerBackdrop">
      <div class="modal" id="registerModal" style="position: relative;">
        <button class="modal-close" aria-label="Close">×</button>
        <div class="modal-header">
          <h2 class="modal-title">Create Account</h2>
          <p class="text-muted">Start your learning journey today</p>
        </div>
        <form id="registerForm">
          <div class="form-group">
            <label class="form-label" for="registerName">Full Name</label>
            <input type="text" id="registerName" class="form-input" placeholder="John Doe" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="registerEmail">Email</label>
            <input type="email" id="registerEmail" class="form-input" placeholder="your@email.com" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="registerPassword">Password</label>
            <input type="password" id="registerPassword" class="form-input" placeholder="••••••••" required>
          </div>
          <div class="form-group">
            <div class="form-checkbox">
              <input type="checkbox" id="acceptTerms" required>
              <label for="acceptTerms">I accept the terms and conditions</label>
            </div>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%;">Create Account</button>
          <p class="text-center mt-4">
            Already have an account? <a href="#" id="showLogin" class="text-primary font-semibold">Login</a>
          </p>
        </form>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalsHTML);
}

// Mock Authentication
function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  // Mock authentication
  if (email && password) {
    localStorage.setItem('user', JSON.stringify({ email, name: email.split('@')[0] }));
    showAlert('Login successful!', 'success');
    loginModal.close();
    updateAuthUI();
  }
}

function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  
  // Mock registration
  if (name && email && password) {
    localStorage.setItem('user', JSON.stringify({ email, name }));
    showAlert('Account created successfully!', 'success');
    registerModal.close();
    updateAuthUI();
  }
}

function updateAuthUI() {
  const user = JSON.parse(localStorage.getItem('user'));
  const loginBtn = document.getElementById('loginBtn');
  const navActions = document.querySelector('.nav-actions');
  
  if (user && navActions) {
    loginBtn.textContent = user.name;
    loginBtn.onclick = (e) => {
      e.preventDefault();
      window.location.href = 'dashboard.html';
    };
  }
}

// Alert/Notification System
function showAlert(message, type = 'info') {
  const alertHTML = `
    <div class="alert alert-${type} slide-down" style="position: fixed; top: 80px; right: 20px; z-index: 9999; min-width: 300px;">
      ${message}
    </div>
  `;
  
  const alertEl = document.createElement('div');
  alertEl.innerHTML = alertHTML;
  document.body.appendChild(alertEl);
  
  setTimeout(() => {
    alertEl.remove();
  }, 3000);
}

// Smooth Scroll
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Format Number with Commas
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Format Date
function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
}

// Truncate Text
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
}

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  initMobileMenu();
  initAuthModals();
  initSmoothScroll();
  updateAuthUI();
});

// Export for use in other files
window.Modal = Modal;
window.showAlert = showAlert;
window.formatNumber = formatNumber;
window.formatDate = formatDate;
window.truncateText = truncateText;
