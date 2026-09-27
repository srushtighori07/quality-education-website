/**
 * Quality Education Portal - Application Controller
 * Manages 11 distinct sections, restricted Owner Excel registry, interactive quiz engine,
 * attendance records lookup, course syllabus modals, and feedback ratings.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initRegistrationForm();
  initOwnerAccess();
  initCourses();
  initStudyMaterials();
  initQuizEngine();
  initAttendanceLookup();
  initAnnouncements();
  initTeacherConsultations();
  initFeedbackSystem();
  initHelpDesk();
});

/* ==========================================================================
   1. NAVIGATION & GENERAL UI
   ========================================================================== */
function initNavigation() {
  const navLinks = document.getElementById('navLinks');
  const mobileToggle = document.getElementById('mobileToggle');
  const allNavAnchors = document.querySelectorAll('.nav-link');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });
  }

  // Smooth scroll and active state sync
  allNavAnchors.forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      allNavAnchors.forEach(a => a.classList.remove('active'));
      anchor.classList.add('active');
      if (navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        const icon = mobileToggle?.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      }
    });
  });

  // Intersection observer to highlight current active section in nav
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      allNavAnchors.forEach(anchor => {
        const href = anchor.getAttribute('href');
        if (href === `#${currentId}`) {
          anchor.classList.add('active');
        } else {
          anchor.classList.remove('active');
        }
      });
    }
  });

  // Set default enrollment date to today
  const regDateInput = document.getElementById('regEnrollDate');
  if (regDateInput && !regDateInput.value) {
    const today = new Date().toISOString().split('T')[0];
    regDateInput.value = today;
  }
}

/* ==========================================================================
   2. STUDENT REGISTRATION (WITH DIRECT EXCEL .XLSX STORAGE)
   ========================================================================== */
function initRegistrationForm() {
  const form = document.getElementById('studentRegistrationForm');
  const successAlert = document.getElementById('regSuccessAlert');
  const errorAlert = document.getElementById('regErrorAlert');
  const successMsg = document.getElementById('regSuccessMsg');
  const errorMsg = document.getElementById('regErrorMsg');
  const submitBtn = document.getElementById('submitRegBtn');
  const resetBtn = document.getElementById('resetRegBtn');

  // Input elements
  const inputId = document.getElementById('regStudentId');
  const inputName = document.getElementById('regStudentName');
  const inputAge = document.getElementById('regAge');
  const selectGender = document.getElementById('regGender');
  const inputEmail = document.getElementById('regEmail');
  const inputContact = document.getElementById('regContact');
  const selectCourse = document.getElementById('regCourse');
  const inputDate = document.getElementById('regEnrollDate');

  if (!form) return;

  // Clear validation styling on input
  [inputId, inputName, inputAge, selectGender, inputEmail, inputContact, selectCourse, inputDate].forEach(field => {
    if (!field) return;
    field.addEventListener('input', () => {
      field.classList.remove('is-invalid');
      const errBox = document.getElementById(`err${field.id.replace('reg', '')}`);
      if (errBox) errBox.classList.remove('show');
    });
    field.addEventListener('change', () => {
      field.classList.remove('is-invalid');
    });
  });

  resetBtn?.addEventListener('click', () => {
    form.reset();
    const today = new Date().toISOString().split('T')[0];
    if (inputDate) inputDate.value = today;
    successAlert.classList.remove('show');
    errorAlert.classList.remove('show');
    document.querySelectorAll('.field-error').forEach(e => e.classList.remove('show'));
    document.querySelectorAll('.is-invalid').forEach(e => e.classList.remove('is-invalid'));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    successAlert.classList.remove('show');
    errorAlert.classList.remove('show');

    // Validation checks
    let isValid = true;

    // 1. Student ID
    const studentIdVal = inputId.value.trim().toUpperCase();
    if (!studentIdVal) {
      showFieldError('StudentId', 'Student ID is required.');
      isValid = false;
    }

    // 2. Student Name
    const studentNameVal = inputName.value.trim();
    if (!studentNameVal || studentNameVal.length < 2) {
      showFieldError('StudentName', 'Please provide a valid student full name.');
      isValid = false;
    }

    // 3. Age
    const ageVal = parseInt(inputAge.value, 10);
    if (isNaN(ageVal) || ageVal < 10 || ageVal > 100) {
      showFieldError('Age', 'Please enter a valid age between 10 and 100.');
      isValid = false;
    }

    // 4. Gender
    const genderVal = selectGender.value;
    if (!genderVal) {
      showFieldError('Gender', 'Please select a gender option.');
      isValid = false;
    }

    // 5. Email
    const emailVal = inputEmail.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal || !emailRegex.test(emailVal)) {
      showFieldError('Email', 'Please enter a valid email address (e.g. name@domain.com).');
      isValid = false;
    }

    // 6. Contact Number
    const contactVal = inputContact.value.trim();
    const digitsOnly = contactVal.replace(/[^0-9]/g, '');
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      showFieldError('Contact', 'Please enter a valid phone number (7 to 15 digits).');
      isValid = false;
    }

    // 7. Class/Course
    const courseVal = selectCourse.value;
    if (!courseVal) {
      showFieldError('Course', 'Please select an accredited class or course.');
      isValid = false;
    }

    // 8. Enrollment Date
    const dateVal = inputDate.value.trim();
    if (!dateVal) {
      showFieldError('EnrollDate', 'Please pick a valid enrollment date.');
      isValid = false;
    }

    if (!isValid) {
      showErrorAlert('Please review and correct the highlighted fields.');
      return;
    }

    // Build payload
    const payload = {
      student_id: studentIdVal,
      student_name: studentNameVal,
      age: ageVal,
      gender: genderVal,
      email: emailVal,
      contact_number: contactVal,
      class_course: courseVal,
      enrollment_date: dateVal
    };

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Registration...';

    try {
      await EduAPI.registerStudent(payload);

      // Succeeded!
      showSuccessAlert(
        `Student "${studentNameVal}" (${studentIdVal}) has been successfully enrolled! All information has been verified and permanently archived into the institutional database.`
      );

      showToast(`Registration verified for ${studentNameVal} (${studentIdVal})`, 'success');

      // Reset form fields
      form.reset();
      const today = new Date().toISOString().split('T')[0];
      if (inputDate) inputDate.value = today;

    } catch (err) {
      console.error('Registration failed:', err);
      const isDuplicate = err.status === 409 || err.message.toLowerCase().includes('already exists');
      
      if (isDuplicate) {
        showFieldError('StudentId', `Student ID "${studentIdVal}" is already registered. Please choose a unique ID.`);
        showErrorAlert(`Duplicate Student ID Detected: "${studentIdVal}" already exists in the institutional registry.`);
      } else {
        showErrorAlert(err.message || 'An error occurred during registration. Please check server connection.');
      }

      showToast(err.message || 'Registration failed', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Submit Registration';
    }
  });

  function showFieldError(fieldKey, message) {
    const fieldInput = document.getElementById(`reg${fieldKey}`);
    const errEl = document.getElementById(`err${fieldKey}`);
    if (fieldInput) fieldInput.classList.add('is-invalid');
    if (errEl) {
      errEl.textContent = message;
      errEl.classList.add('show');
    }
  }

  function showSuccessAlert(msg) {
    if (successMsg) successMsg.textContent = msg;
    if (successAlert) successAlert.classList.add('show');
    if (errorAlert) errorAlert.classList.remove('show');
    successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function showErrorAlert(msg) {
    if (errorMsg) errorMsg.textContent = msg;
    if (errorAlert) errorAlert.classList.add('show');
    if (successAlert) successAlert.classList.remove('show');
    errorAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/* ==========================================================================
   3. RESTRICTED OWNER ACCESS TO EXCEL (.XLSX) REGISTRY
   (Only the main website owner can download or view Excel records)
   ========================================================================== */
function initOwnerAccess() {
  const modal = document.getElementById('ownerAccessModal');
  const footerLink = document.getElementById('footerOwnerLink');
  const footerLockBtn = document.getElementById('footerLockBtn');
  const closeBtn = document.getElementById('closeOwnerModalBtn');
  const closeBottomBtn = document.getElementById('closeOwnerModalBottomBtn');

  // Views inside modal
  const loginView = document.getElementById('ownerLoginView');
  const consoleView = document.getElementById('ownerConsoleView');
  const loginForm = document.getElementById('ownerLoginForm');
  const passkeyInput = document.getElementById('ownerPasskeyInput');
  const passkeyError = document.getElementById('errOwnerPasskey');
  const authSubmitBtn = document.getElementById('submitOwnerAuthBtn');

  // Authenticated Console Controls
  const recordCountEl = document.getElementById('ownerRecordCount');
  const tableBody = document.getElementById('ownerExcelTableBody');
  const downloadExcelBtn = document.getElementById('ownerDownloadExcelBtn');
  const logoutBtn = document.getElementById('ownerLogoutBtn');

  function openOwnerModal() {
    modal?.classList.add('show');
    if (EduAPI.isOwnerLoggedIn()) {
      showConsoleView();
    } else {
      showLoginView();
    }
  }

  function showLoginView() {
    if (loginView) loginView.style.display = 'block';
    if (consoleView) consoleView.style.display = 'none';
    if (passkeyInput) {
      passkeyInput.value = '';
      passkeyInput.classList.remove('is-invalid');
    }
    if (passkeyError) passkeyError.classList.remove('show');
  }

  async function showConsoleView() {
    if (loginView) loginView.style.display = 'none';
    if (consoleView) consoleView.style.display = 'block';
    if (tableBody) {
      tableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 2rem;"><i class="fas fa-spinner fa-spin"></i> Reading secure Excel records from server...</td></tr>`;
    }

    try {
      const ownerKey = EduAPI.getSavedOwnerKey();
      const result = await EduAPI.getExcelData(ownerKey);
      const students = result.data || [];
      if (recordCountEl) recordCountEl.textContent = students.length;

      if (students.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 2rem;">No student records found in Excel sheet yet.</td></tr>`;
        return;
      }

      tableBody.innerHTML = students.map(s => `
        <tr>
          <td><strong style="color: var(--navy);">${escapeHtml(s.student_id)}</strong></td>
          <td>${escapeHtml(s.student_name)}</td>
          <td>${escapeHtml(String(s.age || ''))}</td>
          <td>${escapeHtml(s.gender || '')}</td>
          <td>${escapeHtml(s.email)}</td>
          <td>${escapeHtml(s.contact_number || '')}</td>
          <td><span class="course-tag">${escapeHtml(s.class_course || '')}</span></td>
          <td>${escapeHtml(s.enrollment_date || '')}</td>
        </tr>
      `).join('');
    } catch (err) {
      console.error('Error loading Excel data for owner:', err);
      if (err.message.includes('Restricted') || err.message.includes('Denied')) {
        EduAPI.clearOwnerKey();
        showLoginView();
        showToast('Owner session expired. Please re-enter passkey.', 'error');
      } else {
        tableBody.innerHTML = `<tr><td colspan="8" style="color: var(--error); text-align: center; padding: 2rem;">Error reading Excel workbook: ${escapeHtml(err.message)}</td></tr>`;
      }
    }
  }

  // Handle owner login form submission
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const passkey = passkeyInput?.value.trim();

    if (!passkey) {
      passkeyInput?.classList.add('is-invalid');
      passkeyError.textContent = 'Please enter the owner passkey.';
      passkeyError.classList.add('show');
      return;
    }

    authSubmitBtn.disabled = true;
    authSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying Credentials...';

    try {
      const response = await EduAPI.verifyOwner(passkey);
      EduAPI.saveOwnerKey(response.ownerKey || passkey);
      showToast('Authenticated as Main Website Owner!', 'success');
      showConsoleView();
    } catch (err) {
      passkeyInput?.classList.add('is-invalid');
      passkeyError.textContent = err.message || 'Invalid owner passkey.';
      passkeyError.classList.add('show');
      showToast(err.message || 'Authentication failed', 'error');
    } finally {
      authSubmitBtn.disabled = false;
      authSubmitBtn.innerHTML = '<i class="fas fa-unlock"></i> Authenticate & Access Excel Records';
    }
  });

  // Handle owner download trigger (Only available to the authenticated owner)
  downloadExcelBtn?.addEventListener('click', () => {
    const ownerKey = EduAPI.getSavedOwnerKey();
    if (!ownerKey) {
      showToast('Unauthorized download attempt.', 'error');
      showLoginView();
      return;
    }
    showToast('Preparing official Excel (.xlsx) file download for Website Owner...', 'info');
    window.location.href = EduAPI.getExcelDownloadUrl(ownerKey);
  });

  // Handle owner logout
  logoutBtn?.addEventListener('click', () => {
    EduAPI.clearOwnerKey();
    showToast('Owner session locked successfully.', 'info');
    showLoginView();
  });

  // Modal open/close listeners
  footerLink?.addEventListener('click', openOwnerModal);
  footerLockBtn?.addEventListener('click', openOwnerModal);

  // Keyboard shortcut: Ctrl + Shift + O for direct owner prompt
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'O' || e.key === 'o')) {
      e.preventDefault();
      openOwnerModal();
    }
  });

  const closeModal = () => modal?.classList.remove('show');
  closeBtn?.addEventListener('click', closeModal);
  closeBottomBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

/* ==========================================================================
   4. COURSES DIRECTORY & SYLLABUS MODAL
   ========================================================================== */
const COURSE_SYLLABI = {
  cs401: {
    title: 'Artificial Intelligence & Ethical Computing',
    code: 'CS-401',
    credits: '4.0 Credits',
    instructor: 'Dr. Vikram Malhotra',
    modules: [
      { name: 'Module 1: Foundations of Machine Learning', desc: 'Linear and logistic regression, convex optimization, cost functions, gradient descent mechanics.' },
      { name: 'Module 2: Neural Networks & Deep Architectures', desc: 'Backpropagation, multi-layer perceptrons, CNNs, sequence modeling with Transformers.' },
      { name: 'Module 3: Ethical AI, Bias & Social Equity', desc: 'Algorithmic accountability, fairness in data sampling, transparent decision making, AI governance.' },
      { name: 'Module 4: Capstone AI for Social Good', desc: 'Building accessible, equitable AI tools designed to support UN SDG 4 educational goals.' }
    ]
  },
  env202: {
    title: 'Environmental Science & Global Sustainability',
    code: 'ENV-202',
    credits: '3.5 Credits',
    instructor: 'Dr. Sunita Banerjee',
    modules: [
      { name: 'Module 1: Planetary Boundaries & Ecological Cycles', desc: 'Biogeochemical cycles, ecosystem resilience, biodiversity preservation, and atmospheric systems.' },
      { name: 'Module 2: Climate Modeling & Renewable Systems', desc: 'Energy transition paradigms, solar/wind mechanics, decarbonization policies, and carbon metrics.' },
      { name: 'Module 3: Circular Economies & Waste Neutrality', desc: 'Lifecycle assessment methodologies, industrial ecology, closed-loop supply chains.' },
      { name: 'Module 4: Global Climate Accord & SDG Metrics', desc: 'UN climate frameworks, policy compliance, equitable international environmental law.' }
    ]
  },
  mth305: {
    title: 'Advanced Mathematics & Inferential Statistics',
    code: 'MTH-305',
    credits: '4.5 Credits',
    instructor: 'Prof. Arvind Krishnan',
    modules: [
      { name: 'Module 1: Vector Spaces & Linear Transformations', desc: 'Eigenvalues, eigenvectors, SVD matrix decomposition, abstract algebraic topologies.' },
      { name: 'Module 2: Multivariate Differential Forms', desc: 'Stokes theorem, line integrals, divergence, curl, manifolds and differential equations.' },
      { name: 'Module 3: Inferential Statistics & Probability Theory', desc: 'Maximum likelihood estimation, Bayesian inference, hypothesis testing, stochastic processes.' },
      { name: 'Module 4: Applied Computational Analytics', desc: 'Markov chain Monte Carlo methods, numerical analysis, mathematical proofs.' }
    ]
  },
  lit110: {
    title: 'Global Literature & Professional Rhetoric',
    code: 'LIT-110',
    credits: '3.0 Credits',
    instructor: 'Dr. Emily Richardson',
    modules: [
      { name: 'Module 1: Cross-Cultural Narrative Structures', desc: 'Comparative literature, post-colonial discourse, world mythologies, and indigenous voices.' },
      { name: 'Module 2: The Art of Academic Synthesis', desc: 'Peer critique, thesis formulation, evidentiary analysis, and scholarly citation ethics.' },
      { name: 'Module 3: Strategic Professional Communication', desc: 'Public advocacy, executive briefs, scientific communication for diverse non-expert audiences.' }
    ]
  },
  mgt312: {
    title: 'Business Ethics & Responsible Leadership',
    code: 'MGT-312',
    credits: '3.5 Credits',
    instructor: 'Prof. Rajeshwari Das',
    modules: [
      { name: 'Module 1: Ethical Frameworks in Modern Commerce', desc: 'Deontological vs utilitarian corporate strategy, ESG mandates, stakeholder capitalism.' },
      { name: 'Module 2: Organizational Governance & Anti-Corruption', desc: 'Whistleblower protection, transparent audit structures, global compliance norms.' },
      { name: 'Module 3: Human-Centric Leadership', desc: 'Inclusive leadership, psychological safety, conflict resolution, equitable compensation.' }
    ]
  },
  edu501: {
    title: 'Pedagogical Sciences & Educational Tech',
    code: 'EDU-501',
    credits: '4.0 Credits',
    instructor: 'Dr. Marcus Sterling',
    modules: [
      { name: 'Module 1: Cognitive Foundations of Learning', desc: 'Neuroscience of retention, constructivist pedagogy, Bloom’s taxonomy in digital spaces.' },
      { name: 'Module 2: Instructional Systems Design (ISD)', desc: 'ADDIE framework, universal design for learning (UDL), active learning scaffolds.' },
      { name: 'Module 3: EdTech & Adaptive Assessment', desc: 'Automated feedback systems, inclusive digital accessibility, gamification and mastery.' }
    ]
  }
};

function initCourses() {
  const filterTabs = document.querySelectorAll('.filter-tab[data-filter]');
  const courseCards = document.querySelectorAll('.course-card');
  const syllabusModal = document.getElementById('syllabusModal');
  const closeSyllabusBtn = document.getElementById('closeSyllabusModalBtn');
  const closeSyllabusBottomBtn = document.getElementById('closeSyllabusBottomBtn');
  const enrollCourseBtns = document.querySelectorAll('.enroll-course-btn');
  const viewSyllabusBtns = document.querySelectorAll('.view-syllabus-btn');
  const syllabusEnrollBtn = document.getElementById('syllabusEnrollBtn');

  // Category Filtering
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.getAttribute('data-filter');

      courseCards.forEach(card => {
        if (cat === 'all' || card.getAttribute('data-category') === cat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // View Syllabus Modal
  let activeSyllabusCourse = '';
  viewSyllabusBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const courseKey = btn.getAttribute('data-course');
      const data = COURSE_SYLLABI[courseKey];
      if (!data) return;

      activeSyllabusCourse = data.title;
      document.getElementById('syllabusModalTitle').textContent = data.title;
      document.getElementById('syllabusModalCode').textContent = `${data.code} • ${data.credits} • Faculty: ${data.instructor}`;

      const bodyEl = document.getElementById('syllabusModalBody');
      bodyEl.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
          <h4 style="font-family: var(--font-heading); color: var(--navy); margin-bottom: 0.75rem;">Comprehensive Course Curriculum</h4>
          <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6;">
            This course meets all international standards of educational excellence. Students must maintain a minimum 80% attendance and complete all assessment modules to be eligible for credits.
          </p>
        </div>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${data.modules.map((m, idx) => `
            <div style="background-color: var(--cream); border-left: 3px solid var(--navy); padding: 1rem 1.25rem; border-radius: 0 var(--radius-sm) var(--radius-sm) 0;">
              <strong style="color: var(--navy); display: block; font-size: 0.95rem;">${m.name}</strong>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">${m.desc}</p>
            </div>
          `).join('')}
        </div>
      `;

      syllabusModal?.classList.add('show');
    });
  });

  const closeSyllabus = () => syllabusModal?.classList.remove('show');
  closeSyllabusBtn?.addEventListener('click', closeSyllabus);
  closeSyllabusBottomBtn?.addEventListener('click', closeSyllabus);
  syllabusModal?.addEventListener('click', (e) => {
    if (e.target === syllabusModal) closeSyllabus();
  });

  // Enroll Now button logic (pre-select course dropdown and scroll to registration form)
  function handleEnroll(courseName) {
    const select = document.getElementById('regCourse');
    if (select) {
      for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].text.includes(courseName) || select.options[i].value.includes(courseName)) {
          select.selectedIndex = i;
          break;
        }
      }
    }
    const regSection = document.getElementById('registration');
    if (regSection) {
      regSection.scrollIntoView({ behavior: 'smooth' });
      showToast(`Selected course: ${courseName}. Complete registration below.`, 'info');
    }
  }

  enrollCourseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cName = btn.getAttribute('data-course-name');
      handleEnroll(cName);
    });
  });

  syllabusEnrollBtn?.addEventListener('click', () => {
    closeSyllabus();
    if (activeSyllabusCourse) {
      handleEnroll(activeSyllabusCourse);
    }
  });
}

/* ==========================================================================
   5. STUDY MATERIALS HUB
   ========================================================================== */
function initStudyMaterials() {
  const searchInput = document.getElementById('materialSearchInput');
  const filterTabs = document.querySelectorAll('.filter-tab[data-mat-filter]');
  const materialCards = document.querySelectorAll('.material-card');
  const downloadBtns = document.querySelectorAll('.download-material-btn');

  let currentFilter = 'all';
  let searchQuery = '';

  function filterMaterials() {
    materialCards.forEach(card => {
      const format = card.getAttribute('data-format');
      const title = (card.getAttribute('data-title') || '').toLowerCase();
      const text = card.textContent.toLowerCase();

      const matchesFilter = currentFilter === 'all' || format === currentFilter;
      const matchesSearch = !searchQuery || title.includes(searchQuery) || text.includes(searchQuery);

      if (matchesFilter && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.getAttribute('data-mat-filter');
      filterMaterials();
    });
  });

  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    filterMaterials();
  });

  // Simulated Instant Download with real sample text blob
  downloadBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-title');
      const ext = btn.getAttribute('data-ext') || 'txt';
      showToast(`Starting academic download: "${title}.${ext}"`, 'info');

      // Create downloadable educational summary note file
      const content = `=======================================================
EDUQUALITY ACADEMIC RESOURCE CENTER
Title: ${title}
Format: ${ext.toUpperCase()}
Standard: UN SDG 4 - Quality Education Accredited
Date: ${new Date().toLocaleDateString()}
=======================================================

This study handbook provides foundational and advanced concepts
aligned with the Quality Education curriculum. 

Key Study Points:
1. Core theoretical principles and empirical evidence.
2. In-depth case studies with real-world applications.
3. Analytical problem sets and review questions.
4. References to peer-reviewed literature.

Downloaded from EduQuality Portal.
"Learn Today, Build a Better Tomorrow."
=======================================================`;

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/\s+/g, '_')}_Study_Notes.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setTimeout(() => {
        showToast(`Downloaded successfully: ${title}`, 'success');
      }, 800);
    });
  });
}

/* ==========================================================================
   6. ONLINE QUIZ & ASSESSMENT ENGINE
   ========================================================================== */
const QUIZ_TRACKS = {
  sdg4: {
    name: 'Track: UN SDG 4 & Quality Education',
    questions: [
      {
        q: 'What is the primary objective of United Nations Sustainable Development Goal 4 (SDG 4)?',
        options: [
          'Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all',
          'Promote commercialized test preparation and high tuition fees',
          'Replace teachers with automated rote examination graders',
          'Limit higher education access strictly to industrialized nations'
        ],
        correct: 0,
        explanation: 'UN SDG 4 explicitly calls for inclusive, equitable quality education that fosters lifelong learning for all individuals worldwide.'
      },
      {
        q: 'Which of the following is considered a core pillar of Quality Education?',
        options: [
          'Enforcing strict rote memorization without contextual inquiry',
          'Universal equity, qualified educators, modern pedagogy, and safe learning environments',
          'Mandating identical textbooks across every country regardless of language',
          'Excluding practical lab work in favor of theoretical testing only'
        ],
        correct: 1,
        explanation: 'Quality Education stands on four foundational pillars: equity and inclusivity, qualified teachers, modern holistic pedagogy, and psychologically safe spaces.'
      },
      {
        q: 'How does continuous assessment benefit learners compared to single high-stakes exams?',
        options: [
          'It provides timely, diagnostic feedback and encourages iterative mastery over fear-based cramming',
          'It increases testing anxiety and limits student participation',
          'It eliminates the need for any curriculum standards',
          'It guarantees automatic 100% scores without study'
        ],
        correct: 0,
        explanation: 'Continuous assessment provides regular, actionable feedback that helps learners understand their conceptual gaps and reinforce retention.'
      },
      {
        q: 'Why is teacher professional development critical to achieving Quality Education?',
        options: [
          'It reduces the number of hours educators can teach students',
          'It equips teachers with contemporary pedagogical strategies, empathy, and adaptive technological tools',
          'It converts all learning into passive lectures',
          'It eliminates student-faculty interactions'
        ],
        correct: 1,
        explanation: 'Continuous professional mentorship empowers educators to employ innovative, inclusive teaching methods that ignite critical curiosity.'
      },
      {
        q: 'What role does digital literacy play in modern quality education?',
        options: [
          'It bridges educational divides by democratizing access to open knowledge, critical inquiry, and analytical tools',
          'It replaces the need for foundational reading, mathematics, and critical thinking',
          'It restricts learning strictly to computer programming',
          'It prevents learners from collaborating with peers'
        ],
        correct: 0,
        explanation: 'Digital literacy democratizes access to verified learning resources and develops essential problem-solving skills for 21st-century society.'
      }
    ]
  },
  digital: {
    name: 'Track: Digital Literacy & Algorithmic Thinking',
    questions: [
      {
        q: 'What is computational thinking primarily concerned with?',
        options: [
          'Memorizing complex binary machine code syntax',
          'Formulating problems and solutions so they can be effectively solved by an information-processing agent',
          'Purchasing the most expensive computing hardware',
          'Typing speed on a physical keyboard'
        ],
        correct: 1,
        explanation: 'Computational thinking involves decomposition, pattern recognition, abstraction, and algorithmic design to solve multifaceted problems.'
      },
      {
        q: 'In algorithmic problem-solving, what does "abstraction" mean?',
        options: [
          'Adding unnecessary details to confuse the reader',
          'Filtering out irrelevant details to focus on the essential core mechanics of the problem',
          'Executing an infinite while loop without a stopping condition',
          'Translating English into Latin'
        ],
        correct: 1,
        explanation: 'Abstraction simplifies problem complexity by focusing only on essential attributes and ignoring non-essential details.'
      },
      {
        q: 'Which data format is universally recognized for open structured data exchange across spreadsheets and databases?',
        options: [
          'Proprietary encrypted binaries only',
          '.xlsx (OpenXML Spreadsheet) and .json / .csv',
          'Audio MP3 streams',
          'Unformatted raw bitstream logs'
        ],
        correct: 1,
        explanation: 'Standardized OpenXML Excel (.xlsx) and JSON formats provide universal compatibility across platforms and databases.'
      },
      {
        q: 'What is algorithmic bias, and why is it an ethical concern?',
        options: [
          'When an algorithm executes faster on certain days of the week',
          'Systematic and unfair discrimination in algorithm outcomes caused by skewed training datasets or biased assumptions',
          'A hardware malfunction inside modern CPU transistors',
          'Using too many comments inside a source code file'
        ],
        correct: 1,
        explanation: 'Algorithmic bias occurs when models reflect historical human prejudices present in training data, producing inequitable outcomes.'
      },
      {
        q: 'What constitutes strong digital citizenship in educational environments?',
        options: [
          'Ethical information retrieval, respecting intellectual property, and engaging in respectful academic discourse online',
          'Copying online essays without scholarly attribution or citation',
          'Spamming communication channels with commercial links',
          'Disabling all privacy settings across accounts'
        ],
        correct: 0,
        explanation: 'Digital citizenship emphasizes ethical attribution, information discernment, and fostering respectful online collaborative learning.'
      }
    ]
  },
  science: {
    name: 'Track: Environmental Science & Sustainability',
    questions: [
      {
        q: 'What does the term "Carbon Footprint" measure?',
        options: [
          'The physical footprint left by shoes made of carbon composite materials',
          'The total amount of greenhouse gases generated by human actions and operational systems',
          'The depth of coal mines beneath the earth surface',
          'The speed of tectonic plate movement'
        ],
        correct: 1,
        explanation: 'A carbon footprint quantifies greenhouse gas emissions (in CO2 equivalents) produced directly or indirectly by an individual, organization, or process.'
      },
      {
        q: 'Which ecological concept describes an ecosystem’s ability to absorb disturbance and reorganize while retaining essentially the same function?',
        options: [
          'Ecological Resilience',
          'Thermal Equilibrium',
          'Monoculture Expansion',
          'Eutrophication'
        ],
        correct: 0,
        explanation: 'Ecological resilience is the capacity of an ecosystem to withstand shocks and regenerate its core structural integrity.'
      },
      {
        q: 'What is the primary principle of a "Circular Economy"?',
        options: [
          'Extract, manufacture, use, and immediately discard into landfills',
          'Design out waste, keep products and materials in high-value circulation, and regenerate natural systems',
          'Banning all industrial production completely',
          'Trading physical currencies in circular loops'
        ],
        correct: 1,
        explanation: 'A circular economy transitions away from the linear take-make-waste model toward regeneration, reuse, and closed material loops.'
      },
      {
        q: 'Why is biodiversity preservation essential for sustainable human societies?',
        options: [
          'It provides crucial ecosystem services like pollination, clean water purification, soil fertility, and medical discovery',
          'It reduces the amount of natural sunlight reaching agricultural crops',
          'It restricts modern architecture from expanding',
          'It prevents natural evaporation cycles'
        ],
        correct: 0,
        explanation: 'Biodiversity supports indispensable ecosystem services that sustain food security, public health, climate stabilization, and economic resilience.'
      },
      {
        q: 'How does Quality Education directly contribute to environmental sustainability?',
        options: [
          'By fostering environmental stewardship, scientific comprehension, and sustainable decision-making across generations',
          'By increasing paper waste and deforestation through physical printouts',
          'By discouraging community research projects',
          'By isolating science from civic responsibility'
        ],
        correct: 0,
        explanation: 'Quality education equips citizens with empirical knowledge and ecological empathy to implement sustainable practices.'
      }
    ]
  }
};

function initQuizEngine() {
  const trackTabs = document.querySelectorAll('.quiz-track-tab');
  const trackBadge = document.getElementById('quizCurrentTrack');
  const questionCounter = document.getElementById('quizQuestionCounter');
  const questionTitle = document.getElementById('quizQuestionText');
  const optionsContainer = document.getElementById('quizOptionsContainer');
  const progressBar = document.getElementById('quizProgressBar');
  const prevBtn = document.getElementById('quizPrevBtn');
  const nextBtn = document.getElementById('quizNextBtn');
  const answeredCountEl = document.getElementById('quizAnsweredCount');
  const timerEl = document.getElementById('quizTimerText');

  const questionScreen = document.getElementById('quizQuestionScreen');
  const resultScreen = document.getElementById('quizResultScreen');
  const resultScore = document.getElementById('resultScoreValue');
  const resultGrade = document.getElementById('resultGradeText');
  const resultHeadline = document.getElementById('resultHeadline');
  const resultSummary = document.getElementById('resultSummaryText');
  const retakeBtn = document.getElementById('retakeQuizBtn');
  const reviewBtn = document.getElementById('reviewQuizBtn');
  const certBtn = document.getElementById('claimCertificateBtn');

  const certModal = document.getElementById('certificateModal');
  const closeCertBtn = document.getElementById('closeCertModalBtn');
  const closeCertBottomBtn = document.getElementById('closeCertBottomBtn');

  let currentTrackKey = 'sdg4';
  let currentIndex = 0;
  let userAnswers = {};
  let timerInterval = null;
  let secondsRemaining = 600;

  function startTimer() {
    clearInterval(timerInterval);
    secondsRemaining = 600;
    updateTimerDisplay();

    timerInterval = setInterval(() => {
      secondsRemaining--;
      if (secondsRemaining <= 0) {
        clearInterval(timerInterval);
        submitQuiz();
      }
      updateTimerDisplay();
    }, 1000);
  }

  function updateTimerDisplay() {
    const mins = Math.floor(secondsRemaining / 60);
    const secs = secondsRemaining % 60;
    if (timerEl) {
      timerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
  }

  function loadQuestion(index) {
    const track = QUIZ_TRACKS[currentTrackKey];
    const questions = track.questions;
    currentIndex = index;

    const q = questions[currentIndex];
    questionCounter.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
    questionTitle.textContent = q.q;

    // Progress bar
    const pct = ((currentIndex + 1) / questions.length) * 100;
    progressBar.style.width = `${pct}%`;

    // Render options
    optionsContainer.innerHTML = q.options.map((opt, optIdx) => {
      const isSelected = userAnswers[currentIndex] === optIdx;
      return `
        <div class="quiz-option ${isSelected ? 'selected' : ''}" data-idx="${optIdx}">
          <div class="quiz-option-radio"></div>
          <span class="quiz-option-text">${escapeHtml(opt)}</span>
        </div>
      `;
    }).join('');

    // Attach click to options
    document.querySelectorAll('.quiz-option').forEach(el => {
      el.addEventListener('click', () => {
        const selIdx = parseInt(el.getAttribute('data-idx'), 10);
        userAnswers[currentIndex] = selIdx;
        loadQuestion(currentIndex);
        updateAnsweredCount();
      });
    });

    // Nav button states
    prevBtn.disabled = currentIndex === 0;
    if (currentIndex === questions.length - 1) {
      nextBtn.innerHTML = '<i class="fas fa-check-double"></i> Submit Assessment';
    } else {
      nextBtn.innerHTML = 'Next <i class="fas fa-chevron-right"></i>';
    }
  }

  function updateAnsweredCount() {
    const track = QUIZ_TRACKS[currentTrackKey];
    const count = Object.keys(userAnswers).length;
    answeredCountEl.textContent = `${count} of ${track.questions.length} Answered`;
  }

  prevBtn?.addEventListener('click', () => {
    if (currentIndex > 0) {
      loadQuestion(currentIndex - 1);
    }
  });

  nextBtn?.addEventListener('click', () => {
    const track = QUIZ_TRACKS[currentTrackKey];
    if (currentIndex < track.questions.length - 1) {
      loadQuestion(currentIndex + 1);
    } else {
      // Last question - check if all answered
      const answered = Object.keys(userAnswers).length;
      if (answered < track.questions.length) {
        if (!confirm(`You have answered ${answered} of ${track.questions.length} questions. Do you want to submit anyway?`)) {
          return;
        }
      }
      submitQuiz();
    }
  });

  function submitQuiz() {
    clearInterval(timerInterval);
    const track = QUIZ_TRACKS[currentTrackKey];
    const questions = track.questions;

    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct) {
        correctCount++;
      }
    });

    const finalPct = Math.round((correctCount / questions.length) * 100);

    questionScreen.style.display = 'none';
    resultScreen.style.display = 'block';

    resultScore.textContent = `${finalPct}%`;

    let grade = '';
    if (finalPct >= 90) {
      grade = 'Distinction (Honors)';
      resultHeadline.textContent = 'Exceptional Mastery Demonstrated!';
      resultSummary.textContent = `You achieved ${correctCount} of ${questions.length} correct. Your high score entitles you to claim the accredited Certificate of Mastery.`;
      certBtn.style.display = 'inline-flex';
    } else if (finalPct >= 75) {
      grade = 'Merit (High Standing)';
      resultHeadline.textContent = 'Commendable Academic Performance!';
      resultSummary.textContent = `You scored ${correctCount} of ${questions.length} correct. Solid conceptual foundation and grasp of core principles.`;
      certBtn.style.display = 'inline-flex';
    } else if (finalPct >= 60) {
      grade = 'Pass (Competent)';
      resultHeadline.textContent = 'Assessment Completed Successfully';
      resultSummary.textContent = `You scored ${correctCount} of ${questions.length} correct. We recommend reviewing the detailed study materials to elevate mastery.`;
      certBtn.style.display = 'none';
    } else {
      grade = 'Review Recommended';
      resultHeadline.textContent = 'Reinforce Your Understanding';
      resultSummary.textContent = `You scored ${correctCount} of ${questions.length} correct. Explore the curated Study Materials section and retake the quiz anytime.`;
      certBtn.style.display = 'none';
    }

    resultGrade.textContent = grade;
    showToast(`Quiz completed! Final Score: ${finalPct}% (${grade})`, 'success');
  }

  // Switch Track
  trackTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      trackTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentTrackKey = tab.getAttribute('data-track');
      trackBadge.textContent = QUIZ_TRACKS[currentTrackKey].name;
      resetQuiz();
    });
  });

  function resetQuiz() {
    userAnswers = {};
    currentIndex = 0;
    questionScreen.style.display = 'block';
    resultScreen.style.display = 'none';
    loadQuestion(0);
    updateAnsweredCount();
    startTimer();
  }

  retakeBtn?.addEventListener('click', resetQuiz);

  // Review Detailed Explanations
  reviewBtn?.addEventListener('click', () => {
    const track = QUIZ_TRACKS[currentTrackKey];
    let reviewHtml = `<div style="display: flex; flex-direction: column; gap: 1.5rem; text-align: left; margin-top: 2rem;">`;

    track.questions.forEach((q, idx) => {
      const userAns = userAnswers[idx];
      const isCorrect = userAns === q.correct;
      reviewHtml += `
        <div style="background-color: var(--cream); padding: 1.5rem; border-radius: var(--radius-sm); border-left: 4px solid ${isCorrect ? 'var(--success)' : 'var(--error)'};">
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--navy);">
            <span>Question ${idx + 1}</span>
            <span style="color: ${isCorrect ? 'var(--success)' : 'var(--error)'};">${isCorrect ? '✓ Correct (+20 Pts)' : '✗ Incorrect (0 Pts)'}</span>
          </div>
          <strong style="display: block; font-size: 1rem; color: var(--navy); margin-bottom: 0.75rem;">${q.q}</strong>
          <div style="font-size: 0.9rem; margin-bottom: 0.5rem;">
            <strong>Your Selection:</strong> ${userAns !== undefined ? escapeHtml(q.options[userAns]) : '<em>Not Answered</em>'}
          </div>
          <div style="font-size: 0.9rem; margin-bottom: 0.75rem; color: var(--success); font-weight: 600;">
            <strong>Correct Answer:</strong> ${escapeHtml(q.options[q.correct])}
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted); background: var(--white); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--border-subtle);">
            <strong>Explanation:</strong> ${q.explanation}
          </p>
        </div>
      `;
    });

    reviewHtml += `</div>`;
    resultSummary.innerHTML = reviewHtml;
    reviewBtn.style.display = 'none';
  });

  // Certificate Modal Preview
  certBtn?.addEventListener('click', () => {
    const track = QUIZ_TRACKS[currentTrackKey];
    document.getElementById('certCourseTitle').textContent = track.name;
    document.getElementById('certScorePct').textContent = resultScore.textContent;
    document.getElementById('certDateVal').textContent = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    certModal?.classList.add('show');
  });

  const closeCert = () => certModal?.classList.remove('show');
  closeCertBtn?.addEventListener('click', closeCert);
  closeCertBottomBtn?.addEventListener('click', closeCert);
  certModal?.addEventListener('click', (e) => {
    if (e.target === certModal) closeCert();
  });

  // Start initially
  resetQuiz();
}

/* ==========================================================================
   7. ATTENDANCE & ACTIVITY RECORDS LOOKUP
   ========================================================================== */
function initAttendanceLookup() {
  const form = document.getElementById('attendanceLookupForm');
  const input = document.getElementById('attendanceStudentIdInput');
  const chips = document.querySelectorAll('.demo-id-chip');

  // Display elements
  const pctEl = document.getElementById('attOverallPct');
  const nameEl = document.getElementById('attStudentName');
  const idBadge = document.getElementById('attStudentIdBadge');
  const statusBadge = document.getElementById('attStatusBadge');
  const courseEl = document.getElementById('attCourseName');
  const totalEl = document.getElementById('attTotalClasses');
  const attendedEl = document.getElementById('attAttendedClasses');
  const missedEl = document.getElementById('attMissedClasses');
  const enrollDateEl = document.getElementById('attEnrollDate');
  const breakdownContainer = document.getElementById('subjectBreakdownContainer');
  const activityBody = document.getElementById('activityLogBody');
  const gaugeCircle = document.getElementById('attendanceGaugeCircle');

  async function performLookup(studentId) {
    if (!studentId) return;

    try {
      showToast(`Looking up academic records for "${studentId}"...`, 'info');
      const response = await EduAPI.getAttendance(studentId);
      const student = response.student;
      const att = response.attendance;

      // Update text
      nameEl.textContent = student.student_name;
      idBadge.textContent = `ID: ${student.student_id}`;
      courseEl.textContent = student.class_course;
      enrollDateEl.textContent = student.enrollment_date;

      totalEl.textContent = `${att.total_classes} Classes`;
      attendedEl.textContent = `${att.attended_classes} Classes`;
      missedEl.textContent = `${att.total_classes - att.attended_classes} Classes`;

      const pctNum = parseFloat(att.percentage).toFixed(1);
      pctEl.textContent = `${pctNum}%`;

      // Update circular gauge background
      if (gaugeCircle) {
        gaugeCircle.style.background = `conic-gradient(var(--sage-dark) 0% ${pctNum}%, var(--cream-dark) ${pctNum}% 100%)`;
      }

      statusBadge.innerHTML = `<i class="fas fa-shield-check"></i> ${escapeHtml(att.status || 'Good Standing')}`;

      // Render subjects
      const subjects = att.subject_breakdown || [];
      breakdownContainer.innerHTML = subjects.map(s => `
        <div class="subject-item">
          <div class="subject-item-header">
            <span>${escapeHtml(s.subject)}</span>
            <span>${s.attended}/${s.total} (${s.pct}%)</span>
          </div>
          <div class="subject-progress-track">
            <div class="subject-progress-fill" style="width: ${s.pct}%;"></div>
          </div>
        </div>
      `).join('');

      // Render activity log
      const activities = att.activity_log || [];
      activityBody.innerHTML = activities.map(act => `
        <tr>
          <td><strong style="color: var(--navy);">${escapeHtml(act.date)}</strong></td>
          <td>${escapeHtml(act.title)}</td>
          <td><span class="course-tag">${escapeHtml(act.type)}</span></td>
          <td><span class="excel-meta-badge" style="padding: 0.15rem 0.5rem; font-size: 0.78rem;">${escapeHtml(act.status)}</span></td>
          <td><strong style="color: var(--navy);">${escapeHtml(act.points || '+10')}</strong></td>
        </tr>
      `).join('');

      showToast(`Record loaded: ${student.student_name} (${pctNum}% Attendance)`, 'success');
    } catch (err) {
      console.error('Attendance lookup failed:', err);
      showToast(err.message || 'No attendance record found for this Student ID.', 'error');
    }
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const idVal = input.value.trim().toUpperCase();
    if (!idVal) {
      showToast('Please enter a valid Student ID.', 'error');
      return;
    }
    performLookup(idVal);
  });

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const idVal = chip.getAttribute('data-id');
      if (input) input.value = idVal;
      performLookup(idVal);
    });
  });

  // Initial lookup for default sample student
  performLookup('STU-2026-001');
}

/* ==========================================================================
   8. ANNOUNCEMENTS & NOTICES
   ========================================================================== */
function initAnnouncements() {
  const filterTabs = document.querySelectorAll('.filter-tab[data-ann-filter]');
  const announcementCards = document.querySelectorAll('.announcement-card');
  const readNoticeBtns = document.querySelectorAll('.read-notice-btn');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.getAttribute('data-ann-filter');

      announcementCards.forEach(card => {
        if (cat === 'all' || card.getAttribute('data-cat') === cat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  readNoticeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.announcement-card');
      const title = card?.querySelector('.announcement-title')?.textContent || 'Notice';
      const summary = card?.querySelector('.announcement-summary')?.textContent || '';
      alert(`[Official Notice Circular]\n\nTitle: ${title}\n\nSummary: ${summary}\n\nFor official circular printouts, please contact the Academic Registrar.`);
    });
  });
}

/* ==========================================================================
   9. TEACHER INFORMATION & CONSULTATION MODAL
   ========================================================================== */
function initTeacherConsultations() {
  const contactBtns = document.querySelectorAll('.contact-teacher-btn');
  const modal = document.getElementById('teacherQueryModal');
  const closeBtn = document.getElementById('closeTeacherModalBtn');
  const form = document.getElementById('teacherQueryForm');
  const recipientInput = document.getElementById('tqFacultyName');

  contactBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const facultyName = btn.getAttribute('data-name');
      const email = btn.getAttribute('data-email');
      if (recipientInput) {
        recipientInput.value = `${facultyName} (${email})`;
      }
      modal?.classList.add('show');
    });
  });

  const closeModal = () => modal?.classList.remove('show');
  closeBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const studentName = document.getElementById('tqStudentName')?.value.trim();
    const faculty = recipientInput?.value;

    showToast(`Inquiry sent to ${faculty}! We have dispatched a confirmation receipt to ${studentName}.`, 'success');
    form.reset();
    closeModal();
  });
}

/* ==========================================================================
   10. FEEDBACK SYSTEM & 5-STAR RATING
   ========================================================================== */
function initFeedbackSystem() {
  const form = document.getElementById('feedbackForm');
  const starBtns = document.querySelectorAll('#starRatingContainer .star-btn');
  const ratingLabel = document.getElementById('ratingTextLabel');
  const ratingInput = document.getElementById('fbRatingVal');
  const testimonialsCol = document.getElementById('testimonialsList');

  const ratingDescriptions = {
    1: '1 Star - Unsatisfactory',
    2: '2 Stars - Needs Significant Improvement',
    3: '3 Stars - Satisfactory Standards',
    4: '4 Stars - Very Good Experience',
    5: '5 Stars - Exceptional Quality & Excellence'
  };

  starBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const rating = parseInt(btn.getAttribute('data-rating'), 10);
      ratingInput.value = rating;

      starBtns.forEach(s => {
        const sRating = parseInt(s.getAttribute('data-rating'), 10);
        if (sRating <= rating) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });

      if (ratingLabel) {
        ratingLabel.textContent = ratingDescriptions[rating];
      }
    });
  });

  async function loadTestimonials() {
    try {
      const response = await EduAPI.getFeedback();
      const list = response.data || [];
      if (list.length > 0 && testimonialsCol) {
        testimonialsCol.innerHTML = list.map(item => `
          <div class="testimonial-card">
            <div class="testimonial-stars">
              ${'★'.repeat(item.rating)}${'☆'.repeat(5 - item.rating)}
              <span style="font-size: 0.8rem; color: var(--text-muted); margin-left: 0.4rem;">(${escapeHtml(item.category)})</span>
            </div>
            <p class="testimonial-quote">“${escapeHtml(item.comments)}”</p>
            <div class="testimonial-author">
              <div class="author-avatar">${(item.name || 'A').charAt(0).toUpperCase()}</div>
              <div class="author-info">
                <strong>${escapeHtml(item.name || 'Anonymous Student')}</strong>
                <span>Verified Learner</span>
              </div>
            </div>
          </div>
        `).join('');
      }
    } catch (e) {
      // Fallback already rendered
    }
  }

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const category = document.getElementById('fbCategory')?.value;
    const rating = ratingInput?.value;
    const name = document.getElementById('fbName')?.value.trim();
    const email = document.getElementById('fbEmail')?.value.trim();
    const comments = document.getElementById('fbComments')?.value.trim();

    if (!category || !comments) {
      showToast('Please select a feedback category and write your comments.', 'error');
      return;
    }

    try {
      await EduAPI.submitFeedback({ category, rating, name, email, comments });
      showToast('Thank you for contributing to Quality Education excellence!', 'success');
      form.reset();
      ratingInput.value = '5';
      starBtns.forEach(s => s.classList.add('active'));
      if (ratingLabel) ratingLabel.textContent = ratingDescriptions[5];
      loadTestimonials();
    } catch (err) {
      showToast(err.message || 'Error submitting feedback', 'error');
    }
  });

  loadTestimonials();
}

/* ==========================================================================
   11. CONTACT / HELP DESK & FAQ ACCORDION
   ========================================================================== */
function initHelpDesk() {
  const form = document.getElementById('helpInquiryForm');
  const accordionItems = document.querySelectorAll('.accordion-item');

  // FAQ Accordion Toggle
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    header?.addEventListener('click', () => {
      const wasActive = item.classList.contains('active');
      accordionItems.forEach(i => i.classList.remove('active'));
      if (!wasActive) {
        item.classList.add('active');
      }
    });
  });

  // Help Inquiry Form
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('helpName')?.value.trim();
    const email = document.getElementById('helpEmail')?.value.trim();
    const subject = document.getElementById('helpSubject')?.value;
    const message = document.getElementById('helpMessage')?.value.trim();

    if (!name || !email || !subject || !message) {
      showToast('Please complete all required fields for the support inquiry.', 'error');
      return;
    }

    try {
      const res = await EduAPI.submitHelpInquiry({ name, email, subject, message });
      showToast(`Help Ticket ${res.ticketId} created! An academic mentor will reply within 24h.`, 'success');
      form.reset();
    } catch (err) {
      showToast(err.message || 'Failed to submit inquiry', 'error');
    }
  });
}

/* ==========================================================================
   UTILITY HELPERS (TOAST, ESCAPE HTML)
   ========================================================================== */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let icon = 'fa-info-circle';
  if (type === 'success') icon = 'fa-circle-check';
  if (type === 'error') icon = 'fa-circle-exclamation';

  toast.innerHTML = `
    <i class="fas ${icon}" style="font-size: 1.15rem;"></i>
    <div style="flex: 1; line-height: 1.4;">${escapeHtml(message)}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 4200);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
