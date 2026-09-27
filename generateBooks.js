const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const materialsDir = path.join(__dirname, 'public', 'materials');
if (!fs.existsSync(materialsDir)) {
  fs.mkdirSync(materialsDir, { recursive: true });
}

// Brand Colors
const NAVY = '#1E3A5F';
const SAGE = '#6B8B74';
const LIGHT_BG = '#F8F6F0';
const DARK_TEXT = '#142740';
const MUTED_TEXT = '#597089';

function createEducationalBook({ filename, title, subtitle, subject, author, chapters }) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(materialsDir, filename);
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 54, bottom: 54, left: 54, right: 54 },
      bufferPages: true
    });

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // ==========================================
    // COVER PAGE
    // ==========================================
    doc.rect(0, 0, 595.28, 140).fill(NAVY);
    doc.rect(0, 140, 595.28, 8).fill(SAGE);

    doc.fillColor('#FFFFFF').fontSize(24).font('Helvetica-Bold')
       .text('QUALITY EDUCATION ACADEMIC PRESS', 54, 45);
    doc.fillColor('#A8C3B0').fontSize(11).font('Helvetica')
       .text('OFFICIAL ACADEMIC STUDY HANDBOOK & COURSE MANUAL', 54, 78);
    doc.fillColor('#FFFFFF').fontSize(10).font('Helvetica-Oblique')
       .text('“Learn Today, Build a Better Tomorrow”', 54, 100);

    // Subject badge
    doc.roundedRect(54, 190, 220, 24, 6).fill(LIGHT_BG);
    doc.fillColor(NAVY).fontSize(10).font('Helvetica-Bold')
       .text(subject.toUpperCase(), 64, 197);

    // Main Book Title
    doc.fillColor(NAVY).fontSize(26).font('Helvetica-Bold')
       .text(title, 54, 235, { width: 480, lineGap: 6 });

    // Subtitle
    doc.fillColor(MUTED_TEXT).fontSize(13).font('Helvetica')
       .text(subtitle, 54, 320, { width: 480, lineGap: 4 });

    // Decorative line
    doc.strokeColor(SAGE).lineWidth(2).moveTo(54, 395).lineTo(541, 395).stroke();

    // Metadata Box
    doc.roundedRect(54, 420, 487, 130, 8).strokeColor('#E2DED5').lineWidth(1).fillAndStroke('#FCFBF8', '#E2DED5');
    
    doc.fillColor(NAVY).fontSize(11).font('Helvetica-Bold').text('Academic Publication Details:', 74, 440);
    doc.fillColor(DARK_TEXT).fontSize(10).font('Helvetica')
       .text(`Subject: ${subject}`, 74, 460)
       .text(`Principal Author / Academic Reviewer: ${author}`, 74, 480)
       .text('Standard: Quality Education Curriculum Standard', 74, 500)
       .text('Format: Official Open Access Educational Material', 74, 520);

    // Cover page footer
    doc.rect(0, 780, 595.28, 62).fill(NAVY);
    doc.fillColor('#DDEEE3').fontSize(9).font('Helvetica')
       .text('Quality Education Platform • Open Learning Resource • All Rights Reserved', 54, 800, { align: 'center', width: 487 });

    // ==========================================
    // TABLE OF CONTENTS & CHAPTERS
    // ==========================================
    doc.addPage();

    function drawPageHeader(pageTitle) {
      doc.rect(0, 0, 595.28, 40).fill(NAVY);
      doc.fillColor('#FFFFFF').fontSize(10).font('Helvetica-Bold')
         .text('Quality Education Study Handbook', 54, 15);
      doc.fillColor('#A8C3B0').fontSize(10).font('Helvetica')
         .text(pageTitle, 350, 15, { align: 'right', width: 191 });
    }

    drawPageHeader('Table of Contents');

    doc.fillColor(NAVY).fontSize(20).font('Helvetica-Bold')
       .text('Table of Contents', 54, 65);
    doc.strokeColor(SAGE).lineWidth(1.5).moveTo(54, 95).lineTo(250, 95).stroke();

    let tocY = 115;
    chapters.forEach((ch, idx) => {
      doc.fillColor(NAVY).fontSize(11).font('Helvetica-Bold')
         .text(`Chapter ${idx + 1}: ${ch.title}`, 64, tocY);
      doc.fillColor(MUTED_TEXT).fontSize(9).font('Helvetica')
         .text(`Core Competency: ${ch.competency || 'Academic Foundations'}`, 80, tocY + 16);
      tocY += 40;
    });

    // CHAPTER PAGES
    chapters.forEach((ch, idx) => {
      doc.addPage();
      drawPageHeader(`Chapter ${idx + 1}`);

      doc.fillColor(SAGE).fontSize(11).font('Helvetica-Bold')
         .text(`CHAPTER ${idx + 1}`, 54, 60);

      doc.fillColor(NAVY).fontSize(20).font('Helvetica-Bold')
         .text(ch.title, 54, 78, { width: 480 });

      doc.strokeColor(SAGE).lineWidth(1.5).moveTo(54, 110).lineTo(541, 110).stroke();

      let currentY = 125;

      // Section 1: Overview
      doc.fillColor(NAVY).fontSize(13).font('Helvetica-Bold')
         .text('1. Theoretical Foundations & Scope', 54, currentY);
      currentY += 20;

      doc.fillColor(DARK_TEXT).fontSize(10).font('Helvetica')
         .text(ch.overview, 54, currentY, { width: 487, align: 'justify', lineGap: 4 });
      currentY += doc.heightOfString(ch.overview, { width: 487, lineGap: 4 }) + 15;

      // Section 2: Core Concepts
      doc.fillColor(NAVY).fontSize(13).font('Helvetica-Bold')
         .text('2. Core Conceptual Framework', 54, currentY);
      currentY += 20;

      ch.concepts.forEach(concept => {
        doc.fillColor(NAVY).fontSize(10).font('Helvetica-Bold')
           .text(`• ${concept.heading}: `, 64, currentY, { continued: true });
        doc.fillColor(DARK_TEXT).fontSize(10).font('Helvetica')
           .text(concept.body, { lineGap: 3 });
        currentY += doc.heightOfString(`• ${concept.heading}: ${concept.body}`, { width: 477, lineGap: 3 }) + 8;
      });

      currentY += 10;

      // Section 3: Practical Takeaways
      doc.roundedRect(54, currentY, 487, 85, 6).fill(LIGHT_BG);
      doc.fillColor(NAVY).fontSize(11).font('Helvetica-Bold')
         .text('Key Practical Insights & Examination Takeaways:', 68, currentY + 12);
      
      let takeawayY = currentY + 30;
      ch.takeaways.forEach(tk => {
        doc.fillColor(DARK_TEXT).fontSize(9.5).font('Helvetica')
           .text(`✓ ${tk}`, 76, takeawayY, { width: 450 });
        takeawayY += 16;
      });
    });

    // REFERENCES PAGE
    doc.addPage();
    drawPageHeader('References & Recommended Reading');
    doc.fillColor(NAVY).fontSize(20).font('Helvetica-Bold')
       .text('Academic References & Further Study', 54, 65);
    doc.strokeColor(SAGE).lineWidth(1.5).moveTo(54, 95).lineTo(320, 95).stroke();

    const references = [
      'Quality Education Academic Standards & Pedagogical Guidelines, 2026 Edition.',
      'International Computer Science & Engineering Curriculum Framework.',
      'Educational Technology & Assessment Methodology Research Series.',
      'Open Access Educational Resource Repository - Quality Education Platform.'
    ];

    let refY = 120;
    references.forEach((ref, i) => {
      doc.fillColor(NAVY).fontSize(10).font('Helvetica-Bold')
         .text(`[${i + 1}] `, 54, refY, { continued: true });
      doc.fillColor(DARK_TEXT).fontSize(10).font('Helvetica')
         .text(ref, { width: 460, lineGap: 4 });
      refY += 36;
    });

    // Number all pages except cover
    const range = doc.bufferedPageRange();
    for (let i = 1; i < range.count; i++) {
      doc.switchToPage(i);
      doc.fillColor(MUTED_TEXT).fontSize(8.5).font('Helvetica')
         .text(`Page ${i + 1} of ${range.count}`, 54, 800, { align: 'center', width: 487 });
    }

    doc.end();
    stream.on('finish', () => {
      console.log(`[Generated PDF] ${filename} created successfully.`);
      resolve(filePath);
    });
    stream.on('error', reject);
  });
}

// Data for the 10 study materials
const BOOKS = [
  {
    filename: 'Computer_Networks_Handbook.pdf',
    title: 'Computer Networks: Architecture, Protocols & Systems',
    subtitle: 'From OSI & TCP/IP Layering to High-Performance Routing, Congestion Control & Network Security',
    subject: 'Computer Networks',
    author: 'Prof. Arvind Krishnan & Networking Research Group',
    chapters: [
      {
        title: 'Network Topologies, Layering Models & Physical Transmission',
        competency: 'Protocol Architecture',
        overview: 'Computer networking provides the communication backbone of modern computing. This chapter covers the OSI 7-layer reference model, TCP/IP protocol suite, transmission media, packet switching versus circuit switching, and framing techniques.',
        concepts: [
          { heading: 'OSI vs TCP/IP', body: 'Comparing theoretical 7-layer encapsulation with practical 4-layer TCP/IP internet protocol stack architecture.' },
          { heading: 'Multiplexing & Framing', body: 'FDM, TDM, and WDM methods alongside bit-stuffing and byte-stuffing error detection mechanisms.' },
          { heading: 'Data Link Layer Control', body: 'Flow control protocols including Stop-and-Wait, Go-Back-N, and Selective Repeat ARQ mechanisms.' }
        ],
        takeaways: [
          'Understand layering abstractions and encapsulation headers.',
          'Analyze channel capacity using Nyquist and Shannon theorems.',
          'Differentiate framing algorithms and error detection codes like CRC.'
        ]
      },
      {
        title: 'Network Layer Routing Algorithms & IP Addressing',
        competency: 'Internet Routing',
        overview: 'The network layer is responsible for host-to-host packet delivery. We examine IPv4 and IPv6 addressing schemes, CIDR subnetting, distance-vector algorithms (Bellman-Ford), link-state routing (Dijkstra), and BGP peering.',
        concepts: [
          { heading: 'Dijkstra vs Bellman-Ford', body: 'Link-state global knowledge calculation versus distance-vector distributed routing updates and count-to-infinity mitigation.' },
          { heading: 'CIDR & Subnetting', body: 'Variable-length subnet masking (VLSM) and hierarchical aggregation for efficient routing tables.' },
          { heading: 'Network Address Translation', body: 'NAT and PAT translation mechanics allowing private subnets to share public IP addresses.' }
        ],
        takeaways: [
          'Calculate subnet masks, usable host ranges, and broadcast addresses.',
          'Trace shortest path algorithms across weighted network graphs.',
          'Contrast interior gateway protocols (OSPF, RIP) with exterior protocols (BGP).'
        ]
      },
      {
        title: 'Transport Layer Protocols: TCP, UDP & Congestion Control',
        competency: 'End-to-End Transport',
        overview: 'Transport layer protocols provide process-to-process communication. We analyze TCP three-way handshakes, connection termination, window-based flow control, and AIMD congestion control mechanics.',
        concepts: [
          { heading: 'TCP vs UDP', body: 'Connection-oriented reliable byte-stream transmission versus low-overhead connectionless datagram streaming.' },
          { heading: 'Congestion Control', body: 'Slow Start, Congestion Avoidance, Fast Retransmit, and Fast Recovery algorithms.' },
          { heading: 'Port Multiplexing', body: 'Socket pair abstractions binding local IP/port combinations to remote IP/port endpoints.' }
        ],
        takeaways: [
          'Examine sequence numbers, acknowledgment numbers, and TCP state transitions.',
          'Explain why UDP is preferred for real-time gaming and VoIP streaming.',
          'Analyze bufferbloat and active queue management (RED).'
        ]
      }
    ]
  },
  {
    filename: 'Python_for_Data_Science_Handbook.pdf',
    title: 'Python for Data Science: Analytics & Machine Learning',
    subtitle: 'High-Performance Numerical Computing with NumPy, Pandas, Scikit-Learn & Matplotlib',
    subject: 'Python for Data Science',
    author: 'Dr. Vikram Malhotra & Data Science Faculty',
    chapters: [
      {
        title: 'Vectorized Computing with NumPy & Array Manipulation',
        competency: 'Numerical Programming',
        overview: 'NumPy forms the fundamental building block for scientific computing in Python. This chapter explores ndarrays, memory strides, vectorized operations, broadcasting semantics, and linear algebra routines.',
        concepts: [
          { heading: 'Array Broadcasting', body: 'Mechanisms governing element-wise operations on arrays of differing compatible shapes without explicit loops.' },
          { heading: 'Memory Layout & Slicing', body: 'C-contiguous versus Fortran-contiguous orders, zero-copy memory views, and strided indexing.' },
          { heading: 'Matrix Decomposition', body: 'Eigenvalue computation, singular value decomposition (SVD), and matrix inverses in numpy.linalg.' }
        ],
        takeaways: [
          'Eliminate slow Python loops using vectorized universal functions (ufuncs).',
          'Master boolean masking and fancy indexing for multi-dimensional filtering.',
          'Optimize memory footprints using appropriate int/float dtypes.'
        ]
      },
      {
        title: 'Data Wrangling, Aggregation & Pipelines with Pandas',
        competency: 'Data Manipulation',
        overview: 'Pandas provides intuitive, high-performance data structures for structured data manipulation. We cover Series, DataFrames, multi-indexing, handling missing values, groupby aggregations, and tidy data reshaping.',
        concepts: [
          { heading: 'DataFrame Indexing', body: 'Precision differences between loc (label-based) and iloc (integer position-based) selection.' },
          { heading: 'Groupby Mechanics', body: 'The Split-Apply-Combine paradigm for parallel statistical computations across categorical segments.' },
          { heading: 'Missing Data Imputation', body: 'Techniques for identifying NaN values and applying forward-fill, mean/median imputation, or drop criteria.' }
        ],
        takeaways: [
          'Perform complex database-style merges, joins, and concatenations.',
          'Reshape tabular datasets using pivot_table and melt operations.',
          'Parse and resample time-series data using date range indices.'
        ]
      },
      {
        title: 'Predictive Modeling & Evaluation with Scikit-Learn',
        competency: 'Machine Learning Workflow',
        overview: 'Scikit-Learn provides a clean, unified API for supervised and unsupervised machine learning. We examine linear models, decision trees, random forests, feature scaling, cross-validation, and performance metrics.',
        concepts: [
          { heading: 'Transformer-Estimator API', body: 'Consistent fit, transform, and predict method signatures enabling robust pipeline construction.' },
          { heading: 'Cross-Validation & Grid Search', body: 'K-fold stratified cross-validation and hyperparameter optimization preventing data leakage.' },
          { heading: 'Evaluation Metrics', body: 'ROC-AUC curves, precision-recall trade-offs, confusion matrices, and F1-score interpretation.' }
        ],
        takeaways: [
          'Build end-to-end preprocessing pipelines using ColumnTransformer.',
          'Diagnose bias versus variance trade-offs using learning curves.',
          'Select optimal classification and regression metrics for imbalanced datasets.'
        ]
      }
    ]
  },
  {
    filename: 'Web_Application_Development_Handbook.pdf',
    title: 'Modern Web Application Development & Architecture',
    subtitle: 'Full-Stack Engineering: HTML5, CSS3, Modern JavaScript, REST APIs & Backend Services',
    subject: 'Web Application Development',
    author: 'Elena Rostova & Web Engineering Group',
    chapters: [
      {
        title: 'Semantic HTML5, CSS Grid, Flexbox & Responsive UI Design',
        competency: 'Frontend Foundations',
        overview: 'Modern frontend development emphasizes accessibility, responsive layout algorithms, and semantic document hierarchies. This chapter teaches mobile-first CSS architecture, CSS custom properties, Flexbox, and CSS Grid.',
        concepts: [
          { heading: 'Flexbox vs CSS Grid', body: 'One-dimensional content-driven flow layouts versus two-dimensional structured grid layout algorithms.' },
          { heading: 'Responsive Media Queries', body: 'Fluid typography, viewport units, clamp() formulas, and adaptive breakpoint planning.' },
          { heading: 'Web Accessibility (a11y)', body: 'ARIA attributes, semantic milestone tags, color contrast ratios, and keyboard navigation.' }
        ],
        takeaways: [
          'Build responsive layouts that gracefully adapt across mobile, tablet, and desktop.',
          'Utilize CSS custom variables for maintainable design systems and theme switching.',
          'Ensure complete keyboard navigability and screen-reader accessibility.'
        ]
      },
      {
        title: 'Asynchronous JavaScript, DOM Manipulation & Event Loop',
        competency: 'Client-Side Scripting',
        overview: 'JavaScript powers interactive browser experiences. We dissect the V8 JavaScript engine, event loop call stack, microtask vs macrotask queues, Promises, async/await syntax, and high-performance DOM manipulation.',
        concepts: [
          { heading: 'The Event Loop', body: 'How single-threaded JavaScript executes non-blocking asynchronous operations through event queues.' },
          { heading: 'Promises & Async/Await', body: 'Eliminating callback hell through chainable Promise objects and ergonomic try/catch async functions.' },
          { heading: 'Event Delegation', body: 'Efficiently capturing events at parent container levels using bubbling to optimize listener overhead.' }
        ],
        takeaways: [
          'Fetch and render dynamic API data asynchronously using fetch() and error handling.',
          'Prevent memory leaks by removing detached DOM listeners and timers.',
          'Understand closures, execution contexts, and lexical scoping in modern ES6+.'
        ]
      },
      {
        title: 'RESTful API Engineering & Server Architecture',
        competency: 'Backend Systems',
        overview: 'Building robust backend web services requires clean API design, authentication, and secure data validation. This chapter explores Express.js middleware, HTTP methods and status codes, CORS policies, and JWT token authentication.',
        concepts: [
          { heading: 'REST Architecture Principles', body: 'Stateless communication, uniform resource naming conventions, and standard HTTP verb semantics.' },
          { heading: 'Middleware Pipelines', body: 'Sequential request processing for authentication, input sanitization, rate limiting, and logging.' },
          { heading: 'Web Security Practices', body: 'Guarding against XSS, CSRF, SQL Injection, and CORS misconfigurations.' }
        ],
        takeaways: [
          'Design intuitive, predictable RESTful endpoints following standard conventions.',
          'Implement JSON schema validation and structured error handling middlewares.',
          'Secure API endpoints with authorization headers and token verification.'
        ]
      }
    ]
  },
  {
    filename: 'Project_Management_Handbook.pdf',
    title: 'Principles of Project Management: Agile, Scrum & Traditional',
    subtitle: 'From Scope Planning, WBS & Critical Path Method to Agile Sprints, Risk Management & Leadership',
    subject: 'Project Management',
    author: 'Prof. Rajeshwari Das & Leadership Institute',
    chapters: [
      {
        title: 'Project Initiation, Scope Definition & Work Breakdown (WBS)',
        competency: 'Project Scoping',
        overview: 'Successful project management begins with clear objective definition and stakeholder alignment. This chapter covers project charters, SMART goals, requirements gathering, scope creep prevention, and Work Breakdown Structures.',
        concepts: [
          { heading: 'Project Charter & Stakeholders', body: 'Authorizing the project, identifying key influencers, and establishing success metrics.' },
          { heading: 'Work Breakdown Structure (WBS)', body: 'Hierarchical decomposition of total project scope into manageable, assignable work packages.' },
          { heading: 'Scope Baseline & Change Control', body: 'Formal processes for evaluating, approving, and documenting changes to project deliverables.' }
        ],
        takeaways: [
          'Draft actionable project charters with clearly articulated business cases.',
          'Construct 100% rule compliant Work Breakdown Structures.',
          'Implement change control boards to prevent unmanaged scope creep.'
        ]
      },
      {
        title: 'Project Scheduling: Gantt Charts, CPM & PERT Analysis',
        competency: 'Time & Resource Management',
        overview: 'Timely project delivery requires rigorous dependency mapping and scheduling. We examine activity sequencing, Precedence Diagramming Method (PDM), Critical Path Method (CPM), forward/backward pass calculations, and float analysis.',
        concepts: [
          { heading: 'Critical Path Method (CPM)', body: 'Determining the sequence of dependent activities that dictates the shortest possible project duration.' },
          { heading: 'Total Float vs Free Float', body: 'Calculating the amount of time an activity can slip without delaying the successor or final deadline.' },
          { heading: 'PERT Three-Point Estimation', body: 'Weighted averaging of optimistic, most likely, and pessimistic task durations under uncertainty.' }
        ],
        takeaways: [
          'Identify critical path tasks where delays directly jeopardize overall completion.',
          'Create Gantt charts showing concurrent and sequential project milestones.',
          'Perform resource leveling to resolve over-allocated project team members.'
        ]
      },
      {
        title: 'Agile Methodologies, Scrum Framework & Risk Management',
        competency: 'Agile Delivery & Governance',
        overview: 'Modern software and technology projects rely heavily on iterative Agile frameworks. This chapter covers the Agile Manifesto, Scrum ceremonies (Sprint Planning, Daily Standup, Sprint Review, Retrospective), and proactive risk registers.',
        concepts: [
          { heading: 'Scrum Roles & Artifacts', body: 'Product Owner, Scrum Master, and Developers collaborating around Product Backlog, Sprint Backlog, and Increment.' },
          { heading: 'Sprint Velocity & Burndown Charts', body: 'Tracking team velocity using story points and identifying delivery bottlenecks.' },
          { heading: 'Risk Probability & Impact Matrix', body: 'Categorizing project risks, establishing mitigation triggers, and maintaining contingency reserves.' }
        ],
        takeaways: [
          'Facilitate effective Scrum events and write clear User Stories with acceptance criteria.',
          'Assess qualitative and quantitative risks using probability-impact scoring.',
          'Cultivate psychological safety and servant leadership in cross-functional teams.'
        ]
      }
    ]
  },
  {
    filename: 'Microprocessor_and_Interfacing_Handbook.pdf',
    title: 'Microprocessor Architecture & Peripheral Interfacing',
    subtitle: '8086 Instruction Set, Memory Segmentation, Interrupt Handling, Bus Timings & Peripheral Chips (8255, 8259, 8253)',
    subject: 'Microprocessor and Interfacing',
    author: 'Dr. Marcus Sterling & Embedded Systems Lab',
    chapters: [
      {
        title: '8086 Internal Architecture, Registers & Memory Segmentation',
        competency: 'Processor Architecture',
        overview: 'The 8086 16-bit microprocessor represents a landmark architecture in modern computing. This chapter dissects the Bus Interface Unit (BIU), Execution Unit (EU), 20-bit physical address calculation, and 64KB segmented memory organization.',
        concepts: [
          { heading: 'BIU and EU Pipelining', body: 'Instruction prefetch queue enabling overlapping fetch and execution cycles.' },
          { heading: 'Memory Segmentation', body: 'Logical segment:offset address generation multiplying segment register values by 16 to produce 20-bit physical addresses.' },
          { heading: 'Register File Organization', body: 'General-purpose (AX, BX, CX, DX), pointer/index (SP, BP, SI, DI), and flag registers.' }
        ],
        takeaways: [
          'Calculate 20-bit physical addresses from CS:IP, DS:BX, and SS:SP pairs.',
          'Explain the operational advantages of instruction pipelining.',
          'Analyze status and control flags including Zero, Carry, Sign, and Overflow flags.'
        ]
      },
      {
        title: 'Assembly Language Programming & Addressing Modes',
        competency: 'Low-Level Programming',
        overview: 'Programming at the assembly level gives precise control over hardware resources. We study the eight 8086 addressing modes, data transfer instructions, arithmetic/logic operations, branch controls, and string primitives.',
        concepts: [
          { heading: 'Addressing Modes', body: 'Immediate, register, direct, register indirect, based, indexed, based-indexed, and relative modes.' },
          { heading: 'Stack Operations & Subroutines', body: 'CALL and RET mechanics, parameter passing via stack frames, and interrupt stack preservation.' },
          { heading: 'String Instructions', body: 'MOVSB, CMPSB, SCASB with REP prefixes leveraging SI, DI, and CX counter registers.' }
        ],
        takeaways: [
          'Write efficient assembly routines for array manipulation and arithmetic operations.',
          'Construct modular subroutines with balanced push/pop stack frames.',
          'Debug low-level register states using simulator step debugging.'
        ]
      },
      {
        title: 'Peripheral Interfacing: 8255 PPI, 8259 PIC & 8254 Timer',
        competency: 'Hardware Interfacing',
        overview: 'Processors interact with the physical world through peripheral controllers. This chapter explores memory-mapped vs I/O-mapped I/O, programmable peripheral interface (8255), programmable interrupt controller (8259), and counter/timer (8254).',
        concepts: [
          { heading: '8255 PPI Modes', body: 'Mode 0 (Basic I/O), Mode 1 (Strobed I/O with handshaking), and Mode 2 (Bi-directional bus).' },
          { heading: '8259 Interrupt Controller', body: 'Interrupt vector tables, priority resolver, and interrupt service routine (ISR) vectoring.' },
          { heading: 'DMA & ADC/DAC Interfacing', body: 'Direct Memory Access bypassing processor overhead, and analog-to-digital converter interfacing.' }
        ],
        takeaways: [
          'Configure 8255 control words for custom input/output port assignments.',
          'Explain hardware interrupt priority resolution and vector generation.',
          'Interface stepper motors, seven-segment displays, and keypads to microprocessors.'
        ]
      }
    ]
  },
  {
    filename: 'System_Software_Handbook.pdf',
    title: 'System Software: Compilers, Assemblers, Loaders & Linkers',
    subtitle: 'From Lexical Analysis & Parsing to Machine Code Translation, Relocation, Dynamic Linking & System Architecture',
    subject: 'System Software',
    author: 'Dr. Emily Richardson & Systems Software Group',
    chapters: [
      {
        title: 'Assemblers: Two-Pass Architecture & Macro Processors',
        competency: 'Assembly Translation',
        overview: 'Assemblers translate human-readable mnemonic code into machine-executable binary. This chapter explores forward reference resolution, symbol tables (SYMTAB), opcode tables (OPTAB), two-pass assemblers, and macro substitution.',
        concepts: [
          { heading: 'Pass 1 vs Pass 2 Functions', body: 'Pass 1 determines memory offsets and builds symbol tables; Pass 2 generates object machine code.' },
          { heading: 'Forward Reference Handling', body: 'Resolving label addresses defined after their first reference using backpatching or two passes.' },
          { heading: 'Macro Processors', body: 'Macro definition tables (DEFTAB), parameter tables, and recursive macro expansion.' }
        ],
        takeaways: [
          'Trace location counter (LOCCTR) advancement through sample assembly programs.',
          'Differentiate assembler directives (e.g., START, END, RESW) from executable machine instructions.',
          'Explain macro parameter substitution and conditional macro expansion.'
        ]
      },
      {
        title: 'Loaders and Linkers: Static vs Dynamic Linking & Relocation',
        competency: 'Executable Preparation',
        overview: 'Executable programs require linking and loading before execution. We analyze absolute loaders, relocating loaders, linking loaders, static versus dynamic link libraries (DLLs), and address relocation mechanics.',
        concepts: [
          { heading: 'Static vs Dynamic Linking', body: 'Embedding object modules directly into executables versus runtime resolution of shared libraries.' },
          { heading: 'Relocation Techniques', body: 'Modification records and relocation bit masks adapting absolute addresses to dynamic load addresses.' },
          { heading: 'Object File Formats', body: 'Headers, text records, modification records, and end records in standard binary object formats.' }
        ],
        takeaways: [
          'Trace linking loader passes resolving external references (EXTREF and EXTDEF).',
          'Explain how shared libraries save system RAM and disk storage.',
          'Diagnose unresolved external symbol errors during compilation pipelines.'
        ]
      },
      {
        title: 'Compiler Phases: Lexical Analysis, Parsing & Code Generation',
        competency: 'Compiler Construction',
        overview: 'Compilers bridge high-level programming languages with low-level hardware architectures. This chapter surveys compiler frontends (lexing with DFAs, context-free grammars, LL/LR parsing) and backends (three-address code, optimization, register allocation).',
        concepts: [
          { heading: 'Lexical Analysis (Scanner)', body: 'Converting character streams into tokens using regular expressions and Deterministic Finite Automata (DFA).' },
          { heading: 'Syntax Analysis (Parser)', body: 'Constructing parse trees using top-down recursive descent or bottom-up shift-reduce parsing.' },
          { heading: 'Intermediate Representation & Optimization', body: 'Generating three-address code and applying dead code elimination, constant folding, and loop invariant code motion.' }
        ],
        takeaways: [
          'Construct parse trees from context-free grammar production rules.',
          'Differentiate ambiguous grammars and resolve precedence and associativity.',
          'Explain register allocation graph coloring algorithms and machine code synthesis.'
        ]
      }
    ]
  },
  {
    filename: 'Data_Structures_Handbook.pdf',
    title: 'Data Structures & Algorithms: Design and Complexity Analysis',
    subtitle: 'Arrays, Linked Lists, Stacks, Queues, Binary Trees, Heaps, Graphs, Hashing & Asymptotic Complexity',
    subject: 'Data Structures',
    author: 'Prof. Arvind Krishnan & Algorithmic Foundations Lab',
    chapters: [
      {
        title: 'Asymptotic Analysis, Arrays & Linked Data Structures',
        competency: 'Linear Structures',
        overview: 'Choosing the right data structure directly impacts software runtime and memory footprint. This chapter covers Big-O, Big-Omega, Big-Theta notations, contiguous arrays, singly/doubly linked lists, and circular lists.',
        concepts: [
          { heading: 'Asymptotic Complexity', body: 'Characterizing worst-case, best-case, and average-case runtimes as input size approaches infinity.' },
          { heading: 'Arrays vs Linked Lists', body: 'O(1) random access vs O(n) access with O(1) pointer-based insertions without resizing.' },
          { heading: 'Doubly & Circular Lists', body: 'Bi-directional pointer traversal and continuous round-robin buffer representations.' }
        ],
        takeaways: [
          'Prove algorithmic complexity using formal mathematical limits.',
          'Implement pointer manipulation algorithms without memory leaks.',
          'Choose between contiguous memory cache locality and dynamic link node allocation.'
        ]
      },
      {
        title: 'Stacks, Queues, Recursion & Hash Tables',
        competency: 'Abstract Data Types',
        overview: 'Stacks and queues serve as fundamental abstract data structures in operating systems and parsers. We examine LIFO stack mechanics, FIFO circular queues, priority queues, and hash table collision resolution techniques.',
        concepts: [
          { heading: 'Stack Applications', body: 'Function call call-stacks, balanced parenthesis checking, and infix to postfix expression conversion.' },
          { heading: 'Circular Queues', body: 'Ring buffer implementations using modulo arithmetic preventing false queue-full conditions.' },
          { heading: 'Hash Collision Resolution', body: 'Separate chaining with linked lists versus open addressing (linear probing, quadratic probing, double hashing).' }
        ],
        takeaways: [
          'Evaluate postfix expressions using an operand stack in O(n) time.',
          'Analyze load factor effects on hash table search complexity.',
          'Differentiate priority queues implemented via arrays versus binary heaps.'
        ]
      },
      {
        title: 'Hierarchical Structures: Binary Trees, Heaps & Graph Traversal',
        competency: 'Non-Linear Structures',
        overview: 'Non-linear structures represent complex real-world relationships. This chapter covers Binary Search Trees (BST), AVL self-balancing trees, binary max/min heaps, graph representations (adjacency matrix vs list), and BFS/DFS traversal.',
        concepts: [
          { heading: 'Binary Search Trees & AVL', body: 'In-order traversal yielding sorted keys, and tree rotations maintaining O(log n) height balance.' },
          { heading: 'Binary Heaps', body: 'Complete binary tree representations stored in flat arrays satisfying heap-order invariants.' },
          { heading: 'Graph Traversals (BFS & DFS)', body: 'Queue-based Breadth-First Search for shortest paths versus stack/recursion-based Depth-First Search.' }
        ],
        takeaways: [
          'Execute single and double AVL tree rotations following node insertions.',
          'Perform heapify operations to construct heaps in linear O(n) time.',
          'Implement Dijkstra and Prim algorithms using adjacency lists and priority queues.'
        ]
      }
    ]
  },
  {
    filename: 'Computer_Architecture_and_Organization_Handbook.pdf',
    title: 'Computer Architecture & Organization: Hardware Design',
    subtitle: 'Instruction Set Architectures, ALU Design, Pipelining, Cache Memory Hierarchies & Multi-Core Systems',
    subject: 'Computer Architecture and Organization',
    author: 'Dr. Marcus Sterling & Computer Systems Institute',
    chapters: [
      {
        title: 'Instruction Set Architecture (ISA) & Data Representation',
        competency: 'ISA & Digital Logic',
        overview: 'Computer architecture defines the programmer-visible interface to hardware. This chapter studies RISC versus CISC philosophies, fixed vs variable length instruction formats, endianness, and IEEE 754 floating-point standards.',
        concepts: [
          { heading: 'RISC vs CISC Philosophies', body: 'Simple single-cycle instructions with load-store architecture versus complex multi-cycle microcoded instructions.' },
          { heading: 'Instruction Cycle', body: 'Fetch, decode, operand fetch, execute, memory access, and write-back register update sequences.' },
          { heading: 'IEEE 754 Floating-Point', body: 'Sign bit, biased exponent, and normalized fraction representation for 32-bit single precision floats.' }
        ],
        takeaways: [
          'Analyze trade-offs between hardware simplicity (RISC) and code density (CISC).',
          'Encode and decode assembly instructions into machine binary formats.',
          'Convert real numbers into IEEE 754 floating-point binary bit patterns.'
        ]
      },
      {
        title: 'Processor Pipelining, Hazards & Branch Prediction',
        competency: 'Pipelining & Hazards',
        overview: 'Pipelining increases processor instruction throughput by overlapping instruction execution stages. We analyze structural hazards, data hazards (RAW, WAR, WAW), control hazards, forwarding paths, and branch predictors.',
        concepts: [
          { heading: 'Pipelined Throughput', body: 'Achieving ideal CPI (Cycles Per Instruction) approaching 1 through classic 5-stage RISC pipelines.' },
          { heading: 'Data Hazards & Forwarding', body: 'Bypassing pipeline register stalls by routing ALU results directly to waiting pipeline stages.' },
          { heading: 'Control Hazards & Branch Prediction', body: 'Minimizing branch penalties using 2-bit saturating counter predictors and Branch Target Buffers (BTB).' }
        ],
        takeaways: [
          'Calculate speedup ratios of pipelined processors versus non-pipelined hardware.',
          'Identify Read-After-Write (RAW) data dependencies in assembly streams.',
          'Explain why out-of-order execution engines require reorder buffers (ROB).'
        ]
      },
      {
        title: 'Memory Hierarchies: Cache Mapping & Virtual Memory',
        competency: 'Memory Systems',
        overview: 'The memory hierarchy bridges the latency gap between fast CPU registers and slower main memory. We examine temporal and spatial locality, cache placement policies (direct, set-associative, fully associative), write policies, and virtual memory page tables.',
        concepts: [
          { heading: 'Cache Mapping Schemes', body: 'Tag, index, and offset address breakdown for direct mapped and N-way set associative caches.' },
          { heading: 'Cache Miss Classification', body: 'The 3 Cs: Compulsory (cold), Capacity, and Conflict misses, and replacement strategies like LRU.' },
          { heading: 'Virtual Memory & TLBs', body: 'Translating virtual addresses to physical frame addresses using multi-level page tables and Translation Lookaside Buffers.' }
        ],
        takeaways: [
          'Calculate cache hit/miss penalties and average memory access times (AMAT).',
          'Partition memory addresses into Tag, Index, and Offset fields.',
          'Explain how virtual memory enables process memory isolation and protection.'
        ]
      }
    ]
  },
  {
    filename: 'Database_Management_System_Handbook.pdf',
    title: 'Database Management Systems: Relational & Distributed Data',
    subtitle: 'Relational Algebra, SQL Optimization, Normalization (1NF to BCNF), ACID Transactions & Indexing',
    subject: 'Database Management System',
    author: 'Prof. Rajeshwari Das & Database Systems Group',
    chapters: [
      {
        title: 'Relational Model, Relational Algebra & Advanced SQL',
        competency: 'Relational Foundations',
        overview: 'Relational database systems form the foundation of enterprise data management. This chapter covers the formal relational model, relational algebra operators (select, project, join, division), and advanced SQL querying techniques.',
        concepts: [
          { heading: 'Relational Algebra Operators', body: 'Formal mathematical operations underpinning SQL query parsing and execution planning.' },
          { heading: 'Integrity Constraints', body: 'Primary keys, foreign keys, unique constraints, and referential integrity cascade actions.' },
          { heading: 'Complex SQL Queries', body: 'Correlated subqueries, window functions (ROW_NUMBER, RANK), and common table expressions (CTEs).' }
        ],
        takeaways: [
          'Translate declarative SQL queries into procedural relational algebra expressions.',
          'Enforce strict entity and referential integrity constraints across schema tables.',
          'Write optimized multi-table JOINs and analytical aggregation queries.'
        ]
      },
      {
        title: 'Database Design, Functional Dependencies & Normalization',
        competency: 'Schema Design & Normalization',
        overview: 'Good schema design minimizes data redundancy and avoids insertion, deletion, and update anomalies. We examine functional dependencies, Armstrong axioms, attribute closures, and normalization forms: 1NF, 2NF, 3NF, and Boyce-Codd (BCNF).',
        concepts: [
          { heading: 'Database Anomalies', body: 'Redundancy-induced update, insertion, and deletion anomalies in unnormalized tables.' },
          { heading: 'Functional Dependencies', body: 'Determining candidate keys by computing attribute closures with Armstrong axioms.' },
          { heading: '1NF, 2NF, 3NF & BCNF', body: 'Progressively eliminating repeating groups, partial dependencies, and transitive dependencies.' }
        ],
        takeaways: [
          'Decompose unnormalized relations into lossless, dependency-preserving BCNF schemas.',
          'Compute minimal covers and candidate keys from sets of functional dependencies.',
          'Balance normalization purity with denormalization performance considerations.'
        ]
      },
      {
        title: 'Transactions, ACID Properties, Concurrency & Indexing',
        competency: 'Transaction Processing & Indexing',
        overview: 'Enterprise databases require concurrent multi-user access while maintaining correctness. This chapter covers ACID properties, serializability, Two-Phase Locking (2PL), deadlock handling, write-ahead logging (WAL), and B+ tree indexing.',
        concepts: [
          { heading: 'ACID Guarantees', body: 'Atomicity, Consistency, Isolation, and Durability guarantees enforced by storage engines.' },
          { heading: 'Conflict Serializability & 2PL', body: 'Testing conflict serializability via precedence graphs and enforcing 2-Phase Locking.' },
          { heading: 'B+ Tree Indexing', body: 'Balanced search tree structures storing all keys in linked leaf nodes for rapid range queries.' }
        ],
        takeaways: [
          'Construct serialization graphs to verify whether concurrent schedules are conflict serializable.',
          'Explain how Write-Ahead Logging (WAL) ensures durability across unexpected system crashes.',
          'Analyze query execution plans to identify when B+ tree index scans outperform full table scans.'
        ]
      }
    ]
  },
  {
    filename: 'Environmental_Science_Sustainability_Handbook.pdf',
    title: 'Environmental Science & Global Sustainability Handbook',
    subtitle: 'Ecosystem Dynamics, Biodiversity Conservation, Climate Change, Renewable Energy & UN SDG 4 Integration',
    subject: 'Environmental Science',
    author: 'Dr. Sunita Banerjee & Environmental Policy Institute',
    chapters: [
      {
        title: 'Ecosystem Ecology, Energy Flow & Biogeochemical Cycles',
        competency: 'Ecosystem Dynamics',
        overview: 'Understanding planetary health begins with ecosystem biology. This chapter examines trophic energy transfer, 10% ecological efficiency laws, food webs, ecological succession, and carbon, nitrogen, and phosphorus biogeochemical cycles.',
        concepts: [
          { heading: 'Trophic Pyramids & Energy Flow', body: 'Unidirectional thermodynamic dissipation of energy through primary producers to apex predators.' },
          { heading: 'Biogeochemical Cycles', body: 'Global feedback loops recycling carbon, nitrogen, and phosphorus through biological and geochemical reservoirs.' },
          { heading: 'Ecological Succession', body: 'Primary and secondary succession processes culminating in mature climax community equilibrium.' }
        ],
        takeaways: [
          'Calculate energy loss across successive trophic feeding levels.',
          'Analyze anthropogenic disruptions to the global nitrogen and carbon cycles.',
          'Differentiate pioneering species from resilient climax communities.'
        ]
      },
      {
        title: 'Climate Science, Greenhouse Effect & Global Warming',
        competency: 'Climate Mechanisms',
        overview: 'Climate change represents an urgent global challenge. We analyze radiative forcing, greenhouse gas warming potentials (CO2, CH4, N2O), polar ice albedo feedbacks, ocean acidification, and international IPCC assessment models.',
        concepts: [
          { heading: 'The Enhanced Greenhouse Effect', body: 'Atmospheric trapping of terrestrial infrared radiation by elevated greenhouse gas concentrations.' },
          { heading: 'Positive Climate Feedback Loops', body: 'Permafrost thaw releasing methane and melting sea ice lowering planetary albedo.' },
          { heading: 'Ocean Acidification', body: 'Excess oceanic CO2 absorption forming carbonic acid that threatens coral reef calcification.' }
        ],
        takeaways: [
          'Explain global radiative energy balance and infrared greenhouse gas absorption.',
          'Quantify carbon footprints and greenhouse gas equivalencies (GWP).',
          'Evaluate mitigation versus adaptation strategies outlined by the IPCC.'
        ]
      },
      {
        title: 'Renewable Energy, Circular Economy & Sustainable Policy',
        competency: 'Sustainability Solutions',
        overview: 'Building an equitable future requires transitioning to clean renewable energy and circular economic practices. This chapter explores solar photovoltaics, wind energy, life-cycle carbon accounting, circular manufacturing, and UN SDG goals.',
        concepts: [
          { heading: 'Renewable Energy Technologies', body: 'Solar PV, wind turbines, hydroelectricity, and geothermal power generation mechanics.' },
          { heading: 'Circular Economy Principles', body: 'Eliminating waste through design, material recycling, and closed-loop industrial ecosystems.' },
          { heading: 'UN Sustainable Development Goals', body: 'Integrating environmental stewardship (SDG 13, 14, 15) with quality education (SDG 4).' }
        ],
        takeaways: [
          'Compare levelized cost of energy (LCOE) across renewable and fossil power generation.',
          'Conduct basic Life-Cycle Assessments (LCA) for consumer and industrial products.',
          'Formulate institutional policies that advance environmental sustainability.'
        ]
      }
    ]
  }
];

async function generateAll() {
  console.log(`Starting generation of ${BOOKS.length} official academic PDF handbooks...`);
  for (const book of BOOKS) {
    try {
      await createEducationalBook(book);
    } catch (err) {
      console.error(`Failed to generate ${book.filename}:`, err);
    }
  }
  console.log('All 10 educational PDF handbooks generated successfully!');
}

generateAll();
