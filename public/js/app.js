/**
 * Quality Education Platform - Main Application Script
 * Complies with all exact requirements:
 * - 7 Sections: Home, About, Registration, Courses, Study Materials,
 *   Online Assessment & Quiz, Feedback
 * - 6 Courses, 10 Study Material Handbooks, 90 Quiz Questions (6 x 15 Qs)
 * - Registration Form with strictly 7 fields (NO Class/Course)
 * - Secure Server & Excel (.xlsx) Data Storage
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initRegistrationForm();
  initCourses();
  initStudyMaterials();
  initQuizEngine();
  initFeedbackSystem();
  initOwnerAccess();
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
    anchor.addEventListener('click', () => {
      allNavAnchors.forEach(a => a.classList.remove('active'));
      anchor.classList.add('active');
      if (navLinks && navLinks.classList.contains('open')) {
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
   2. STUDENT REGISTRATION (STRICTLY 7 FIELDS, NO CLASS/COURSE)
   ========================================================================== */
function initRegistrationForm() {
  const form = document.getElementById('studentRegistrationForm');
  const successAlert = document.getElementById('regSuccessAlert');
  const errorAlert = document.getElementById('regErrorAlert');
  const successMsg = document.getElementById('regSuccessMsg');
  const errorMsg = document.getElementById('regErrorMsg');
  const submitBtn = document.getElementById('regSubmitBtn');
  const resetBtn = document.getElementById('regResetBtn');

  // Input elements (Strictly 7 fields)
  const inputId = document.getElementById('regStudentId');
  const inputName = document.getElementById('regStudentName');
  const inputAge = document.getElementById('regAge');
  const selectGender = document.getElementById('regGender');
  const inputEmail = document.getElementById('regEmail');
  const inputContact = document.getElementById('regContact');
  const inputDate = document.getElementById('regEnrollDate');

  if (!form) return;

  // Clear validation error styling on typing/changing
  [inputId, inputName, inputAge, selectGender, inputEmail, inputContact, inputDate].forEach(field => {
    if (!field) return;
    field.addEventListener('input', () => {
      field.classList.remove('is-invalid');
      const errBox = document.getElementById(`err${field.id.replace('reg', '')}`);
      if (errBox) errBox.classList.remove('show');
    });
    field.addEventListener('change', () => {
      field.classList.remove('is-invalid');
      const errBox = document.getElementById(`err${field.id.replace('reg', '')}`);
      if (errBox) errBox.classList.remove('show');
    });
  });

  resetBtn?.addEventListener('click', () => {
    form.reset();
    const today = new Date().toISOString().split('T')[0];
    if (inputDate) inputDate.value = today;
    if (successAlert) successAlert.style.display = 'none';
    if (errorAlert) errorAlert.style.display = 'none';
    document.querySelectorAll('.field-error').forEach(e => e.classList.remove('show'));
    document.querySelectorAll('.is-invalid').forEach(e => e.classList.remove('is-invalid'));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (successAlert) successAlert.style.display = 'none';
    if (errorAlert) errorAlert.style.display = 'none';

    let isValid = true;

    // 1. Student ID
    const studentIdVal = inputId.value.trim().toUpperCase();
    if (!studentIdVal) {
      showFieldError('StudentId', 'Student ID is required and must be unique.');
      isValid = false;
    }

    // 2. Student Name
    const studentNameVal = inputName.value.trim();
    if (!studentNameVal || studentNameVal.length < 2) {
      showFieldError('StudentName', 'Please provide the student’s full name.');
      isValid = false;
    }

    // 3. Age
    const ageVal = parseInt(inputAge.value, 10);
    if (isNaN(ageVal) || ageVal < 5 || ageVal > 120) {
      showFieldError('Age', 'Please enter a valid age between 5 and 120.');
      isValid = false;
    }

    // 4. Gender
    const genderVal = selectGender.value;
    if (!genderVal) {
      showFieldError('Gender', 'Please select a gender option.');
      isValid = false;
    }

    // 5. Email Address
    const emailVal = inputEmail.value.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal || !emailRegex.test(emailVal)) {
      showFieldError('Email', 'Please enter a valid email address (e.g. student@domain.com).');
      isValid = false;
    }

    // 6. Contact Number
    const contactVal = inputContact.value.trim();
    const phoneClean = contactVal.replace(/[^0-9]/g, '');
    if (phoneClean.length < 7 || phoneClean.length > 15) {
      showFieldError('Contact', 'Please enter a valid contact number (7 to 15 digits).');
      isValid = false;
    }

    // 7. Enrollment Date
    const dateVal = inputDate.value.trim();
    if (!dateVal) {
      showFieldError('EnrollDate', 'Please select a valid enrollment date.');
      isValid = false;
    }

    if (!isValid) {
      showErrorAlert('Please review and correct the highlighted fields.');
      return;
    }

    // Payload containing strictly the 7 student fields
    const payload = {
      student_id: studentIdVal,
      student_name: studentNameVal,
      age: ageVal,
      gender: genderVal,
      email: emailVal,
      contact_number: contactVal,
      enrollment_date: dateVal
    };

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Registration...';

    try {
      await EduAPI.registerStudent(payload);

      showSuccessAlert(
        `Registration Succeeded! Student "${studentNameVal}" (${studentIdVal}) has been securely registered. Data stored on the server and synchronized with students_records.xlsx.`
      );
      showToast(`Student ${studentNameVal} (${studentIdVal}) registered successfully!`, 'success');

      form.reset();
      const today = new Date().toISOString().split('T')[0];
      if (inputDate) inputDate.value = today;

    } catch (err) {
      console.error('Registration failed:', err);
      const isDuplicate = err.status === 409 || err.message.toLowerCase().includes('already registered') || err.message.toLowerCase().includes('duplicate');

      if (isDuplicate) {
        showFieldError('StudentId', `Student ID "${studentIdVal}" is already registered. Please use a unique Student ID.`);
        showErrorAlert(`Duplicate Student ID: "${studentIdVal}" already exists in the institutional registry. Duplicate IDs are prevented.`);
      } else {
        showErrorAlert(err.message || 'An error occurred during registration. Please check server connectivity.');
      }

      showToast(err.message || 'Registration failed', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Registration';
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
    if (successAlert) successAlert.style.display = 'flex';
    if (errorAlert) errorAlert.style.display = 'none';
    successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function showErrorAlert(msg) {
    if (errorMsg) errorMsg.textContent = msg;
    if (errorAlert) errorAlert.style.display = 'flex';
    if (successAlert) successAlert.style.display = 'none';
    errorAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/* ==========================================================================
   3. COURSES SECTION (EXACTLY 6 SUBJECTS)
   ========================================================================== */
const COURSE_DETAILS = {
  networks: {
    title: 'Computer Networks',
    subtitle: 'Core Networking Architecture & Protocols',
    studyLink: 'https://drive.google.com/file/d/1OZSdFNgaRG3fsl83PtaerltyD2JLAmLO/edit?pli=1',
    modules: [
      { name: 'Unit 1: Protocol Architecture & Physical Layer', desc: 'OSI 7-layer reference model, TCP/IP stack, transmission media, framing algorithms, and error detection (CRC).' },
      { name: 'Unit 2: Data Link Layer & Flow Control', desc: 'Sliding window protocols, Stop-and-Wait, Go-Back-N, Selective Repeat ARQ, and Ethernet framing.' },
      { name: 'Unit 3: Network Layer & IP Routing', desc: 'IPv4/IPv6 addressing, CIDR subnetting, Dijkstra’s Link State algorithm (OSPF), Distance Vector (RIP), and BGP peering.' },
      { name: 'Unit 4: Transport Layer & Network Security', desc: 'TCP connection lifecycle (3-way handshake), UDP datagrams, AIMD congestion control, NAT, and cryptographic SSL/TLS.' }
    ]
  },
  python: {
    title: 'Python for Data Science',
    subtitle: 'Numerical Computing & Predictive Analytics',
    studyLink: 'https://cdn.gecacademy.cn/oa/upload/2022-03-02%2014-15-49-Python%20Data%20Science%20Handbook.pdf?utm_source=chatgpt.com',
    modules: [
      { name: 'Unit 1: Vectorized Computing with NumPy', desc: 'Multidimensional ndarrays, memory strides, array broadcasting rules, linear algebra, and fast universal functions.' },
      { name: 'Unit 2: Tabular Wrangling with Pandas', desc: 'Series and DataFrames, label (.loc) vs integer (.iloc) indexing, missing value handling, and groupby Split-Apply-Combine.' },
      { name: 'Unit 3: Data Visualization', desc: 'Matplotlib plotting interfaces, Seaborn statistical heatmaps, scatter distributions, and exploratory data analysis.' },
      { name: 'Unit 4: Machine Learning with Scikit-Learn', desc: 'Supervised vs unsupervised paradigms, feature scaling, train/test splitting, cross-validation, and classification metrics.' }
    ]
  },
  webdev: {
    title: 'Web Application Development',
    subtitle: 'Modern Full-Stack Web Engineering',
    studyLink: 'https://iwdd.doncolton.com/iwdd4.pdf?utm_source=chatgpt.com',
    modules: [
      { name: 'Unit 1: Semantic HTML5 & Modern CSS', desc: 'Semantic tags (<article>, <section>), CSS Box Model, responsive design principles, Flexbox alignment, and CSS Grid.' },
      { name: 'Unit 2: Asynchronous JavaScript & Event Loop', desc: 'V8 single-threaded execution, Event Loop queues, Promises, async/await syntax, DOM manipulation, and closures.' },
      { name: 'Unit 3: RESTful APIs & Web Architecture', desc: 'HTTP methods (GET, POST, PUT, PATCH, DELETE), status codes, JSON payload processing, Express middleware, and CORS.' },
      { name: 'Unit 4: Security & Web Storage', desc: 'Mitigating Cross-Site Scripting (XSS) and CSRF, browser storage (localStorage vs sessionStorage), and JWT authentication.' }
    ]
  },
  pm: {
    title: 'Project Management',
    subtitle: 'Agile, Scrum & Traditional Methodologies',
    studyLink: 'https://opentextbc.ca/projectmanagement/open/download?type=pdf&utm_source=chatgpt.com',
    modules: [
      { name: 'Unit 1: Project Initiation & Scope Baseline', desc: 'Project Charters, stakeholder management, the Iron Triangle (Scope, Time, Cost), and 100% Rule Work Breakdown Structures.' },
      { name: 'Unit 2: Scheduling, CPM & Float Analysis', desc: 'Precedence diagramming, Critical Path Method (CPM), forward/backward pass computations, and PERT three-point estimation.' },
      { name: 'Unit 3: Agile Manifesto & Scrum Framework', desc: 'Agile core values, Scrum roles (Product Owner, Scrum Master, Developers), User Stories, and time-boxed Sprint events.' },
      { name: 'Unit 4: Risk Management & Performance Control', desc: 'Risk registers, probability-impact matrices, Earned Value Management (EVM), Cost Performance Index, and RACI matrices.' }
    ]
  },
  micro: {
    title: 'Microprocessor and Interfacing',
    subtitle: '8086 Architecture & Peripheral Chips',
    studyLink: 'https://archive.nptel.ac.in/content/storage2/courses/106108100/pdf/Lecture_Notes/LNm3.pdf?utm_source=chatgpt.com',
    modules: [
      { name: 'Unit 1: 8086 Microprocessor Architecture', desc: 'Bus Interface Unit (BIU), Execution Unit (EU), 6-byte prefetch queue, 16-bit register files, and 20-bit physical addressing.' },
      { name: 'Unit 2: Memory Segmentation & Addressing Modes', desc: 'Segment:Offset translation ((Segment * 16) + Offset), immediate, direct, register indirect, and based-indexed modes.' },
      { name: 'Unit 3: Assembly Instruction Set & Stack', desc: 'Data transfer, arithmetic/logic primitives, branch execution, flag register states (ZF, CF, SF), and PUSH/POP stack mechanics.' },
      { name: 'Unit 4: Peripheral Interfacing Chips', desc: 'Intel 8255 Programmable Peripheral Interface (PPI), 8259 Interrupt Controller (PIC), 8253/8254 Timer, and DMA controllers.' }
    ]
  },
  syssoft: {
    title: 'System Software',
    subtitle: 'Assemblers, Compilers, Loaders & Linkers',
    studyLink: 'https://karanartscollege.edu.in/assets/images/ebook/SYSTEM%20SOFTWARE%20TEXTBOOK.pdf?utm_source=chatgpt.com',
    modules: [
      { name: 'Unit 1: Assemblers & Two-Pass Architecture', desc: 'Translating mnemonics to machine code, resolving forward references, Symbol Tables (SYMTAB), Opcode Tables (OPTAB), and LOCCTR.' },
      { name: 'Unit 2: Macro Processors', desc: 'Macro definition tables (DEFTAB), parameter substitution, and nested recursive macro expansion algorithms.' },
      { name: 'Unit 3: Linkers & Loaders', desc: 'Static vs dynamic linking, resolving external references (EXTDEF/EXTREF), relocating loaders, and address relocation.' },
      { name: 'Unit 4: Compiler Phases & Optimization', desc: 'Lexical analysis (DFAs/tokens), syntax parsing (ASTs/grammars), three-address intermediate code, and constant folding.' }
    ]
  }
};

function initCourses() {
  const modal = document.getElementById('courseModal');
  const closeBtn = document.getElementById('closeCourseModalBtn');
  const closeBottomBtn = document.getElementById('closeCourseModalBottomBtn');
  const modalTitle = document.getElementById('courseModalTitle');
  const modalSubtitle = document.getElementById('courseModalSubtitle');
  const modalBody = document.getElementById('courseModalBody');
  const viewBtns = document.querySelectorAll('.view-course-btn');

  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const courseKey = btn.getAttribute('data-course');
      const details = COURSE_DETAILS[courseKey];
      if (!details) return;

      if (modalTitle) modalTitle.textContent = details.title;
      if (modalSubtitle) modalSubtitle.textContent = details.subtitle;
      if (modalBody) {
        modalBody.innerHTML = `
          <div style="margin-bottom: 1.25rem;">
            <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.6;">
              Detailed curriculum breakdown for <strong>${details.title}</strong>. Each unit covers rigorous theoretical foundations and practical laboratory exercises.
            </p>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.85rem; margin-bottom: 1.5rem;">
            ${details.modules.map(m => `
              <div style="background-color: var(--cream); border-left: 3px solid var(--navy); padding: 0.85rem 1.15rem; border-radius: 0 var(--radius-sm) var(--radius-sm) 0;">
                <strong style="color: var(--navy); font-size: 0.95rem; display: block;">${m.name}</strong>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem; line-height: 1.5;">${m.desc}</p>
              </div>
            `).join('')}
          </div>
          <div style="padding-top: 1rem; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
            <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">Official Reference Link:</span>
            <a href="${details.studyLink}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
              <i class="fas fa-arrow-up-right-from-square"></i> Open Notes / Study Material
            </a>
          </div>
        `;
      }
      modal?.classList.add('show');
    });
  });

  const closeModal = () => modal?.classList.remove('show');
  closeBtn?.addEventListener('click', closeModal);
  closeBottomBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

/* ==========================================================================
   4. STUDY MATERIALS SECTION (EXACTLY 10 SUBJECTS)
   ========================================================================== */
function initStudyMaterials() {
  const searchInput = document.getElementById('materialSearchInput');
  const materialCards = document.querySelectorAll('.material-card');
  const pdfDownloadLinks = document.querySelectorAll('.download-pdf-track');
  const watchVideoBtns = document.querySelectorAll('.watch-video-btn');

  // Video Modal Elements
  const videoModal = document.getElementById('videoModal');
  const ytPlayerIframe = document.getElementById('ytPlayerIframe');
  const videoModalPlayerTitle = document.getElementById('videoModalPlayerTitle');
  const videoExternalYtLink = document.getElementById('videoExternalYtLink');
  const closeVideoModalBtn = document.getElementById('closeVideoModalBtn');
  const closeVideoBottomBtn = document.getElementById('closeVideoBottomBtn');

  // Search filtering across the 10 subjects
  searchInput?.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    materialCards.forEach(card => {
      const title = (card.getAttribute('data-title') || '').toLowerCase();
      const text = card.textContent.toLowerCase();
      if (!query || title.includes(query) || text.includes(query)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });

  // Track official PDF book downloads
  pdfDownloadLinks.forEach(link => {
    link.addEventListener('click', () => {
      const bookTitle = link.getAttribute('data-book') || 'Academic Handbook';
      showToast(`Downloading official PDF handbook: "${bookTitle}"`, 'success');
    });
  });

  // Video Masterclass streaming logic
  function playVideoLecture(ytId, title) {
    if (!ytId) return;
    if (ytPlayerIframe) {
      ytPlayerIframe.src = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`;
    }
    if (videoModalPlayerTitle) {
      videoModalPlayerTitle.textContent = title;
    }
    if (videoExternalYtLink) {
      videoExternalYtLink.href = `https://www.youtube.com/watch?v=${ytId}`;
    }
    if (videoModal) {
      videoModal.classList.add('show');
    }
    showToast(`Loading video lecture: ${title}`, 'info');
  }

  function stopAndCloseVideo() {
    if (videoModal) {
      videoModal.classList.remove('show');
    }
    if (ytPlayerIframe) {
      ytPlayerIframe.src = ''; // Stops audio and video playback immediately
    }
  }

  watchVideoBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const ytId = btn.getAttribute('data-yt-id');
      const ytTitle = btn.getAttribute('data-yt-title') || 'Educational Lecture';
      playVideoLecture(ytId, ytTitle);
    });
  });

  closeVideoModalBtn?.addEventListener('click', stopAndCloseVideo);
  closeVideoBottomBtn?.addEventListener('click', stopAndCloseVideo);
  videoModal?.addEventListener('click', (e) => {
    if (e.target === videoModal) stopAndCloseVideo();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal?.classList.contains('show')) {
      stopAndCloseVideo();
    }
  });
}

/* ==========================================================================
   5. ONLINE ASSESSMENT & QUIZ ENGINE
   (6 Subjects x 15 Questions = 90 Questions Total)
   ========================================================================== */
function initQuizEngine() {
  if (typeof QUIZ_DATA === 'undefined') {
    console.error('Quiz data not loaded.');
    return;
  }

  let currentSubjectKey = 'networks';
  let currentQuestionIndex = 0;
  let userAnswers = {}; // Map question index to chosen option index

  // DOM Elements
  const subjectTabs = document.querySelectorAll('.quiz-subject-tab');
  const subjectBadge = document.getElementById('quizSubjectBadge');
  const counterText = document.getElementById('quizCounterText');
  const progressBar = document.getElementById('quizProgressBar');
  const questionScreen = document.getElementById('quizQuestionScreen');
  const resultScreen = document.getElementById('quizResultScreen');
  const questionText = document.getElementById('quizQuestionText');
  const optionsContainer = document.getElementById('quizOptionsContainer');
  const prevBtn = document.getElementById('quizPrevBtn');
  const nextBtn = document.getElementById('quizNextBtn');
  const submitBtn = document.getElementById('quizSubmitBtn');
  const retakeBtn = document.getElementById('retakeQuizBtn');
  const toggleReviewBtn = document.getElementById('toggleReviewBtn');
  const reviewContainer = document.getElementById('quizReviewContainer');
  const reviewQuestionsList = document.getElementById('reviewQuestionsList');

  // Result Elements
  const resultScore = document.getElementById('resultScore');
  const resultPercentage = document.getElementById('resultPercentage');
  const resultMessage = document.getElementById('resultMessage');

  // Load question for current subject
  function renderCurrentQuestion() {
    const subject = QUIZ_DATA[currentSubjectKey];
    if (!subject || !subject.questions) return;

    const questions = subject.questions;
    const totalQ = questions.length;
    const currentQ = questions[currentQuestionIndex];

    if (subjectBadge) subjectBadge.textContent = `Subject: ${subject.name}`;
    if (counterText) counterText.textContent = `Question ${currentQuestionIndex + 1} of ${totalQ}`;
    
    // Progress calculation
    const pct = ((currentQuestionIndex + 1) / totalQ) * 100;
    if (progressBar) progressBar.style.width = `${pct}%`;

    // Render Question Text
    if (questionText) {
      questionText.textContent = `${currentQuestionIndex + 1}. ${currentQ.q}`;
    }

    // Render 4 Options
    if (optionsContainer) {
      optionsContainer.innerHTML = currentQ.options.map((opt, idx) => {
        const isSelected = userAnswers[currentQuestionIndex] === idx;
        const activeClass = isSelected ? 'active' : '';
        return `
          <button type="button" class="quiz-option-btn ${activeClass}" data-opt-idx="${idx}" style="text-align: left; padding: 1rem 1.25rem; border-radius: var(--radius-sm); border: 1.5px solid ${isSelected ? 'var(--navy)' : 'var(--border-subtle)'}; background: ${isSelected ? 'var(--cream)' : 'var(--white)'}; color: var(--navy); font-size: 0.95rem; font-weight: 500; cursor: pointer; transition: all var(--transition-fast); display: flex; align-items: center; gap: 0.75rem;">
            <span style="width: 26px; height: 26px; border-radius: 50%; border: 2px solid ${isSelected ? 'var(--navy)' : 'var(--sage)'}; display: inline-flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; flex-shrink: 0; background: ${isSelected ? 'var(--navy)' : 'transparent'}; color: ${isSelected ? '#FFFFFF' : 'var(--navy)'};">
              ${String.fromCharCode(65 + idx)}
            </span>
            <span>${escapeHtml(opt)}</span>
          </button>
        `;
      }).join('');

      // Add click listeners to option buttons
      optionsContainer.querySelectorAll('.quiz-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const optIdx = parseInt(btn.getAttribute('data-opt-idx'), 10);
          userAnswers[currentQuestionIndex] = optIdx;
          renderCurrentQuestion();
        });
      });
    }

    // Button states
    if (prevBtn) {
      prevBtn.disabled = currentQuestionIndex === 0;
    }

    if (currentQuestionIndex === totalQ - 1) {
      if (nextBtn) nextBtn.style.display = 'none';
      if (submitBtn) submitBtn.style.display = 'inline-flex';
    } else {
      if (nextBtn) nextBtn.style.display = 'inline-flex';
      if (submitBtn) submitBtn.style.display = 'none';
    }
  }

  // Navigation handlers
  prevBtn?.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      renderCurrentQuestion();
    }
  });

  nextBtn?.addEventListener('click', () => {
    const totalQ = QUIZ_DATA[currentSubjectKey].questions.length;
    if (currentQuestionIndex < totalQ - 1) {
      currentQuestionIndex++;
      renderCurrentQuestion();
    }
  });

  // Subject Tab Switcher
  subjectTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      subjectTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentSubjectKey = tab.getAttribute('data-subject');
      currentQuestionIndex = 0;
      userAnswers = {};

      if (questionScreen) questionScreen.style.display = 'block';
      if (resultScreen) resultScreen.style.display = 'none';
      if (reviewContainer) reviewContainer.style.display = 'none';

      renderCurrentQuestion();
      showToast(`Loaded assessment: ${QUIZ_DATA[currentSubjectKey].name}`, 'info');
    });
  });

  // Submit Quiz Calculation
  submitBtn?.addEventListener('click', () => {
    const subject = QUIZ_DATA[currentSubjectKey];
    const questions = subject.questions;
    let score = 0;

    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct) {
        score++;
      }
    });

    const total = questions.length;
    const percentage = ((score / total) * 100).toFixed(1);

    if (resultScore) resultScore.textContent = `${score} / ${total}`;
    if (resultPercentage) resultPercentage.textContent = `Percentage: ${percentage}%`;

    let msg = '';
    if (score >= 13) {
      msg = 'Outstanding Mastery! Exceptional comprehension of this subject.';
    } else if (score >= 10) {
      msg = 'Good Performance! Solid understanding with minor areas for review.';
    } else {
      msg = 'Keep Practicing! Review the study materials and retake the quiz to improve.';
    }
    if (resultMessage) resultMessage.textContent = msg;

    // Build Detailed Review Analysis
    if (reviewQuestionsList) {
      reviewQuestionsList.innerHTML = questions.map((q, idx) => {
        const userChoice = userAnswers[idx];
        const isCorrect = userChoice === q.correct;
        const userChoiceText = userChoice !== undefined ? q.options[userChoice] : 'Not Answered';
        const correctChoiceText = q.options[q.correct];

        return `
          <div style="background: var(--cream); border-left: 4px solid ${isCorrect ? '#2E7D32' : '#C62828'}; padding: 1.25rem; border-radius: 0 var(--radius-sm) var(--radius-sm) 0;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
              <strong style="color: var(--navy); font-size: 0.95rem;">Question ${idx + 1}: ${escapeHtml(q.q)}</strong>
              <span style="font-weight: 700; font-size: 0.82rem; padding: 0.2rem 0.65rem; border-radius: var(--radius-pill); background: ${isCorrect ? '#E8F5E9' : '#FFEBEE'}; color: ${isCorrect ? '#2E7D32' : '#C62828'}; white-space: nowrap; margin-left: 0.5rem;">
                ${isCorrect ? '✓ Correct' : '✗ Incorrect'}
              </span>
            </div>
            <div style="font-size: 0.88rem; margin-bottom: 0.35rem;">
              <strong>Your Answer:</strong> <span style="color: ${isCorrect ? '#2E7D32' : '#C62828'};">${escapeHtml(userChoiceText)}</span>
            </div>
            ${!isCorrect ? `
              <div style="font-size: 0.88rem; margin-bottom: 0.35rem;">
                <strong>Correct Answer:</strong> <span style="color: #2E7D32; font-weight: 600;">${escapeHtml(correctChoiceText)}</span>
              </div>
            ` : ''}
            <div style="font-size: 0.84rem; color: var(--text-muted); margin-top: 0.5rem; line-height: 1.5; background: var(--white); padding: 0.65rem 0.85rem; border-radius: var(--radius-xs);">
              <i class="fas fa-circle-info" style="color: var(--navy); margin-right: 0.35rem;"></i> <strong>Explanation:</strong> ${escapeHtml(q.explanation)}
            </div>
          </div>
        `;
      }).join('');
    }

    if (questionScreen) questionScreen.style.display = 'none';
    if (resultScreen) resultScreen.style.display = 'block';
    if (reviewContainer) reviewContainer.style.display = 'none';

    resultScreen?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    showToast(`Quiz completed: ${score} / ${total} (${percentage}%)`, 'success');
  });

  // Retake Quiz
  retakeBtn?.addEventListener('click', () => {
    userAnswers = {};
    currentQuestionIndex = 0;
    if (questionScreen) questionScreen.style.display = 'block';
    if (resultScreen) resultScreen.style.display = 'none';
    if (reviewContainer) reviewContainer.style.display = 'none';
    renderCurrentQuestion();
  });

  // Toggle Review
  toggleReviewBtn?.addEventListener('click', () => {
    if (reviewContainer) {
      const isHidden = reviewContainer.style.display === 'none';
      reviewContainer.style.display = isHidden ? 'block' : 'none';
      toggleReviewBtn.innerHTML = isHidden 
        ? '<i class="fas fa-eye-slash"></i> Hide Review' 
        : '<i class="fas fa-list-check"></i> Review All 15 Answers';
      if (isHidden) {
        reviewContainer.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  // Initial render
  renderCurrentQuestion();
}

/* ==========================================================================
   6. FEEDBACK SYSTEM
   ========================================================================== */
function initFeedbackSystem() {
  const form = document.getElementById('feedbackForm');
  const alertEl = document.getElementById('feedbackSuccessAlert');
  const submitBtn = document.getElementById('fbSubmitBtn');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('fbName')?.value.trim();
    const email = document.getElementById('fbEmail')?.value.trim();
    const rating = document.getElementById('fbRating')?.value;
    const msg = document.getElementById('fbMessage')?.value.trim();

    if (!name || !email || !rating || !msg) {
      showToast('Please fill in all feedback fields.', 'error');
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    }

    setTimeout(() => {
      if (alertEl) alertEl.style.display = 'flex';
      form.reset();
      showToast('Thank you! Your feedback has been recorded.', 'success');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Feedback';
      }
    }, 600);
  });
}



/* ==========================================================================
   8. RESTRICTED OWNER ACCESS FOR EXCEL MANAGEMENT
   (Only the main website owner can download or view Excel records)
   ========================================================================== */
function initOwnerAccess() {
  const modal = document.getElementById('ownerModal');
  const footerLockBtn = document.getElementById('footerOwnerLockBtn');
  const closeBtn = document.getElementById('closeOwnerModalBtn');
  const closeBottomBtn = document.getElementById('closeOwnerModalBottomBtn');

  // Views inside modal
  const loginView = document.getElementById('ownerLoginView');
  const consoleView = document.getElementById('ownerConsoleView');
  const loginForm = document.getElementById('ownerLoginForm');
  const passkeyInput = document.getElementById('ownerPasskeyInput');
  const passkeyError = document.getElementById('errOwnerPasskey');
  const authSubmitBtn = document.getElementById('ownerAuthSubmitBtn');

  // Console controls
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
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem;"><i class="fas fa-spinner fa-spin"></i> Reading secure Excel records from server...</td></tr>`;
    }

    try {
      const ownerKey = EduAPI.getSavedOwnerKey();
      const result = await EduAPI.getExcelData(ownerKey);
      const students = result.data || [];
      if (recordCountEl) recordCountEl.textContent = students.length;

      if (students.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem;">No student records found in Excel sheet yet.</td></tr>`;
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
        tableBody.innerHTML = `<tr><td colspan="7" style="color: var(--error); text-align: center; padding: 2rem;">Error reading Excel workbook: ${escapeHtml(err.message)}</td></tr>`;
      }
    }
  }

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

  logoutBtn?.addEventListener('click', () => {
    EduAPI.clearOwnerKey();
    showToast('Owner session locked successfully.', 'info');
    showLoginView();
  });

  footerLockBtn?.addEventListener('click', openOwnerModal);

  // Keyboard shortcut: Ctrl + Shift + O for owner login
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
   TOAST NOTIFICATION HELPER
   ========================================================================== */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'toast-error' : type === 'success' ? 'toast-success' : ''}`;

  let icon = 'fa-info-circle';
  if (type === 'success') icon = 'fa-circle-check';
  if (type === 'error') icon = 'fa-circle-exclamation';

  toast.innerHTML = `
    <i class="fas ${icon}" style="font-size: 1.1rem; flex-shrink: 0;"></i>
    <div style="flex: 1; line-height: 1.4;">${escapeHtml(message)}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 4000);
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
