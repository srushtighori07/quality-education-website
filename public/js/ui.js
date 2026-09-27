/**
 * EduQuality UI Components & Helper Utilities
 */

// Toast Notifications
function showToast(type = 'info', title = '', message = '', duration = 4000) {
  const stack = document.getElementById('toastStack');
  if (!stack) return;

  const icons = {
    success: 'fa-circle-check',
    error: 'fa-circle-xmark',
    warning: 'fa-triangle-exclamation',
    info: 'fa-circle-info'
  };

  const iconClass = icons[type] || icons.info;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="fas ${iconClass} toast-icon"></i>
    <div class="toast-content">
      <div class="toast-title">${escapeHtml(title)}</div>
      <div class="toast-message">${escapeHtml(message)}</div>
    </div>
    <button class="toast-close" title="Close"><i class="fas fa-xmark"></i></button>
  `;

  // Close button click
  toast.querySelector('.toast-close').addEventListener('click', () => {
    removeToast(toast);
  });

  stack.appendChild(toast);

  // Auto remove
  setTimeout(() => {
    removeToast(toast);
  }, duration);
}

function removeToast(toast) {
  if (!toast || toast.classList.contains('toast-hiding')) return;
  toast.classList.add('toast-hiding');
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 250);
}

// Modal Helpers
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Close modals when clicking backdrop
document.addEventListener('click', (e) => {
  if (e.target.classList && e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// Close modals with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(modal => {
      modal.classList.remove('open');
    });
    document.body.style.overflow = '';
  }
});

// Single Page Section Navigation
function navigateTo(sectionId) {
  // Update section visibility
  const sections = document.querySelectorAll('.page-section');
  sections.forEach(sec => sec.classList.remove('active'));

  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  // Update navigation link highlights
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    if (link.dataset.target === sectionId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Close mobile navigation drawer if open
  const navMenu = document.getElementById('navMenu');
  if (navMenu && navMenu.classList.contains('open')) {
    navMenu.classList.remove('open');
  }

  // Window scroll to top of content
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update window hash without triggering double jumps
  if (window.location.hash !== `#${sectionId}`) {
    history.pushState(null, '', `#${sectionId}`);
  }

  // Trigger data reload for dynamic sections
  if (sectionId === 'records') {
    if (typeof loadStudentsList === 'function') loadStudentsList();
  } else if (sectionId === 'dashboard') {
    if (typeof loadDashboardData === 'function') loadDashboardData();
  }
}

// Generate random unique enrollment ID
function generateEnrollmentNumber() {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(100 + Math.random() * 900); // 3 digits
  return `QE-${year}-${randomNum}`;
}

// Department to Course mapping helper
const departmentCourses = {
  'Computer Science & Engineering': [
    'B.Tech Computer Science & Engineering',
    'Bachelor of Computer Applications (BCA)',
    'M.Sc Cyber Security & Forensics'
  ],
  'Artificial Intelligence & Data Science': [
    'B.Tech AI & Data Science'
  ],
  'Business & Management': [
    'Master of Business Administration (MBA)'
  ],
  'Electronics & Communication': [
    'B.Tech Electronics & Communication'
  ],
  'Mechanical Engineering': [
    'B.Tech Mechanical Engineering'
  ],
  'Design & Digital Media': [
    'Bachelor of Design (B.Des)'
  ]
};

// Course to Department reverse mapping
const courseToDepartment = {
  'B.Tech Computer Science & Engineering': 'Computer Science & Engineering',
  'Bachelor of Computer Applications (BCA)': 'Computer Science & Engineering',
  'M.Sc Cyber Security & Forensics': 'Computer Science & Engineering',
  'B.Tech AI & Data Science': 'Artificial Intelligence & Data Science',
  'Master of Business Administration (MBA)': 'Business & Management',
  'B.Tech Electronics & Communication': 'Electronics & Communication',
  'B.Tech Mechanical Engineering': 'Mechanical Engineering',
  'Bachelor of Design (B.Des)': 'Design & Digital Media'
};

// Quick action from course card: Jump to registration and prepopulate course & department
function registerForCourse(courseName, deptName) {
  navigateTo('registration');

  setTimeout(() => {
    const deptSelect = document.getElementById('regDepartment');
    const courseSelect = document.getElementById('regCourse');

    if (deptSelect && deptName) {
      deptSelect.value = deptName;
    }
    if (courseSelect && courseName) {
      courseSelect.value = courseName;
    }

    // Generate enrollment ID if empty
    const enrollInput = document.getElementById('regEnrollment');
    if (enrollInput && !enrollInput.value) {
      enrollInput.value = generateEnrollmentNumber();
    }

    // Focus on Name field
    const nameInput = document.getElementById('regName');
    if (nameInput) {
      nameInput.focus();
    }

    showToast('info', 'Course Selected', `Pre-selected "${courseName}". Fill the remaining details to complete enrollment.`);
  }, 100);
}

// Escape HTML utility to prevent XSS
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Format date for UI display
function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return dateStr;
  }
}

// Form validation helpers
function clearErrors(formElement) {
  formElement.querySelectorAll('.form-control').forEach(el => el.classList.remove('is-invalid'));
  formElement.querySelectorAll('.field-error').forEach(el => el.textContent = '');
}

function setFieldError(fieldId, errorMsg) {
  const input = document.getElementById(fieldId);
  const errContainer = document.getElementById(`err-${fieldId}`);
  if (input) input.classList.add('is-invalid');
  if (errContainer) errContainer.textContent = errorMsg;
}
