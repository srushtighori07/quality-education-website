/**
 * Quality Education - Comprehensive Online Assessment & Quiz Question Bank
 * EXACTLY 6 Subjects, EXACTLY 15 Questions per Subject = TOTAL 90 Questions
 */

const QUIZ_DATA = {
  // =========================================================================
  // 1. COMPUTER NETWORKS (15 Questions)
  // =========================================================================
  networks: {
    id: 'networks',
    name: 'Computer Networks',
    subtitle: '15 High-Caliber Assessment Questions',
    questions: [
      {
        q: 'How many layers are defined in the standard ISO OSI reference model?',
        options: ['4 Layers', '5 Layers', '7 Layers', '8 Layers'],
        correct: 2,
        explanation: 'The ISO OSI (Open Systems Interconnection) reference model defines exactly 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application.'
      },
      {
        q: 'What is the bit-length of an IPv4 address compared to an IPv6 address?',
        options: ['16 bits vs 64 bits', '32 bits vs 128 bits', '64 bits vs 256 bits', '32 bits vs 64 bits'],
        correct: 1,
        explanation: 'IPv4 addresses are 32 bits long (e.g., 192.168.1.1), while IPv6 addresses are 128 bits long (represented as 8 groups of 4 hexadecimal digits).'
      },
      {
        q: 'Which protocol is responsible for reliably delivering a stream of bytes between applications using a 3-way handshake?',
        options: ['UDP', 'ICMP', 'TCP', 'IP'],
        correct: 2,
        explanation: 'TCP (Transmission Control Protocol) is connection-oriented and uses a 3-way handshake (SYN, SYN-ACK, ACK) to ensure reliable byte-stream delivery.'
      },
      {
        q: 'Which layer of the OSI model does a standard network switch operate at?',
        options: ['Layer 1 (Physical)', 'Layer 2 (Data Link)', 'Layer 3 (Network)', 'Layer 4 (Transport)'],
        correct: 1,
        explanation: 'A standard network switch operates at Layer 2 (Data Link Layer) and uses physical MAC addresses to forward frames to specific ports.'
      },
      {
        q: 'What default port number is allocated for DNS (Domain Name System) queries?',
        options: ['Port 21', 'Port 53', 'Port 80', 'Port 443'],
        correct: 1,
        explanation: 'DNS uses port 53 (primarily over UDP for standard name resolution queries, and TCP for zone transfers).'
      },
      {
        q: 'What does the CIDR notation /24 signify in IPv4 networking?',
        options: ['24 usable hosts', 'A subnet mask of 255.255.255.0 with 24 network bits', '24 router hops remaining', 'Class A network allocation'],
        correct: 1,
        explanation: '/24 indicates that the first 24 bits are dedicated to the network prefix, corresponding to the subnet mask 255.255.255.0, leaving 8 bits for 256 addresses (254 usable hosts).'
      },
      {
        q: 'Which routing algorithm builds a complete topological map of the entire network at each node using Dijkstra’s shortest path algorithm?',
        options: ['Distance Vector Algorithm', 'Link State Algorithm', 'Flooding Algorithm', 'Path Vector Protocol'],
        correct: 1,
        explanation: 'Link State routing algorithms (like OSPF) disseminate link states so every node constructs the identical complete network graph and runs Dijkstra’s algorithm.'
      },
      {
        q: 'What is the primary function of DHCP (Dynamic Host Configuration Protocol)?',
        options: ['Encrypting web traffic', 'Translating domain names to IP addresses', 'Automatically assigning IP addresses, subnet masks, and default gateways to clients', 'Filtering unauthorized incoming network packets'],
        correct: 2,
        explanation: 'DHCP dynamically and automatically assigns network configuration parameters, such as IP addresses, subnet masks, DNS servers, and gateway addresses, to client devices.'
      },
      {
        q: 'What is the standard size of a physical Ethernet MAC address?',
        options: ['32 bits (4 bytes)', '48 bits (6 bytes)', '64 bits (8 bytes)', '128 bits (16 bytes)'],
        correct: 1,
        explanation: 'A MAC address is 48 bits (6 bytes) long, typically written as 12 hexadecimal digits (e.g., 00:1A:2B:3C:4D:5E).'
      },
      {
        q: 'Which error detection code uses polynomial division of data bits by a predefined generator polynomial?',
        options: ['Simple Parity Bit', 'Two-Dimensional Parity', 'Cyclic Redundancy Check (CRC)', 'Checksum Addition'],
        correct: 2,
        explanation: 'CRC (Cyclic Redundancy Check) utilizes binary polynomial division to detect burst errors in data transmission frames.'
      },
      {
        q: 'Which protocol operates as the primary inter-domain exterior routing protocol across autonomous systems on the global Internet?',
        options: ['RIP', 'OSPF', 'BGP (Border Gateway Protocol)', 'IGRP'],
        correct: 2,
        explanation: 'BGP (Border Gateway Protocol) is the de facto Path Vector protocol used to exchange routing and reachability information between Autonomous Systems (AS) on the Internet.'
      },
      {
        q: 'In TCP congestion control, what algorithm is initialized immediately after a connection is established?',
        options: ['Fast Retransmit', 'Slow Start', 'Fast Recovery', 'Congestion Avoidance'],
        correct: 1,
        explanation: 'Slow Start begins with a small Congestion Window (cwnd) and doubles cwnd every round-trip time (RTT) until an ssthresh threshold is reached.'
      },
      {
        q: 'Why is UDP preferred over TCP for real-time video streaming and multiplayer online gaming?',
        options: ['UDP provides cryptographic encryption', 'UDP avoids retransmission delays, acknowledgment overhead, and head-of-line blocking', 'UDP guarantees packet order delivery', 'UDP uses larger packet headers than TCP'],
        correct: 1,
        explanation: 'UDP is connectionless and does not perform retransmissions or packet ordering, minimizing latency overhead for real-time applications where timely delivery is critical.'
      },
      {
        q: 'What network technique allows multiple devices on a private local network to share a single public routable IP address?',
        options: ['VLAN', 'NAT (Network Address Translation)', 'BGP Peering', 'MPLS'],
        correct: 1,
        explanation: 'NAT (Network Address Translation) and PAT (Port Address Translation) map private non-routable IP addresses to a shared public IP address using unique port numbers.'
      },
      {
        q: 'Which layer of the TCP/IP suite encapsulates data with source and destination port numbers?',
        options: ['Network Access Layer', 'Internet Layer', 'Transport Layer', 'Application Layer'],
        correct: 2,
        explanation: 'The Transport Layer (TCP and UDP) manages end-to-end communication channels and adds source and destination port headers to multiplex connections.'
      }
    ]
  },

  // =========================================================================
  // 2. PYTHON FOR DATA SCIENCE (15 Questions)
  // =========================================================================
  python: {
    id: 'python',
    name: 'Python for Data Science',
    subtitle: '15 High-Caliber Assessment Questions',
    questions: [
      {
        q: 'In NumPy, what is the primary benefit of ndarrays over standard native Python lists?',
        options: ['ndarrays can store mixed arbitrary datatypes in any element', 'Contiguous C-memory allocation enabling vectorized execution without Python loop overhead', 'ndarrays automatically save data directly to disk files', 'ndarrays have no mathematical dimension limitations'],
        correct: 1,
        explanation: 'NumPy ndarrays store homogeneous data in contiguous memory blocks, allowing compiled C-level vectorization and SIMD hardware acceleration.'
      },
      {
        q: 'In Pandas, what is the key distinction between .loc[] and .iloc[] indexing operators?',
        options: ['.loc is position-based; .iloc is label-based', '.loc is label-based; .iloc is integer-position based', '.loc only works on columns; .iloc only works on rows', '.loc mutates original data; .iloc creates a copy'],
        correct: 1,
        explanation: '.loc is strictly label-based (referencing row/column index names), whereas .iloc uses 0-based integer positions (indexing by order in memory).'
      },
      {
        q: 'Which Pandas method is utilized to fill missing NaN values with a designated value or statistical measure?',
        options: ['df.drop_na()', 'df.replace_null()', 'df.fillna()', 'df.impute()'],
        correct: 2,
        explanation: 'df.fillna() substitutes missing NaN values with specified scalars, dictionary mappings, or values computed via methods like mean or median.'
      },
      {
        q: 'In Scikit-Learn, which method computes the required transformation parameters (such as mean and variance) from the training data?',
        options: ['transform()', 'fit()', 'predict()', 'score()'],
        correct: 1,
        explanation: 'The fit() method analyzes the dataset to learn internal model parameters (e.g., mean/std for scalers, weights for estimators) without applying transformation.'
      },
      {
        q: 'What is the purpose of setting random_state in Scikit-Learn’s train_test_split()?',
        options: ['To accelerate data partitioning speed', 'To ensure reproducible splits across repeated code executions', 'To eliminate duplicate rows in training data', 'To automatically balance class distributions'],
        correct: 1,
        explanation: 'Setting random_state initializes the pseudorandom number generator with a deterministic seed, ensuring consistent train/test splits for reproducibility.'
      },
      {
        q: 'Which formula correctly describes NumPy array broadcasting when adding array A of shape (3, 1) and array B of shape (1, 4)?',
        options: ['Operation fails due to dimension mismatch', 'Resulting array has shape (3, 4)', 'Resulting array has shape (4, 3)', 'Resulting array has shape (12, 1)'],
        correct: 1,
        explanation: 'NumPy broadcasting stretches dimensions of length 1 along matching axes. Here (3, 1) and (1, 4) both expand to produce an output of shape (3, 4).'
      },
      {
        q: 'What does a high training score paired with a substantially lower validation score typically signify?',
        options: ['Underfitting (High Bias)', 'Overfitting (High Variance)', 'Optimal generalization', 'Zero data leakage'],
        correct: 1,
        explanation: 'A significant performance gap where training accuracy far outstrips validation accuracy indicates overfitting (the model memorized training noise instead of general patterns).'
      },
      {
        q: 'Which evaluation metric represents the harmonic mean of precision and recall?',
        options: ['Accuracy', 'ROC-AUC', 'F1-Score', 'Mean Absolute Error'],
        correct: 2,
        explanation: 'The F1-Score is mathematically defined as 2 * (Precision * Recall) / (Precision + Recall), balancing false positives and false negatives.'
      },
      {
        q: 'In Pandas, what paradigm is implemented by the df.groupby() operator?',
        options: ['Map-Reduce-Filter', 'Split-Apply-Combine', 'Filter-Transform-Sort', 'Batch-Execute-Collect'],
        correct: 1,
        explanation: 'Pandas groupby implements the classic Split-Apply-Combine pattern: split data into groups by key, apply a function (e.g., mean), and combine outputs into a DataFrame.'
      },
      {
        q: 'What transformation does Scikit-Learn’s StandardScaler apply to feature vectors?',
        options: ['Scales values to strictly lie between 0 and 1', 'Centers data to zero mean and scales to unit variance (standard deviation of 1)', 'Converts values into logarithmically spaced integers', 'Binarizes features above a designated threshold'],
        correct: 1,
        explanation: 'StandardScaler subtracts the sample mean and divides by standard deviation: z = (x - u) / s, resulting in zero mean and unit variance.'
      },
      {
        q: 'Which Matplotlib function is used to create a scatter plot displaying the relationship between two continuous variables?',
        options: ['plt.bar()', 'plt.hist()', 'plt.scatter()', 'plt.plot_discrete()'],
        correct: 2,
        explanation: 'plt.scatter(x, y) visualizes pairs of continuous numerical values as discrete points across Cartesian axes.'
      },
      {
        q: 'What type of machine learning task is K-Means clustering classified under?',
        options: ['Supervised Learning', 'Unsupervised Learning', 'Reinforcement Learning', 'Semi-supervised Regression'],
        correct: 1,
        explanation: 'K-Means clustering is unsupervised learning because it groups data into clusters based on geometric feature proximity without ground-truth labels.'
      },
      {
        q: 'Which Pandas operation reshapes a wide DataFrame into a long format by unpivoting columns into key-value pairs?',
        options: ['df.pivot()', 'df.melt()', 'df.stack_index()', 'df.transpose_all()'],
        correct: 1,
        explanation: 'pd.melt() unpivots a DataFrame from wide format to long format, transforming identifier variables and measured variables into key-value rows.'
      },
      {
        q: 'What is the output of the Python expression: [x**2 for x in range(5) if x % 2 != 0]?',
        options: ['[0, 1, 4, 9, 16]', '[1, 9]', '[0, 4, 16]', '[1, 3]'],
        correct: 1,
        explanation: 'For range(5) which is 0, 1, 2, 3, 4: the odd numbers are 1 and 3. Squaring them yields 1**2 = 1 and 3**2 = 9, producing [1, 9].'
      },
      {
        q: 'Which Seaborn function is ideal for visualizing the correlation matrix of multiple continuous variables as a color-coded grid?',
        options: ['sns.pairplot()', 'sns.heatmap()', 'sns.boxplot()', 'sns.violinplot()'],
        correct: 1,
        explanation: 'sns.heatmap(df.corr(), annot=True) renders a visual 2D color-coded correlation matrix highlighting linear relationships between features.'
      }
    ]
  },

  // =========================================================================
  // 3. WEB APPLICATION DEVELOPMENT (15 Questions)
  // =========================================================================
  webdev: {
    id: 'webdev',
    name: 'Web Application Development',
    subtitle: '15 High-Caliber Assessment Questions',
    questions: [
      {
        q: 'Which HTML5 semantic element is most appropriate for self-contained, independently distributable content like a blog post or news story?',
        options: ['<div>', '<section>', '<article>', '<aside>'],
        correct: 2,
        explanation: '<article> represents a complete, self-contained composition in a document intended to be independently distributable or reusable (e.g., in syndication).'
      },
      {
        q: 'In the CSS Box Model, what is the exact sequence of components radiating outwards from the core content?',
        options: ['Content -> Margin -> Border -> Padding', 'Content -> Padding -> Border -> Margin', 'Content -> Border -> Padding -> Margin', 'Margin -> Border -> Padding -> Content'],
        correct: 1,
        explanation: 'The CSS Box Model starts with the inner Content, followed by internal Padding, bounded by the Border, and enclosed by external Margin.'
      },
      {
        q: 'In CSS Flexbox, which property aligns flex items along the main axis of the flex container?',
        options: ['align-items', 'justify-content', 'align-content', 'flex-direction'],
        correct: 1,
        explanation: 'justify-content defines the alignment and distribution of space between and around flex items along the main axis.'
      },
      {
        q: 'What CSS property allows a developer to configure a two-dimensional grid layout with explicit rows and columns?',
        options: ['display: flex', 'display: grid', 'display: inline-block', 'display: table-cell'],
        correct: 1,
        explanation: 'display: grid activates the CSS Grid layout engine, providing two-dimensional layout control over simultaneous rows and columns.'
      },
      {
        q: 'How does single-threaded JavaScript execute non-blocking asynchronous operations like fetch() and setTimeout()?',
        options: ['By spawning native operating system kernel threads for each function', 'Via the Event Loop coordinating the Call Stack, Web APIs, Microtask Queue, and Callback Queue', 'By freezing browser UI rendering during network queries', 'By compiling JavaScript into parallel multi-threaded C code'],
        correct: 1,
        explanation: 'JavaScript uses an Event Loop mechanism that offloads asynchronous tasks to browser Web APIs and processes completed callbacks via queues once the call stack is clear.'
      },
      {
        q: 'Which HTTP method is specifically designed according to REST conventions to apply partial modifications to a resource?',
        options: ['PUT', 'POST', 'PATCH', 'UPDATE'],
        correct: 2,
        explanation: 'PATCH is defined in RFC 5789 for applying partial modifications to a resource, whereas PUT replaces the target resource in its entirety.'
      },
      {
        q: 'What does the HTTP 404 status code indicate to the web client?',
        options: ['The request was unauthorized', 'Internal server error occurred', 'The requested resource could not be found on the server', 'The payload exceeded maximum allowable size'],
        correct: 2,
        explanation: 'HTTP 404 Not Found indicates that the origin server did not find a current representation for the target resource.'
      },
      {
        q: 'What is a JavaScript closure?',
        options: ['A function that terminates the execution of a script', 'The combination of a function bundled together with references to its surrounding lexical environment', 'A method to close opened database connections', 'An encrypted cryptographic token stored in cookies'],
        correct: 1,
        explanation: 'A closure gives a function access to its outer (enclosing) scope from an inner function even after the outer function has closed/returned.'
      },
      {
        q: 'Which web storage mechanism persists data indefinitely until explicitly cleared by the user or web application, surviving browser restarts?',
        options: ['sessionStorage', 'localStorage', 'HTTP In-Memory Cache', 'Session Cookie with no expiry'],
        correct: 1,
        explanation: 'localStorage stores key-value pairs with no expiration time; data persists across browser restarts and tab closures until cleared.'
      },
      {
        q: 'What security vulnerability involves injecting malicious client-side executable JavaScript scripts into trusted websites viewed by other users?',
        options: ['SQL Injection (SQLi)', 'Cross-Site Scripting (XSS)', 'Cross-Site Request Forgery (CSRF)', 'Denial of Service (DoS)'],
        correct: 1,
        explanation: 'XSS (Cross-Site Scripting) occurs when untrusted input is executed as active script in a victim browser context due to lack of output encoding/sanitization.'
      },
      {
        q: 'What HTTP header allows a server to specify which origins are permitted to access its resources via browser XMLHttpRequest or Fetch?',
        options: ['Content-Security-Policy', 'Access-Control-Allow-Origin', 'X-Frame-Options', 'Strict-Transport-Security'],
        correct: 1,
        explanation: 'The Access-Control-Allow-Origin header is part of Cross-Origin Resource Sharing (CORS) specifying allowable requester origins.'
      },
      {
        q: 'What is the purpose of the HTML meta tag: <meta name="viewport" content="width=device-width, initial-scale=1.0">?',
        options: ['To set the character encoding to UTF-8', 'To configure the browser viewport to match device width for responsive layout scaling', 'To force the browser to render using desktop resolution', 'To prevent web search crawlers from indexing page contents'],
        correct: 1,
        explanation: 'The viewport meta tag instructs mobile and tablet browsers to set the viewport width equal to the device screen width, preventing unintended desktop downscaling.'
      },
      {
        q: 'Which modern JavaScript syntax provides an ergonomic alternative to chaining .then() and .catch() methods on Promises?',
        options: ['yield / generator', 'async / await', 'spawn / thread', 'defer / resolve'],
        correct: 1,
        explanation: 'async/await syntax allows asynchronous Promise-based code to be written and structured synchronously with standard try/catch error handling.'
      },
      {
        q: 'Which DOM method attaches an event handler function to a designated element without overwriting existing handlers?',
        options: ['element.setEvent()', 'element.addEventListener()', 'element.attach()', 'element.onEvent()'],
        correct: 1,
        explanation: 'addEventListener() attaches an event listener to the specified element target, allowing multiple independent handlers on the same event type.'
      },
      {
        q: 'What does CSS box-sizing: border-box do when specified on an element?',
        options: ['Adds an extra 10px border around the entire page', 'Includes padding and border within the element’s specified total width and height', 'Forces the element to clear all floating siblings', 'Removes all margin from the element'],
        correct: 1,
        explanation: 'box-sizing: border-box tells the browser to account for any border and padding in the values specified for an element’s width and height.'
      }
    ]
  },

  // =========================================================================
  // 4. PROJECT MANAGEMENT (15 Questions)
  // =========================================================================
  pm: {
    id: 'pm',
    name: 'Project Management',
    subtitle: '15 High-Caliber Assessment Questions',
    questions: [
      {
        q: 'What are the three competing core constraints of the classic Project Management Iron Triangle?',
        options: ['People, Process, Technology', 'Scope, Time, Cost', 'Strategy, Vision, Execution', 'Design, Build, Deploy'],
        correct: 1,
        explanation: 'The project management triangle illustrates that project quality is constrained by Scope (features), Time (schedule), and Cost (budget/resources).'
      },
      {
        q: 'What document officially authorizes the initiation of a project and gives the project manager authority to apply organizational resources?',
        options: ['Project Charter', 'Work Breakdown Structure', 'Risk Register', 'Sprint Backlog'],
        correct: 0,
        explanation: 'The Project Charter is formally issued by the sponsor or initiating entity to formally authorize the project existence and empower the project manager.'
      },
      {
        q: 'What core rule states that a Work Breakdown Structure (WBS) must encompass 100% of the project scope without omitting or adding work?',
        options: ['The Pareto 80/20 Rule', 'The 100% Rule', 'The Critical Chain Rule', 'The Brooks Law'],
        correct: 1,
        explanation: 'The 100% Rule states that the WBS includes 100% of the work defined by the project scope and captures all deliverables without internal overlaps.'
      },
      {
        q: 'In Critical Path Method (CPM), what characterizes an activity located directly on the Critical Path?',
        options: ['It has the highest financial cost in the project', 'It has zero total float (slack), meaning any delay will delay the overall project completion', 'It can be delayed indefinitely without consequence', 'It requires external vendor sign-off'],
        correct: 1,
        explanation: 'Activities on the critical path have zero total float; delaying any critical activity directly postpones the project completion date.'
      },
      {
        q: 'What does "Total Float" (or Total Slack) signify in project scheduling analysis?',
        options: ['The amount of money left in contingency funds', 'The amount of time an activity can be delayed without delaying the project finish date', 'The total duration of all project meetings', 'The buffer time allocated exclusively for developer vacations'],
        correct: 1,
        explanation: 'Total Float is the duration by which an activity can slip without postponing the scheduled project finish date or violating a schedule constraint.'
      },
      {
        q: 'Which of the following is a primary core value declared in the Agile Manifesto?',
        options: ['Comprehensive documentation over working software', 'Contract negotiation over customer collaboration', 'Responding to change over following a plan', 'Following processes and tools over individuals and interactions'],
        correct: 2,
        explanation: 'The Agile Manifesto values "Responding to change over following a plan", along with valuing individuals, working software, and customer collaboration.'
      },
      {
        q: 'In the Scrum framework, who is solely responsible for maximizing product value and managing the Product Backlog?',
        options: ['The Scrum Master', 'The Lead Systems Architect', 'The Product Owner', 'The Quality Assurance Director'],
        correct: 2,
        explanation: 'The Product Owner is accountable for maximizing the value of the product resulting from work of the Scrum Team and owning the Product Backlog.'
      },
      {
        q: 'What is the recommended time-box limit for a Daily Scrum (Daily Standup) meeting?',
        options: ['5 minutes', '15 minutes', '30 minutes', '45 minutes'],
        correct: 1,
        explanation: 'The Daily Scrum is strictly time-boxed to 15 minutes to inspect progress toward the Sprint Goal and adapt the Sprint Backlog.'
      },
      {
        q: 'What three-point PERT formula is traditionally used to calculate the Expected Duration (Te) of a task under uncertainty?',
        options: ['(O + M + P) / 3', '(O + 4M + P) / 6', '(O + 2M + P) / 4', '(P - O) / 6'],
        correct: 1,
        explanation: 'The beta PERT weighted average formula is Te = (Optimistic + 4 * Most_Likely + Pessimistic) / 6.'
      },
      {
        q: 'What standard format is widely adopted for writing Agile User Stories?',
        options: ['Function [Name] accepts [Input] and produces [Output]', 'As a [Role], I want [Feature], so that [Benefit]', 'Project must complete [Task] by [Date] under [Cost]', 'Issue #ID: Error in [Component]'],
        correct: 1,
        explanation: 'Agile User Stories follow: "As a [type of user], I want [an action/goal], so that [a benefit/value is achieved]".'
      },
      {
        q: 'In a RACI responsibility assignment matrix, what do the letters R, A, C, and I stand for?',
        options: ['Reviewed, Authorized, Created, Informed', 'Responsible, Accountable, Consulted, Informed', 'Resource, Action, Constraint, Impact', 'Risk, Assumption, Cost, Initiative'],
        correct: 1,
        explanation: 'RACI stands for: Responsible (does work), Accountable (approves/owns), Consulted (provides input), and Informed (kept updated).'
      },
      {
        q: 'What is "Scope Creep" in project management parlance?',
        options: ['The intentional reduction of project requirements to meet budget', 'The gradual, uncontrolled expansion of product or project scope without adjustments to time, cost, and resources', 'A defect causing code memory leaks over time', 'The process of reassigning team members to new departments'],
        correct: 1,
        explanation: 'Scope Creep refers to uncontrolled changes or continuous growth in a project’s scope that occur without corresponding increases in budget, time, or resources.'
      },
      {
        q: 'In Earned Value Management (EVM), what does a Cost Performance Index (CPI) greater than 1.0 (CPI > 1.0) indicate?',
        options: ['The project is running over budget', 'The project is performing under budget (spending less than planned for completed work)', 'The project schedule is delayed', 'The project has exceeded quality parameters'],
        correct: 1,
        explanation: 'CPI = Earned Value / Actual Cost. A CPI > 1.0 indicates cost efficiency (the project is earning more value than actual expenditure, i.e., under budget).'
      },
      {
        q: 'What Scrum event occurs at the conclusion of every Sprint for the team to inspect its processes, people, and tools, and plan improvements?',
        options: ['Sprint Planning', 'Sprint Review', 'Sprint Retrospective', 'Backlog Refinement'],
        correct: 2,
        explanation: 'The Sprint Retrospective provides a dedicated forum for the team to inspect how the last Sprint went with regards to individuals, interactions, processes, and tools.'
      },
      {
        q: 'What is the primary objective of a Project Risk Register?',
        options: ['To list daily developer working hours and overtime', 'To systematically identify, assess probability/impact, and record response strategies for project risks', 'To record all product purchasing invoices', 'To track customer complaint tickets'],
        correct: 1,
        explanation: 'A Risk Register documents identified risks, severity scoring (probability vs. impact), owners, mitigation plans, and contingency responses throughout the project life cycle.'
      }
    ]
  },

  // =========================================================================
  // 5. MICROPROCESSOR AND INTERFACING (15 Questions)
  // =========================================================================
  micro: {
    id: 'micro',
    name: 'Microprocessor and Interfacing',
    subtitle: '15 High-Caliber Assessment Questions',
    questions: [
      {
        q: 'What are the sizes of the external data bus and address bus of the Intel 8086 microprocessor?',
        options: ['8-bit data bus and 16-bit address bus', '16-bit data bus and 20-bit address bus', '32-bit data bus and 32-bit address bus', '16-bit data bus and 16-bit address bus'],
        correct: 1,
        explanation: 'The 8086 is a 16-bit microprocessor featuring a 16-bit internal/external data bus and a 20-bit address bus, enabling it to address up to 1 MB (2^20 bytes) of memory.'
      },
      {
        q: 'How is a 20-bit physical memory address computed from Segment and Offset registers in the 8086 architecture?',
        options: ['Physical Address = Segment + Offset', 'Physical Address = (Segment * 16) + Offset', 'Physical Address = (Segment * 4) + Offset', 'Physical Address = Segment * Offset'],
        correct: 1,
        explanation: 'The 8086 shifts the 16-bit Segment register value left by 4 bits (multiplies by 16 or 10H) and adds the 16-bit Offset register to generate a 20-bit physical address.'
      },
      {
        q: 'What are the two primary functional units inside the 8086 microprocessor that enable pipelined instruction execution?',
        options: ['ALU and Control Unit', 'Bus Interface Unit (BIU) and Execution Unit (EU)', 'Cache Unit and Memory Unit', 'Input Unit and Output Unit'],
        correct: 1,
        explanation: 'The 8086 divides responsibilities between the Bus Interface Unit (BIU, which fetches instructions and interfaces with the bus) and the Execution Unit (EU, which decodes and executes).'
      },
      {
        q: 'What is the capacity of the instruction prefetch queue located in the 8086 Bus Interface Unit (BIU)?',
        options: ['4 bytes', '6 bytes', '8 bytes', '16 bytes'],
        correct: 1,
        explanation: 'The 8086 BIU contains a 6-byte first-in, first-out (FIFO) instruction prefetch queue that stores instructions fetched ahead while the EU executes current instructions.'
      },
      {
        q: 'Which general-purpose register in 8086 is automatically utilized as a loop counter during LOOP instructions?',
        options: ['AX Register', 'BX Register', 'CX Register', 'DX Register'],
        correct: 2,
        explanation: 'The CX register (specifically CX or CL) acts as the dedicated hardware loop counter, automatically decremented by the LOOP instruction until reaching zero.'
      },
      {
        q: 'What addressing mode is demonstrated by the instruction: MOV AX, [BX + SI + 04H]?',
        options: ['Direct Addressing Mode', 'Register Indirect Addressing Mode', 'Based Indexed with Displacement Addressing Mode', 'Immediate Addressing Mode'],
        correct: 2,
        explanation: 'MOV AX, [BX + SI + 04H] combines a Base register (BX), an Index register (SI), and an explicit 8-bit/16-bit Displacement (04H), characterizing Based Indexed with Displacement.'
      },
      {
        q: 'In the 8086 flag register, which status flag is set (flag = 1) whenever the result of an arithmetic or logical operation is zero?',
        options: ['Carry Flag (CF)', 'Zero Flag (ZF)', 'Parity Flag (PF)', 'Auxiliary Carry Flag (AF)'],
        correct: 1,
        explanation: 'The Zero Flag (ZF) is set to 1 if the outcome of an arithmetic or comparison instruction is zero; otherwise, it is cleared to 0.'
      },
      {
        q: 'What popular peripheral IC is known as the Programmable Peripheral Interface (PPI)?',
        options: ['Intel 8259', 'Intel 8255', 'Intel 8254', 'Intel 8237'],
        correct: 1,
        explanation: 'The Intel 8255 is the Programmable Peripheral Interface (PPI) providing 24 programmable I/O pins configured across Port A, Port B, and Port C.'
      },
      {
        q: 'What is the primary role of the Intel 8259 chip when interfaced with a microprocessor?',
        options: ['DMA data transfers', 'Programmable Interrupt Controller (PIC)', 'Baud rate generation for serial UART', 'Video display generation'],
        correct: 1,
        explanation: 'The Intel 8259 is a Programmable Interrupt Controller (PIC) that manages multiple hardware interrupt requests, prioritizes them, and feeds interrupt vector addresses to the CPU.'
      },
      {
        q: 'How many operating modes does Port A of the 8255 PPI support?',
        options: ['Only 1 mode (Basic I/O)', '2 modes (Mode 0 and Mode 1)', '3 modes (Mode 0: Basic I/O, Mode 1: Strobed I/O, Mode 2: Bi-directional bus)', '4 modes including DMA burst'],
        correct: 2,
        explanation: 'Port A of the 8255 can operate in Mode 0 (Basic I/O), Mode 1 (Strobed Handshake I/O), and Mode 2 (Bi-directional Bus with handshaking on Port C).'
      },
      {
        q: 'What happens to the Stack Pointer (SP) during an 8086 PUSH AX instruction?',
        options: ['SP is incremented by 2', 'SP is decremented by 2', 'SP remains unchanged', 'SP is multiplied by 2'],
        correct: 1,
        explanation: 'The 8086 stack grows downwards towards lower memory addresses; executing PUSH decrements the Stack Pointer (SP) by 2 bytes before storing data.'
      },
      {
        q: 'What is the key functional difference between Memory-Mapped I/O and I/O-Mapped I/O (Isolated I/O)?',
        options: ['Memory-Mapped I/O requires separate IN and OUT machine instructions', 'I/O-Mapped I/O shares the same address bus space and instructions as main RAM', 'Memory-Mapped I/O treats peripheral registers as standard memory locations using MOV instructions', 'Memory-Mapped I/O can only interface with read-only devices'],
        correct: 2,
        explanation: 'In Memory-Mapped I/O, I/O devices share the memory address space and are accessed via normal memory instructions (like MOV), while I/O-Mapped uses separate IN/OUT instructions.'
      },
      {
        q: 'What peripheral IC functions as a Programmable Interval Timer / Counter containing three independent 16-bit counters?',
        options: ['Intel 8251', 'Intel 8253 / 8254', 'Intel 8279', 'Intel 8255'],
        correct: 1,
        explanation: 'The Intel 8253 / 8254 is a Programmable Interval Timer containing three independent 16-bit down-counters used for square wave generation, pulse delays, and baud clocks.'
      },
      {
        q: 'What signal does a Direct Memory Access (DMA) controller assert to request control of the system buses from the 8086 CPU?',
        options: ['INTR', 'NMI', 'HOLD', 'HLDA'],
        correct: 2,
        explanation: 'A DMA controller asserts HOLD to request bus mastery; the CPU relinquishes buses and responds with HLDA (Hold Acknowledge).'
      },
      {
        q: 'What is the highest-priority, non-maskable hardware interrupt pin on the 8086 microprocessor?',
        options: ['INTR', 'NMI', 'RESET', 'TEST'],
        correct: 1,
        explanation: 'NMI (Non-Maskable Interrupt) is a high-priority edge-triggered interrupt pin that cannot be disabled via software (CLI instruction), used for catastrophic hardware errors.'
      }
    ]
  },

  // =========================================================================
  // 6. SYSTEM SOFTWARE (15 Questions)
  // =========================================================================
  syssoft: {
    id: 'syssoft',
    name: 'System Software',
    subtitle: '15 High-Caliber Assessment Questions',
    questions: [
      {
        q: 'What is the fundamental objective of an Assembler in a software development toolchain?',
        options: ['To convert high-level C++ code directly into an executable binary', 'To translate symbolic assembly language mnemonics into machine code instructions', 'To manage operating system virtual memory page allocations', 'To execute database relational queries'],
        correct: 1,
        explanation: 'An assembler translates symbolic assembly language mnemonic statements (e.g., MOV, ADD) and operands into machine language instructions (binary).'
      },
      {
        q: 'In a traditional Two-Pass Assembler, what is the primary objective of Pass 1?',
        options: ['To generate binary machine code records', 'To build the Symbol Table (SYMTAB) and assign memory addresses to all labels', 'To link external library dependencies', 'To execute the program instructions'],
        correct: 1,
        explanation: 'Pass 1 reads the source code to determine instruction lengths, increment the Location Counter (LOCCTR), and map symbolic labels to concrete memory offsets in the Symbol Table.'
      },
      {
        q: 'What is the term for a reference to a label in source code before that label has been defined in preceding lines?',
        options: ['Backward Reference', 'Forward Reference', 'Cyclic Dependency', 'Undefined Token'],
        correct: 1,
        explanation: 'A forward reference occurs when an instruction references a label located further down in the source text, requiring two passes or backpatching to resolve.'
      },
      {
        q: 'What is the functional purpose of an assembler directive like START, END, or RESW?',
        options: ['Directives generate CPU machine opcode instructions during runtime execution', 'Directives provide instructional commands to the assembler itself without generating executable CPU opcodes', 'Directives are compiled into operating system system calls', 'Directives encrypt the source code file'],
        correct: 1,
        explanation: 'Assembler directives (pseudo-instructions) instruct the assembler on how to process code (e.g., allocating memory reservations, defining starting points) without directly producing machine instructions.'
      },
      {
        q: 'What table is maintained by an assembler to quickly look up valid mnemonic machine operation codes and their instruction formats?',
        options: ['SYMTAB (Symbol Table)', 'OPTAB (Operation Code Table)', 'DEFTAB (Definition Table)', 'LITTAB (Literal Table)'],
        correct: 1,
        explanation: 'OPTAB (Operation Code Table) is a predefined table storing valid mnemonic codes (e.g., ADD, SUB), their corresponding binary opcodes, and instruction lengths.'
      },
      {
        q: 'What is the primary operational distinction between a Linker and a Loader?',
        options: ['A Linker compiles C code; a Loader debugs Java code', 'A Linker resolves cross-module references and combines object files; a Loader places executable machine code into RAM for execution', 'A Linker manages disk formatting; a Loader runs BIOS setup', 'A Linker interprets scripts line by line; a Loader compiles bytecode'],
        correct: 1,
        explanation: 'A Linker binds independently compiled object files by resolving external symbols and addresses; a Loader takes the executable and places it into primary memory (RAM) to run.'
      },
      {
        q: 'What is the main advantage of Dynamic Linking (using shared libraries / DLLs) over Static Linking?',
        options: ['Dynamic linking guarantees zero possibility of runtime missing library errors', 'Multiple running programs share a single copy of library code in RAM and disk, saving physical memory', 'Dynamic linking produces larger self-contained standalone executable binaries', 'Dynamic linking eliminates CPU instruction decoding'],
        correct: 1,
        explanation: 'Dynamic linking allows shared libraries (.so / .dll) to reside in memory once and be shared across concurrent processes, conserving RAM and disk space.'
      },
      {
        q: 'What is the process performed by a relocating loader to adjust absolute addresses inside object code to correspond with actual loaded memory locations?',
        options: ['Tokenization', 'Program Relocation', 'Dead Code Elimination', 'Macro Expansion'],
        correct: 1,
        explanation: 'Program Relocation modifies memory-dependent addresses in object code using relocation records so the program can execute properly at whichever memory address it is loaded.'
      },
      {
        q: 'What is the very first phase in a standard compiler pipeline?',
        options: ['Syntax Analysis (Parser)', 'Lexical Analysis (Scanner)', 'Semantic Analysis', 'Intermediate Code Generation'],
        correct: 1,
        explanation: 'The first phase is Lexical Analysis (Scanning), which reads the raw character stream of source code and groups characters into meaningful atomic tokens (e.g., keywords, identifiers).'
      },
      {
        q: 'What formal mathematical computational model is commonly used by lexical analyzers to recognize regular language tokens?',
        options: ['Turing Machines', 'Deterministic Finite Automata (DFA)', 'Pushdown Automata (PDA)', 'Linear Bounded Automata'],
        correct: 1,
        explanation: 'Lexical analyzers translate Regular Expressions defining token patterns into Deterministic Finite Automata (DFA) state machines for efficient O(n) token matching.'
      },
      {
        q: 'What hierarchical data structure does a syntax analyzer (parser) produce to reflect the grammatical structure of source code?',
        options: ['Symbol Hash Map', 'Parse Tree / Abstract Syntax Tree (AST)', 'Three-Address Code Matrix', 'Control Flow Graph'],
        correct: 1,
        explanation: 'The parser verifies token sequences against Context-Free Grammar rules and constructs a Parse Tree or Abstract Syntax Tree (AST) representing the hierarchical program syntax.'
      },
      {
        q: 'Which parsing approach attempts to build the parse tree starting from the top root symbol down towards the terminal token leaves?',
        options: ['Bottom-Up Shift-Reduce Parsing', 'Top-Down Parsing (such as Recursive Descent or LL)', 'Operator Precedence Parsing', 'LR Parsing'],
        correct: 1,
        explanation: 'Top-Down parsing begins at the grammar’s start symbol and recursively predicts and expands productions downwards towards the terminal input tokens.'
      },
      {
        q: 'What intermediate representation form expresses complex expressions as linear instructions having at most one operator and three operand addresses?',
        options: ['Binary Machine Binary', 'Three-Address Code (TAC)', 'Bytecode Assembly', 'Lexical Token Stream'],
        correct: 1,
        explanation: 'Three-Address Code (TAC) decomposes complex mathematical and control expressions into linearized instructions of the general form: x = y op z.'
      },
      {
        q: 'What compiler optimization technique evaluates operations on known constants at compile time rather than generating runtime calculation instructions?',
        options: ['Loop Unrolling', 'Constant Folding', 'Dead Code Elimination', 'Register Spilling'],
        correct: 1,
        explanation: 'Constant Folding recognizes operations with compile-time constant operands (e.g., 3 + 5 * 2) and evaluates them directly into constants during compilation.'
      },
      {
        q: 'What is a compiler called that runs on one host computer architecture but generates machine code for a completely different target processor architecture?',
        options: ['Just-In-Time (JIT) Compiler', 'Cross-Compiler', 'Decompiler', 'Interpreter'],
        correct: 1,
        explanation: 'A Cross-Compiler executes on a host environment (e.g., x86_64 PC) to produce machine executable binaries for a target hardware system (e.g., ARM embedded microcontroller).'
      }
    ]
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = QUIZ_DATA;
}
