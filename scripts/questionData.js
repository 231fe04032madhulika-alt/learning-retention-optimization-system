const questionBanks = {
    // ---- PROGRAMMING LANGUAGES ----
    'C': {
        beginner: [{ q: "Which function is the entry point of a C program?", opts: ["main()", "start()", "init()", "run()"], ans: "main()" }],
        intermediate: [{ q: "Which operator is used to get the memory address of a variable in C?", opts: ["&", "*", "%", "@"], ans: "&" }],
        advanced: [{ q: "What is the result of dereferencing a NULL pointer in C?", opts: ["Undefined behavior / Segmentation fault", "It returns 0", "Compile Error", "Memory Leak"], ans: "Undefined behavior / Segmentation fault" }]
    },
    'C++': {
        beginner: [{ q: "What does STL stand for in C++?", opts: ["Standard Template Library", "System Type Library", "Standard Type Language", "Syntax Tree Logic"], ans: "Standard Template Library" }],
        intermediate: [{ q: "In C++, what is a virtual function?", opts: ["A member function expected to be redefined in derived classes.", "A function with no body.", "A function available only at runtime.", "A function that cannot be inherited."], ans: "A member function expected to be redefined in derived classes." }],
        advanced: [{ q: "What is the Diamond Problem in C++?", opts: ["Ambiguity when two classes inherit from a base class, and a fourth inherits from both", "Memory leaks in multiple allocations", "Generic syntax error", "Design pattern"], ans: "Ambiguity when two classes inherit from a base class, and a fourth inherits from both" }]
    },
    'Java': {
        beginner: [{ q: "Which keyword is used to inherit a class in Java?", opts: ["extends", "implements", "inherits", "super"], ans: "extends" }],
        intermediate: [{ q: "Which collection interface allows duplicate elements in Java?", opts: ["List", "Set", "Map", "Queue"], ans: "List" }],
        advanced: [{ q: "Which is true about Java's garbage collection?", opts: ["You can only request it via System.gc()", "Runs exactly every 10 seconds", "Manually free objects using complete()", "Guarantees no OutOfMemory errors"], ans: "You can only request it via System.gc()" }]
    },
    'Python': {
        beginner: [{ q: "How do you define a function in Python?", opts: ["def func():", "function func():", "void func():", "func = () =>"], ans: "def func():" }],
        intermediate: [{ q: "What does the 'self' keyword represent in Python classes?", opts: ["The instance of the class", "The class itself", "A private modifier", "A global variable"], ans: "The instance of the class" }],
        advanced: [{ q: "What is a decorator in Python?", opts: ["A function modifying the behavior of another function", "CSS syntax", "Comment tool", "Interface keyword"], ans: "A function modifying the behavior of another function" }]
    },
    'JavaScript': {
        beginner: [{ q: "Inside which HTML element do we put JavaScript?", opts: ["<script>", "<js>", "<javascript>", "<code>"], ans: "<script>" }],
        intermediate: [{ q: "What will 'Boolean(10 > 9)' return?", opts: ["true", "false", "NaN", "undefined"], ans: "true" }],
        advanced: [{ q: "What is a closure in JavaScript?", opts: ["A function bundled together with references to its surrounding state", "A browser closing method", "A syntax error", "New block of code"], ans: "A function bundled together with references to its surrounding state" }]
    },
    'SQL': {
        beginner: [{ q: "Which SQL statement updates data?", opts: ["UPDATE", "MODIFY", "SAVE", "INSERT"], ans: "UPDATE" }],
        intermediate: [{ q: "What does an INNER JOIN do?", opts: ["Returns records with matching values in both tables", "Returns all records from the left", "Combines tables entirely", "None of the above"], ans: "Returns records with matching values in both tables" }],
        advanced: [{ q: "What is a Common Table Expression (CTE)?", opts: ["A temporary result set created via WITH clause", "Persistent table", "Database index", "Schema map"], ans: "A temporary result set created via WITH clause" }]
    },
    'HTML': {
        beginner: [{ q: "What does HTML stand for?", opts: ["Hyper Text Markup Language", "Hyperlinks and Text Markup Language", "Home Tool Markup Language", "Hyper Tool Markup Language"], ans: "Hyper Text Markup Language" }],
        intermediate: [{ q: "Which HTML attribute specifies an alternate text for an image?", opts: ["alt", "title", "src", "href"], ans: "alt" }],
        advanced: [{ q: "What is the purpose of the <canvas> element in HTML5?", opts: ["Drawing graphics via JavaScript", "Displaying database records", "Creating 3D objects purely with HTML", "Embedding external PDFs"], ans: "Drawing graphics via JavaScript" }]
    },
    'CSS': {
        beginner: [{ q: "What does CSS stand for?", opts: ["Cascading Style Sheets", "Computer Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"], ans: "Cascading Style Sheets" }],
        intermediate: [{ q: "How do you select an element with id 'demo'?", opts: ["#demo", ".demo", "demo", "*demo"], ans: "#demo" }],
        advanced: [{ q: "What is the CSS 'box-sizing: border-box' property used for?", opts: ["Including padding and border in the element's total width and height", "Creating 3D borders", "Removing all borders", "Fixing float issues automatically"], ans: "Including padding and border in the element's total width and height" }]
    },
    'React (Basic)': {
        beginner: [{ q: "What is React primarily used for?", opts: ["Building user interfaces", "Managing databases", "Backend logic", "Networking"], ans: "Building user interfaces" }],
        intermediate: [{ q: "Which Hook allows you to have side effects in a functional component?", opts: ["useEffect", "useState", "useContext", "useReducer"], ans: "useEffect" }],
        advanced: [{ q: "When should you use useMemo?", opts: ["To memoize expensive calculations and prevent unnecessary re-computations", "To cache APIs globally", "To trigger side effects", "To parse DOM"], ans: "To memoize expensive calculations and prevent unnecessary re-computations" }]
    },
    'Node.js': {
        beginner: [{ q: "What is Node.js?", opts: ["A JavaScript runtime built on Chrome's V8 engine", "A front-end JS framework", "A relational database", "A CSS preprocessor"], ans: "A JavaScript runtime built on Chrome's V8 engine" }],
        intermediate: [{ q: "Which core module in Node.js handles file system operations?", opts: ["fs", "path", "http", "crypto"], ans: "fs" }],
        advanced: [{ q: "What is the Event Loop in Node.js?", opts: ["A mechanism allowing Node.js to perform non-blocking I/O operations", "A while loop that never terminates", "An error-handling process", "A global routing middleware"], ans: "A mechanism allowing Node.js to perform non-blocking I/O operations" }]
    },
    'Programming in C': {
        beginner: [{ q: "Which of the following is correct format specifier for integer in C?", opts: ["%d", "%f", "%c", "%s"], ans: "%d" }],
        intermediate: [{ q: "What does malloc() do in C?", opts: ["Allocates memory dynamically", "Frees memory", "Copies an array", "Clears a string"], ans: "Allocates memory dynamically" }],
        advanced: [{ q: "What does the keyword 'volatile' tell the compiler in C?", opts: ["That the variable's value may change at any time without action from the nearby code", "That it should be stored in a register", "That it can never change", "That it is purely local to the function"], ans: "That the variable's value may change at any time without action from the nearby code" }]
    },

    // ---- CORE COMPUTER SCIENCE / B.TECH ----
    'Data Structures': {
        beginner: [{ q: "Which data structure uses LIFO (Last In First Out)?", opts: ["Stack", "Queue", "Array", "Linked List"], ans: "Stack" }],
        intermediate: [{ q: "What is the average time complexity of searching in a Hash Table?", opts: ["O(1)", "O(n)", "O(log n)", "O(n log n)"], ans: "O(1)" }],
        advanced: [{ q: "Which data structure primarily implements Dijkstra's Shortest Path Algorithm efficiently?", opts: ["Priority Queue / Min-Heap", "Stack", "Unbalanced BST", "Hash Table"], ans: "Priority Queue / Min-Heap" }]
    },
    'Algorithms': {
        beginner: [{ q: "What is an algorithm?", opts: ["A step-by-step procedure for solving a problem", "A programming language", "A hardware component", "A database system"], ans: "A step-by-step procedure for solving a problem" }],
        intermediate: [{ q: "What is the worst-case time complexity of QuickSort?", opts: ["O(n^2)", "O(n log n)", "O(log n)", "O(n)"], ans: "O(n^2)" }],
        advanced: [{ q: "Which problem does Kruskal's algorithm solve?", opts: ["Finding the Minimum Spanning Tree of a graph", "Finding the shortest path", "Sorting an array", "Matrix multiplication"], ans: "Finding the Minimum Spanning Tree of a graph" }]
    },
    'Operating Systems': {
        beginner: [{ q: "What is the primary function of an OS?", opts: ["Managing hardware and software resources", "Compiling code", "Providing internet", "Web design"], ans: "Managing hardware and software resources" }],
        intermediate: [{ q: "Which OS component interacts directly with the hardware?", opts: ["Kernel", "Shell", "GUI", "Compiler"], ans: "Kernel" }],
        advanced: [{ q: "What is Thrashing in OS?", opts: ["When a computer spends more time paging than executing", "When disk spins too fast", "When programs execute efficiently", "Semaphores locking indefinitely"], ans: "When a computer spends more time paging than executing" }]
    },
    'Database Management Systems': {
        beginner: [{ q: "What does DBMS stand for?", opts: ["Database Management System", "Data Basic Memory Storage", "Database Machine System", "Digital Backup Memory System"], ans: "Database Management System" }],
        intermediate: [{ q: "What does ACID stand for in databases?", opts: ["Atomicity, Consistency, Isolation, Durability", "Accuracy, Continuity, Integrity, Dependency", "Association, Centralization, Interpretation, Data", "Addition, Calculation, Insertion, Deletion"], ans: "Atomicity, Consistency, Isolation, Durability" }],
        advanced: [{ q: "What is two-phase locking (2PL) used for?", opts: ["To ensure serializability in concurrent transactions", "To encrypt a database twice", "To prevent server restarts", "To map indexes"], ans: "To ensure serializability in concurrent transactions" }]
    },
    'Computer Networks': {
        beginner: [{ q: "What does LAN stand for?", opts: ["Local Area Network", "Large Area Network", "Logical Access Node", "Linked Array Network"], ans: "Local Area Network" }],
        intermediate: [{ q: "At which OSI layer does an IP router function?", opts: ["Network Layer", "Data Link Layer", "Physical Layer", "Application Layer"], ans: "Network Layer" }],
        advanced: [{ q: "What is the difference between TCP and UDP?", opts: ["TCP is connection-oriented and reliable, UDP is connectionless and fast", "TCP is for local routing, UDP is global", "TCP only works on wired networks", "There is no functional difference"], ans: "TCP is connection-oriented and reliable, UDP is connectionless and fast" }]
    },
    'Software Engineering': {
        beginner: [{ q: "What does SDLC stand for?", opts: ["Software Development Life Cycle", "System Design Life Cycle", "Standard Deployment Logical Code", "Software Data Loading Code"], ans: "Software Development Life Cycle" }],
        intermediate: [{ q: "What is Agile methodology primarily focused on?", opts: ["Iterative development and rapid adaptation to change", "Strict sequential phases like Waterfall", "Writing no documentation", "Only utilizing Java"], ans: "Iterative development and rapid adaptation to change" }],
        advanced: [{ q: "What is the purpose of the 'Facade' design pattern?", opts: ["To provide a unified interface to a set of interfaces in a subsystem", "To inject dependencies at runtime", "To observe state changes", "To restrict an object to a single instance"], ans: "To provide a unified interface to a set of interfaces in a subsystem" }]
    },
    'Machine Learning': {
        beginner: [{ q: "What is the goal of Machine Learning?", opts: ["Allowing computers to learn from data without explicit programming", "Ensuring systems crash less", "Parsing HTML faster", "Generating random variables"], ans: "Allowing computers to learn from data without explicit programming" }],
        intermediate: [{ q: "What is an epoch in ML training?", opts: ["One complete pass of the training dataset through the algorithm", "A single prediction", "The final output classification", "The initial data loading phase"], ans: "One complete pass of the training dataset through the algorithm" }],
        advanced: [{ q: "What does regularization (like L1 or L2) aim to prevent?", opts: ["Overfitting", "Underfitting", "Data corruption", "Memory leaks"], ans: "Overfitting" }]
    },
    'Artificial Intelligence': {
        beginner: [{ q: "What is the Turing Test designed to check?", opts: ["A machine's ability to exhibit intelligent behavior indistinguishable from a human", "CPU execution speed", "Hard drive capacity", "Bandwidth"], ans: "A machine's ability to exhibit intelligent behavior indistinguishable from a human" }],
        intermediate: [{ q: "What does NLP stand for?", opts: ["Natural Language Processing", "Neural Logic Protocol", "Network Learning Procedure", "Node Logical Parsing"], ans: "Natural Language Processing" }],
        advanced: [{ q: "What is a Generative Adversarial Network (GAN) comprised of?", opts: ["A Generator and Discriminator competing against each other", "A single massive neural node", "An interface handling inputs", "Heuristic trees voting"], ans: "A Generator and Discriminator competing against each other" }]
    },
    'Computer Basics': {
        beginner: [{ q: "What does CPU stand for?", opts: ["Central Processing Unit", "Computer Personal Unit", "Central Process Utility", "Central Placement Unit"], ans: "Central Processing Unit" }],
        intermediate: [{ q: "Which component stores local data temporarily for fast RAM access?", opts: ["Cache", "Hard Drive", "SSD", "ROM"], ans: "Cache" }],
        advanced: [{ q: "What determines exactly how a processor reads instructions?", opts: ["Instruction Set Architecture (ISA)", "The OS", "The Motherboard Size", "The System Clock alone"], ans: "Instruction Set Architecture (ISA)" }]
    },

    // ---- GENERAL SCHOOL / INTERMEDIATE CORE ----
    'Mathematics': {
        beginner: [{ q: "What is the value of Pi to two decimal places?", opts: ["3.14", "3.16", "3.12", "3.18"], ans: "3.14" }],
        intermediate: [{ q: "What is the formula for the area of a circle?", opts: ["πr²", "2πr", "πd", "r²"], ans: "πr²" }],
        advanced: [{ q: "What is the derivative of x²?", opts: ["2x", "x", "x²", "2"], ans: "2x" }]
    },
    'Physics': {
        beginner: [{ q: "What is the standard unit of force?", opts: ["Newton", "Joule", "Watt", "Pascal"], ans: "Newton" }],
        intermediate: [{ q: "What does Ohm's Law state?", opts: ["V = IR", "F = ma", "E = mc²", "P = IV"], ans: "V = IR" }],
        advanced: [{ q: "According to quantum mechanics, what principle asserts that you cannot simultaneously know the exact position and momentum of a particle?", opts: ["Heisenberg Uncertainty Principle", "Pauli Exclusion Principle", "Bohr Model", "Schrödinger's Cat Paradox"], ans: "Heisenberg Uncertainty Principle" }]
    },
    'Chemistry': {
        beginner: [{ q: "What is the chemical symbol for Water?", opts: ["H2O", "O2", "CO2", "HO"], ans: "H2O" }],
        intermediate: [{ q: "What type of bond involves sharing electron pairs between atoms?", opts: ["Covalent bond", "Ionic bond", "Metallic bond", "Hydrogen bond"], ans: "Covalent bond" }],
        advanced: [{ q: "What is Avogadro's number?", opts: ["6.022 × 10^23", "3.14159", "2.99 × 10^8", "6.626 × 10^-34"], ans: "6.022 × 10^23" }]
    },
    'Biology': {
        beginner: [{ q: "What is the powerhouse of the cell?", opts: ["Mitochondria", "Nucleus", "Ribosome", "Endoplasmic Reticulum"], ans: "Mitochondria" }],
        intermediate: [{ q: "What is the process by which plants make their own food?", opts: ["Photosynthesis", "Respiration", "Transcription", "Digestion"], ans: "Photosynthesis" }],
        advanced: [{ q: "Which enzyme is responsible for unzipping the DNA double helix during replication?", opts: ["Helicase", "Polymerase", "Ligase", "Primase"], ans: "Helicase" }]
    },
    'Biology (Botany + Zoology)': {
        beginner: [{ q: "What is the powerhouse of the cell?", opts: ["Mitochondria", "Nucleus", "Ribosome", "Endoplasmic Reticulum"], ans: "Mitochondria" }],
        intermediate: [{ q: "What is the basic functional unit of life?", opts: ["The Cell", "The Molecule", "The Atom", "The Tissue"], ans: "The Cell" }],
        advanced: [{ q: "What is the primary distinction between mitosis and meiosis?", opts: ["Mitosis results in diploid identical cells, meiosis results in haploid sex cells", "Meiosis happens in plants, mitosis in animals", "Mitosis is viral, meiosis is bacterial", "There is no functional distinction"], ans: "Mitosis results in diploid identical cells, meiosis results in haploid sex cells" }]
    },
    'Science': {
        beginner: [{ q: "Which planet is known as the Red Planet?", opts: ["Mars", "Jupiter", "Venus", "Saturn"], ans: "Mars" }],
        intermediate: [{ q: "At what temperature Celsius does water freeze?", opts: ["0", "32", "100", "-10"], ans: "0" }],
        advanced: [{ q: "What gas primarily makes up the Earth's atmosphere?", opts: ["Nitrogen", "Oxygen", "Carbon Dioxide", "Helium"], ans: "Nitrogen" }]
    },
    'English': {
        beginner: [{ q: "Which of the following is a noun?", opts: ["Apple", "Run", "Quickly", "Beautiful"], ans: "Apple" }],
        intermediate: [{ q: "What is a synonym for 'Happy'?", opts: ["Joyful", "Sad", "Angry", "Tired"], ans: "Joyful" }],
        advanced: [{ q: "Identify the figure of speech: 'The wind howled in the night.'", opts: ["Personification", "Simile", "Metaphor", "Hyperbole"], ans: "Personification" }]
    },
    'Hindi': {
        beginner: [{ q: "What is the Hindi word for 'Water'?", opts: ["Paani", "Aag", "Hawa", "Dharti"], ans: "Paani" }],
        intermediate: [{ q: "How many vowels (Swar) are there in the standard Hindi alphabet?", opts: ["11", "26", "33", "5"], ans: "11" }],
        advanced: [{ q: "Which famous Hindi poet wrote 'Madhushala'?", opts: ["Harivansh Rai Bachchan", "Kabir", "Tulsidas", "Munshi Premchand"], ans: "Harivansh Rai Bachchan" }]
    },
    'Telugu (or Regional Language)': {
        beginner: [{ q: "What is the Telugu word for 'Mother'?", opts: ["Amma", "Nanna", "Thammudu", "Akka"], ans: "Amma" }],
        intermediate: [{ q: "How many letters are originally in the Telugu alphabet?", opts: ["56", "26", "48", "33"], ans: "56" }],
        advanced: [{ q: "Who is known as the 'Adikavi' of Telugu literature?", opts: ["Nannaya", "Tikkana", "Bammera Pothana", "Vemana"], ans: "Nannaya" }]
    },
    'Social Studies': {
        beginner: [{ q: "Who is known as the Father of the Nation in India?", opts: ["Mahatma Gandhi", "Jawaharlal Nehru", "Bhagat Singh", "Subhas Chandra Bose"], ans: "Mahatma Gandhi" }],
        intermediate: [{ q: "What are the three branches of most democratic governments?", opts: ["Executive, Legislative, Judicial", "Military, Police, Citizens", "Federal, State, Local", "Capitalist, Socialist, Communist"], ans: "Executive, Legislative, Judicial" }],
        advanced: [{ q: "What year did the French Revolution begin?", opts: ["1789", "1812", "1654", "1901"], ans: "1789" }]
    },
    'History': {
        beginner: [{ q: "Who was the first President of the United States?", opts: ["George Washington", "Abraham Lincoln", "Thomas Jefferson", "John Adams"], ans: "George Washington" }],
        intermediate: [{ q: "In which year did World War II end?", opts: ["1945", "1939", "1918", "1965"], ans: "1945" }],
        advanced: [{ q: "The ancient city of Rome was allegedly founded in what year?", opts: ["753 BC", "476 AD", "100 BC", "1 AD"], ans: "753 BC" }]
    },
    'Geography': {
        beginner: [{ q: "What is the largest ocean on Earth?", opts: ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean"], ans: "Pacific Ocean" }],
        intermediate: [{ q: "Which imaginary line divides the Earth into Northern and Southern Hemispheres?", opts: ["The Equator", "Prime Meridian", "Tropic of Cancer", "Tropic of Capricorn"], ans: "The Equator" }],
        advanced: [{ q: "What is an oxbow lake?", opts: ["A U-shaped lake formed when a wide meander is cut off from a river", "A lake formed inside a volcanic crater", "A man-made reservoir", "A glacial melt lake"], ans: "A U-shaped lake formed when a wide meander is cut off from a river" }]
    },
    'Civics': {
        beginner: [{ q: "What document represents the supreme law of a democratic country?", opts: ["The Constitution", "The Bible", "The Bill of Rights", "The Dictionary"], ans: "The Constitution" }],
        intermediate: [{ q: "What is the minimum voting age in a typical democratic nation (like India or USA)?", opts: ["18", "21", "16", "25"], ans: "18" }],
        advanced: [{ q: "What does 'Habeas Corpus' literally translate to?", opts: ["You shall have the body", "Let the decision stand", "In good faith", "By the fact itself"], ans: "You shall have the body" }]
    },
    'General Knowledge': {
        beginner: [{ q: "How many continents are there on Earth?", opts: ["7", "5", "6", "8"], ans: "7" }],
        intermediate: [{ q: "Which element has the chemical symbol 'Au'?", opts: ["Gold", "Silver", "Argon", "Aluminum"], ans: "Gold" }],
        advanced: [{ q: "Who authored the book 'A Brief History of Time'?", opts: ["Stephen Hawking", "Albert Einstein", "Isaac Newton", "Carl Sagan"], ans: "Stephen Hawking" }]
    },

    // ---- COMMERCE & MANAGEMENT ----
    'Economics': {
        beginner: [{ q: "What is the basic economic problem?", opts: ["Scarcity", "Too much money", "No supply", "No demand"], ans: "Scarcity" }],
        intermediate: [{ q: "What does GDP stand for?", opts: ["Gross Domestic Product", "Global Domestic Product", "Gross Decreasing Price", "General Domestic Principle"], ans: "Gross Domestic Product" }],
        advanced: [{ q: "What is the Phillips Curve generally used to illustrate?", opts: ["The inverse relationship between unemployment and inflation", "The direct relationship between supply and demand", "The cost of taxation", "The curve of population growth"], ans: "The inverse relationship between unemployment and inflation" }]
    },
    'Commerce': {
        beginner: [{ q: "What is commerce primarily concerned with?", opts: ["The buying and selling of goods and services", "Producing goods in factories", "Farming", "Programming software"], ans: "The buying and selling of goods and services" }],
        intermediate: [{ q: "What is a 'balance sheet'?", opts: ["A financial statement showing assets, liabilities, and equity at a specific point in time", "A list of employee salaries", "A register of daily sales", "A taxation form"], ans: "A financial statement showing assets, liabilities, and equity at a specific point in time" }],
        advanced: [{ q: "What term describes the cost of capital in a business evaluation model?", opts: ["WACC (Weighted Average Cost of Capital)", "EBITDA", "Net Present Value", "Depreciation Margin"], ans: "WACC (Weighted Average Cost of Capital)" }]
    },
    'Accounting': {
        beginner: [{ q: "What is an asset?", opts: ["Something of value owned by a business", "Money owed to suppliers", "An expense", "A tax"], ans: "Something of value owned by a business" }],
        intermediate: [{ q: "In double-entry bookkeeping, what must every entry have?", opts: ["A corresponding and equal credit and debit", "A cash equivalent", "A manager's signature", "A bank statement attached"], ans: "A corresponding and equal credit and debit" }],
        advanced: [{ q: "What does GAAP stand for in accounting?", opts: ["Generally Accepted Accounting Principles", "General Accounting Audit Practices", "Global Association of Accounting Professionals", "Gross Average Asset Prices"], ans: "Generally Accepted Accounting Principles" }]
    },
    'Mathematics / Statistics': {
        beginner: [{ q: "What is the mean of the numbers 2, 4, 6?", opts: ["4", "12", "6", "2"], ans: "4" }],
        intermediate: [{ q: "What does standard deviation measure?", opts: ["The amount of variation or dispersion of a set of values", "The sum of all values", "The median value", "The probability of an error"], ans: "The amount of variation or dispersion of a set of values" }],
        advanced: [{ q: "What is a Type II error in hypothesis testing?", opts: ["Failing to reject a false null hypothesis (False Negative)", "Rejecting a true null hypothesis (False Positive)", "A calculation error", "Dividing by zero"], ans: "Failing to reject a false null hypothesis (False Negative)" }]
    },
    'Management Principles': {
        beginner: [{ q: "Who is known as the father of modern management theory?", opts: ["Henri Fayol", "Frederick Taylor", "Adam Smith", "Karl Marx"], ans: "Henri Fayol" }],
        intermediate: [{ q: "What does SWOT analysis stand for?", opts: ["Strengths, Weaknesses, Opportunities, Threats", "Sales, Wages, Offerings, Taxes", "Systems, Workflows, Output, Turnover", "Staff, Wages, Outcomes, Targets"], ans: "Strengths, Weaknesses, Opportunities, Threats" }],
        advanced: [{ q: "What is entirely unique to the 'Matrix Organizational Structure'?", opts: ["Employees have dual reporting relationships - typically to both a functional manager and a product manager", "There is no hierarchy at all", "Only one manager directs everybody", "All management is outsourced"], ans: "Employees have dual reporting relationships - typically to both a functional manager and a product manager" }]
    },
    'Marketing': {
        beginner: [{ q: "What are the core '4 Ps' of the marketing mix?", opts: ["Product, Price, Place, Promotion", "Package, Position, Pitch, Proof", "People, Property, Profit, Principle", "Post, Publish, PR, Profit"], ans: "Product, Price, Place, Promotion" }],
        intermediate: [{ q: "What is market segmentation?", opts: ["Dividing a broad target market into subsets of consumers who have common needs", "Lowering prices competitively", "Increasing product distribution globally", "Firing the sales staff"], ans: "Dividing a broad target market into subsets of consumers who have common needs" }],
        advanced: [{ q: "What does 'CAC' represent in growth marketing?", opts: ["Customer Acquisition Cost", "Capital Annual Conversion", "Consumer Awareness Campaign", "Cost After Conversion"], ans: "Customer Acquisition Cost" }]
    },
    'Human Resource Management': {
        beginner: [{ q: "What is HRM primarily focused on?", opts: ["Managing people within an organization", "Managing finances", "Managing hardware", "Managing external clients"], ans: "Managing people within an organization" }],
        intermediate: [{ q: "What is the purpose of an onboarding process?", opts: ["To integrate new employees into the organization and its culture", "To fire employees legally", "To file annual taxes", "To evaluate CEO performance"], ans: "To integrate new employees into the organization and its culture" }],
        advanced: [{ q: "What does a 360-degree feedback evaluation entail?", opts: ["Receiving performance feedback from subordinates, peers, and supervisors as well as a self-evaluation", "A single supervisor rating an employee annually", "Only receiving feedback from external clients", "An entirely automated test rating system"], ans: "Receiving performance feedback from subordinates, peers, and supervisors as well as a self-evaluation" }]
    },
    'Finance': {
        beginner: [{ q: "What is a stock?", opts: ["A type of security that signifies proportionate ownership in the issuing corporation", "A loan to a bank", "The physical goods stored in a warehouse", "A government bond"], ans: "A type of security that signifies proportionate ownership in the issuing corporation" }],
        intermediate: [{ q: "What is liquidity in finance?", opts: ["The ease with which an asset can be converted into cash without affecting its market price", "The total amount of debt an entity carries", "The water rating of real estate", "The interest rate on a loan"], ans: "The ease with which an asset can be converted into cash without affecting its market price" }],
        advanced: [{ q: "According to the Capital Asset Pricing Model (CAPM), what does 'Beta' measure?", opts: ["The volatility of an asset or portfolio in relation to the overall market", "The absolute risk-free rate of return", "The total dividend payout ratio", "The maturity date of a bond"], ans: "The volatility of an asset or portfolio in relation to the overall market" }]
    },
    'Business Communication': {
        beginner: [{ q: "What is the most formal written business communication method typically used?", opts: ["A Business Letter or Memo", "A text message", "A social media post", "A voicemail message"], ans: "A Business Letter or Memo" }],
        intermediate: [{ q: "What is 'active listening'?", opts: ["Fully concentrating, understanding, responding, and remembering what is being said", "Listening while multi-tasking", "Just waiting for your turn to speak", "Listening to a recording after the meeting"], ans: "Fully concentrating, understanding, responding, and remembering what is being said" }],
        advanced: [{ q: "What refers to the nonverbal cues like body language, posture, and facial expressions in a negotiation?", opts: ["Kinesics", "Semantics", "Syntax", "Proxemics"], ans: "Kinesics" }]
    },
    'Business Law': {
        beginner: [{ q: "What is a contract in business law?", opts: ["A legally binding agreement between two or more parties", "A suggestion made by an employer", "A handbook detailing company policies", "An unwritten promise"], ans: "A legally binding agreement between two or more parties" }],
        intermediate: [{ q: "What is a breach of contract?", opts: ["Failing to perform any term of a contract without a legitimate legal excuse", "Negotiating a better deal later", "Signing a contract with blue ink", "Canceling the contract before it is signed"], ans: "Failing to perform any term of a contract without a legitimate legal excuse" }],
        advanced: [{ q: "Under Corporate Law, what is 'the corporate veil'?", opts: ["A legal concept separating the actions/liabilities of a corporation from its shareholders", "The physical security system at a corporate headquarters", "Tax exemptions granted to large businesses", "The NDA signed by employees"], ans: "A legal concept separating the actions/liabilities of a corporation from its shareholders" }]
    },
    'Taxation': {
        beginner: [{ q: "What is Income Tax?", opts: ["A tax imposed on individuals or entities that varies with their respective income or profits", "A tax on buying groceries", "A fee paid to use roads", "A local tax on property only"], ans: "A tax imposed on individuals or entities that varies with their respective income or profits" }],
        intermediate: [{ q: "In the context of taxation, what is VAT?", opts: ["Value Added Tax", "Variable Asset Taxation", "Voluntary Accounting Trust", "Volume Average Tax"], ans: "Value Added Tax" }],
        advanced: [{ q: "What is the difference between tax avoidance and tax evasion?", opts: ["Tax avoidance is legal optimization; tax evasion is illegal concealment of income", "They are exactly the same concept", "Evading is legal, avoiding is illegal", "Evasion applies only to corporations, avoidance only to citizens"], ans: "Tax avoidance is legal optimization; tax evasion is illegal concealment of income" }]
    },

    // ---- ENGINEERING DIPLOMA / CORE (MECHANICAL, CIVIL, ELEC) ----
    'Engineering Mathematics': {
        beginner: [{ q: "What is a matrix?", opts: ["A rectangular array of numbers or expressions", "A single scalar value", "A geometric shape", "An integration variable"], ans: "A rectangular array of numbers or expressions" }],
        intermediate: [{ q: "What Laplace transform is generally used for?", opts: ["Solving differential equations by converting them to algebraic ones", "Basic addition", "Graphing statistical curves", "Optimizing compiler loops"], ans: "Solving differential equations by converting them to algebraic ones" }],
        advanced: [{ q: "According to Stokes' Theorem, what does it relate?", opts: ["The surface integral of the curl of a vector field to the line integral of the vector field around the boundary", "Mass to energy", "Voltage to current", "Temperature to volume"], ans: "The surface integral of the curl of a vector field to the line integral of the vector field around the boundary" }]
    },
    'Engineering Physics': {
        beginner: [{ q: "What is the speed of light in a vacuum?", opts: ["~3 x 10^8 m/s", "~3 x 10^5 m/s", "~1 x 10^9 m/s", "Instantaneous"], ans: "~3 x 10^8 m/s" }],
        intermediate: [{ q: "What does a semiconductor's conductivity depend on primarily?", opts: ["Temperature and impurities (doping)", "Its physical size", "The pressure around it", "Magnetic fields exclusively"], ans: "Temperature and impurities (doping)" }],
        advanced: [{ q: "In quantum mechanics, what is the wave-function squared (|Ψ|²) proportional to?", opts: ["The probability density of finding a particle at a given point", "The exact kinetic energy", "The gravitational pull", "The frequency of light emitted"], ans: "The probability density of finding a particle at a given point" }]
    },
    'Engineering Chemistry': {
        beginner: [{ q: "What is arguably the most common solvent known as the 'universal solvent'?", opts: ["Water", "Ethanol", "Acetone", "Benzene"], ans: "Water" }],
        intermediate: [{ q: "What is an alloy?", opts: ["A mixture of two or more elements, where at least one is a metal", "A pure elemental crystal", "A radioactive isotope", "A type of polymer plastic"], ans: "A mixture of two or more elements, where at least one is a metal" }],
        advanced: [{ q: "In corrosion engineering, what does a 'sacrificial anode' do?", opts: ["It deliberately corrodes to protect a more valuable connected metal object", "It prevents all moisture from entering", "It acts as an insulator entirely", "It neutralizes acids automatically"], ans: "It deliberately corrodes to protect a more valuable connected metal object" }]
    },
    'Basic Electrical Engineering': {
        beginner: [{ q: "What unit is electrical resistance measured in?", opts: ["Ohms", "Volts", "Amperes", "Watts"], ans: "Ohms" }],
        intermediate: [{ q: "What is the difference between AC and DC?", opts: ["AC constantly changes direction, DC flows in one direction", "AC is low voltage, DC is high voltage", "AC is used only in batteries", "There is no difference"], ans: "AC constantly changes direction, DC flows in one direction" }],
        advanced: [{ q: "What does Kirchhoff's Voltage Law (KVL) state?", opts: ["The directed sum of the electrical potential differences around any closed network is zero", "Current entering a node equals current leaving", "Resistance increases with temperature", "Power equals voltage times current squared"], ans: "The directed sum of the electrical potential differences around any closed network is zero" }]
    },
    'Engineering Drawing': {
        beginner: [{ q: "What tool is primarily used to draw perfect circles mechanically?", opts: ["Compass", "T-Square", "Set Square", "Protractor"], ans: "Compass" }],
        intermediate: [{ q: "What is an orthographic projection?", opts: ["A method representing 3D objects in 2D by projecting parallel lines to the plane", "A colorful 3D rendering", "A random sketch", "A projection using extreme perspective distortion"], ans: "A method representing 3D objects in 2D by projecting parallel lines to the plane" }],
        advanced: [{ q: "In first-angle projection, where is the object placed?", opts: ["Between the observer and the projection plane", "Behind the projection plane", "Directly on the observer's eyes", "In a virtual isometric space"], ans: "Between the observer and the projection plane" }]
    },
    'Engineering Mechanics': {
        beginner: [{ q: "What is the study of bodies at rest called?", opts: ["Statics", "Dynamics", "Kinematics", "Fluids"], ans: "Statics" }],
        intermediate: [{ q: "What is the moment of a force?", opts: ["A measure of its tendency to cause a body to rotate about a specific point or axis", "The exact time the force is applied", "The kinetic energy output", "The friction coefficient"], ans: "A measure of its tendency to cause a body to rotate about a specific point or axis" }],
        advanced: [{ q: "What is D'Alembert's Principle?", opts: ["It reduces a problem of dynamics to an equivalent problem in statics by adding an 'inertial force'", "It states energy is never lost", "It guarantees perfect elasticity", "It balances thermodynamics with mechanics"], ans: "It reduces a problem of dynamics to an equivalent problem in statics by adding an 'inertial force'" }]
    },
    'Thermodynamics': {
        beginner: [{ q: "What is the First Law of Thermodynamics based on?", opts: ["The principle of conservation of energy", "The speed of light", "The law of gravity", "Thermal expansion"], ans: "The principle of conservation of energy" }],
        intermediate: [{ q: "What is 'entropy'?", opts: ["A measure of the disorder or randomness of a system", "The absolute heat of a system", "The kinetic energy of liquid", "The pressure applied in a vacuum"], ans: "A measure of the disorder or randomness of a system" }],
        advanced: [{ q: "What does the Carnot Cycle represent?", opts: ["The most efficient theoretical heat engine operating between two temperatures", "A practical combustion engine scheme", "The exact function of modern refrigerators", "A cycle predicting atomic decay"], ans: "The most efficient theoretical heat engine operating between two temperatures" }]
    },
    'Fluid Mechanics': {
        beginner: [{ q: "What describes a fluid?", opts: ["A substance that continuously deforms under an applied shear stress", "Any solid that can bend", "Only water", "Anything that is invisible"], ans: "A substance that continuously deforms under an applied shear stress" }],
        intermediate: [{ q: "What does Bernoulli's principle state for an incompressible fluid?", opts: ["An increase in the speed of the fluid occurs simultaneously with a decrease in pressure", "Speed and pressure increase together always", "Fluid will pool at the lowest potential", "Temperature dictates fluid velocity"], ans: "An increase in the speed of the fluid occurs simultaneously with a decrease in pressure" }],
        advanced: [{ q: "What distinguishes a Newtonian fluid conceptually?", opts: ["The viscous stresses that arise from its flow are linearly proportional to the local strain rate", "It has absolutely infinite viscosity", "It cannot be boiled", "Its viscosity decreases exponentially with applied stress"], ans: "The viscous stresses that arise from its flow are linearly proportional to the local strain rate" }]
    },
    'Manufacturing Technology': {
        beginner: [{ q: "What is casting in manufacturing?", opts: ["Pouring liquid material into a mold containing a hollow cavity of the desired shape", "Cutting metal with lasers", "Forging metal by hammering", "3D Printing entirely"], ans: "Pouring liquid material into a mold containing a hollow cavity of the desired shape" }],
        intermediate: [{ q: "What does CNC stand for in machining?", opts: ["Computer Numerical Control", "Central Network Casting", "Custom Node Computing", "Cast Numerical Circuit"], ans: "Computer Numerical Control" }],
        advanced: [{ q: "In metal cutting, what is a Built-Up Edge (BUE)?", opts: ["Accumulation of material against the rake face of the cutting tool, negatively impacting finish", "The sharpest part of the tool", "A protective coating applied in manufacturing", "A new laser technology cutting method"], ans: "Accumulation of material against the rake face of the cutting tool, negatively impacting finish" }]
    },
    'Strength of Materials': {
        beginner: [{ q: "What is 'stress' in physical materials?", opts: ["Force applied per unit area", "The total weight of an object", "The physical length of a beam", "The temperature limit"], ans: "Force applied per unit area" }],
        intermediate: [{ q: "What does Hooke's Law state?", opts: ["Stress is directly proportional to strain within the elastic limit", "Materials will never break under compression", "Force is mass times acceleration", "Gases expand when heated"], ans: "Stress is directly proportional to strain within the elastic limit" }],
        advanced: [{ q: "What represents the 'yield strength' of a material on a stress-strain curve?", opts: ["The stress at which a material begins to deform plastically", "The point where the material physically fractures entirely", "The starting neutral state", "The absolute maximum stress the material can take before failing later"], ans: "The stress at which a material begins to deform plastically" }]
    },
    'Machine Design': {
        beginner: [{ q: "What is a major factor of safety generally used for?", opts: ["To account for uncertainties in strength, loading, and material faults to prevent failure", "To increase aesthetic appeal", "To lower the cost of manufacturing", "Because older machines looked better"], ans: "To account for uncertainties in strength, loading, and material faults to prevent failure" }],
        intermediate: [{ q: "What is usually the primary mode of failure for a long, slender column?", opts: ["Buckling", "Tension yielding", "Direct shearing", "Thermal melting"], ans: "Buckling" }],
        advanced: [{ q: "What does Miner's Rule calculate in machine design?", opts: ["Cumulative fatigue damage subjected to variable amplitude loading", "The exact thermal expansion coefficient", "The hardness of steel alloys", "The absolute rotational limit of gears"], ans: "Cumulative fatigue damage subjected to variable amplitude loading" }]
    },
    'Heat Transfer': {
        beginner: [{ q: "Which mode of heat transfer occurs through empty space (vacuum)?", opts: ["Radiation", "Conduction", "Convection", "Insulation"], ans: "Radiation" }],
        intermediate: [{ q: "What governs heat conduction mathematically?", opts: ["Fourier's Law", "Newton's Law of Cooling", "Stefan-Boltzmann Law", "Hooke's Law"], ans: "Fourier's Law" }],
        advanced: [{ q: "What does the Nusselt number represent in heat transfer?", opts: ["The ratio of convective to conductive heat transfer across a boundary", "The total thermal capacity", "The absolute radiation output of a black body", "The kinematic viscosity metric"], ans: "The ratio of convective to conductive heat transfer across a boundary" }]
    },

    // ---- ELECTRICAL & ELECTRONICS ----
    'Electronic Devices': {
        beginner: [{ q: "What component is used to restrict the flow of current?", opts: ["Resistor", "Capacitor", "Inductor", "Diode"], ans: "Resistor" }],
        intermediate: [{ q: "What is the primary function of a Zener diode?", opts: ["Voltage regulation", "To emit light", "Signal amplification", "Current blocking entirely"], ans: "Voltage regulation" }],
        advanced: [{ q: "What is minority carrier injection in a P-N junction?", opts: ["Carriers crossing a forward-biased junction where they become minority carriers before recombining", "Electrons tunneling under reverse bias", "A manufacturing defect", "Creating a magnetic field"], ans: "Carriers crossing a forward-biased junction where they become minority carriers before recombining" }]
    },
    'Digital Electronics': {
        beginner: [{ q: "Which logic gate outputs 1 only if both inputs are 1?", opts: ["AND Gate", "OR Gate", "NOT Gate", "XOR Gate"], ans: "AND Gate" }],
        intermediate: [{ q: "What converts analog signals into digital signals?", opts: ["ADC (Analog to Digital Converter)", "DAC", "Multiplexer", "Transistor"], ans: "ADC (Analog to Digital Converter)" }],
        advanced: [{ q: "What essentially constitutes a J-K flip-flop's toggle state?", opts: ["When both J and K inputs are 1, the output toggles iteratively along the clock cycle", "When both are 0, it toggles", "It clears to 0 immediately regardless", "It acts as a D-type latch only"], ans: "When both J and K inputs are 1, the output toggles iteratively along the clock cycle" }]
    },
    'Analog Electronics': {
        beginner: [{ q: "What is an Operational Amplifier (Op-Amp) typically used for?", opts: ["Amplifying weak electrical signals", "Storing massive data", "Performing digital logic alone", "Lighting up screens"], ans: "Amplifying weak electrical signals" }],
        intermediate: [{ q: "In an ideal Op-Amp, what is the input impedance?", opts: ["Infinite", "Zero", "Exactly 1 Ohm", "50 Ohms"], ans: "Infinite" }],
        advanced: [{ q: "What causes the Miller Effect in inverting voltage amplifiers?", opts: ["The equivalent input capacitance is increased due to the amplification of the feedback capacitor", "The output voltage drops due to heat", "Gain becomes perfectly linear", "The inductor resonates with the casing"], ans: "The equivalent input capacitance is increased due to the amplification of the feedback capacitor" }]
    },
    'Communication Systems': {
        beginner: [{ q: "What does AM stand for in radio communication?", opts: ["Amplitude Modulation", "Analog Module", "Active Medium", "Array Manipulation"], ans: "Amplitude Modulation" }],
        intermediate: [{ q: "What is the purpose of modulation?", opts: ["To shift the frequency of the baseband signal to a range suitable for transmission", "To make the signal completely invisible", "To decrease the speed of transmission", "To convert audio into video"], ans: "To shift the frequency of the baseband signal to a range suitable for transmission" }],
        advanced: [{ q: "What does the Shannon-Hartley theorem dictate?", opts: ["The maximum theoretical data rate of a channel subject to noise", "The wavelength of fiber optics", "The voltage drop over distance", "The exact bit-error rate of TCP"], ans: "The maximum theoretical data rate of a channel subject to noise" }]
    },
    'Electrical Machines': {
        beginner: [{ q: "What converts mechanical energy into electrical energy?", opts: ["Generator", "Motor", "Transformer", "Battery"], ans: "Generator" }],
        intermediate: [{ q: "What is the primary function of a commutator in a DC machine?", opts: ["To convert alternating current produced in the armature to direct current at the terminals", "To cool down the engine", "To prevent magnetic interference", "To multiply the voltage"], ans: "To convert alternating current produced in the armature to direct current at the terminals" }],
        advanced: [{ q: "What is 'slip' in a 3-phase induction motor?", opts: ["The difference between synchronous speed and the actual rotor speed", "The physical sliding of the belt drive", "A complete failure of the stator magnetic field", "The overvoltage margin"], ans: "The difference between synchronous speed and the actual rotor speed" }]
    },
    'Power Systems': {
        beginner: [{ q: "What is the primary purpose of a power grid?", opts: ["To generate, transmit, and distribute electrical power securely", "To host internet websites", "To mine cryptocurrency", "To filter water supplies"], ans: "To generate, transmit, and distribute electrical power securely" }],
        intermediate: [{ q: "What device is fundamentally used to step up voltage for long-distance transmission?", opts: ["Transformer", "Inverter", "Converter", "Rectifier"], ans: "Transformer" }],
        advanced: [{ q: "In load flow studies, what variables are specified at a PQ bus?", opts: ["Real Power (P) and Reactive Power (Q)", "Voltage Magnitude and Angle", "Real Power and Voltage Magnitude", "Current and Frequency"], ans: "Real Power (P) and Reactive Power (Q)" }]
    },
    'Control Systems': {
        beginner: [{ q: "What type of control system uses feedback to adjust the output?", opts: ["Closed-loop system", "Open-loop system", "Linear module", "Random process"], ans: "Closed-loop system" }],
        intermediate: [{ q: "What does PID stand for in controllers?", opts: ["Proportional, Integral, Derivative", "Process, Indicator, Device", "Pulse Inversion Diagram", "Power Input Display"], ans: "Proportional, Integral, Derivative" }],
        advanced: [{ q: "What is a root locus plot used for?", opts: ["To determine the stability of a system by finding the poles of the closed-loop transfer function as a parameter varies", "To graph the physical wiring diagram of sensors", "To plot temperature variations", "To directly calculate power consumption"], ans: "To determine the stability of a system by finding the poles of the closed-loop transfer function as a parameter varies" }]
    },
    'Signals and Systems': {
        beginner: [{ q: "What mathematical transformation is commonly used to convert time-domain signals into the frequency domain?", opts: ["Fourier Transform", "Pythagorean Theorem", "Quadratic Formula", "Bode Plot"], ans: "Fourier Transform" }],
        intermediate: [{ q: "What defines a Linear Time-Invariant (LTI) system?", opts: ["It satisfies the properties of superposition and its nature does not change with time", "It only accepts digital inputs", "It operates strictly on random noise", "It guarantees zero energy loss"], ans: "It satisfies the properties of superposition and its nature does not change with time" }],
        advanced: [{ q: "What is convolution conceptually representing for LTI systems?", opts: ["The output response of an LTI system given an input signal and the system's impulse response", "A mathematical error check", "A physical winding of insulated wire", "The amplification factor limit"], ans: "The output response of an LTI system given an input signal and the system's impulse response" }]
    },
    'Microprocessors': {
        beginner: [{ q: "What does ALU stand for?", opts: ["Arithmetic Logic Unit", "Array Logic Unit", "Advanced Local Utility", "Analog Linear Unit"], ans: "Arithmetic Logic Unit" }],
        intermediate: [{ q: "What is the purpose of a program counter (PC)?", opts: ["To store the memory address of the next instruction to be fetched and executed", "To count how many times a program crashes", "To act purely as user RAM", "To measure CPU temperature"], ans: "To store the memory address of the next instruction to be fetched and executed" }],
        advanced: [{ q: "What is an interrupt vector table?", opts: ["A data structure mapping interrupts to their respective handling routines", "An array mapping CPU pins to motherboard slots", "A spreadsheet of clock cycle timings", "A hardware switch configuration database"], ans: "A data structure mapping interrupts to their respective handling routines" }]
    },
    'VLSI Design': {
        beginner: [{ q: "What does VLSI stand for?", opts: ["Very Large Scale Integration", "Virtual Linear Status Indicator", "Voltage Local System Interface", "Vector Layer Silicon Integration"], ans: "Very Large Scale Integration" }],
        intermediate: [{ q: "What component is primarily used as a switch in modern VLSI circuits?", opts: ["MOSFET", "Vacuum Tube", "Mechanical Relay", "Inductor Coil"], ans: "MOSFET" }],
        advanced: [{ q: "In VLSI, what is 'clock skew'?", opts: ["The difference in arrival time of the clock signal at different parts of the circuit", "A physical bend in the motherboard", "The processor getting too hot", "When a digital clock ticks backward"], ans: "The difference in arrival time of the clock signal at different parts of the circuit" }]
    },

    // ---- CIVIL ENGINEERING ----
    'Structural Engineering': {
        beginner: [{ q: "What material is most commonly used in reinforced concrete?", opts: ["Steel Rebar", "Wood", "Copper Wire", "Plastic Tubes"], ans: "Steel Rebar" }],
        intermediate: [{ q: "What does a bending moment diagram show?", opts: ["The internal bending moment at all sections along a structural member", "The aesthetic arch of a bridge", "The weight of the materials", "The cost analysis over time"], ans: "The internal bending moment at all sections along a structural member" }],
        advanced: [{ q: "What is the purpose of prestressed concrete?", opts: ["To introduce internal compressive stresses that counteract the tensile stresses resulting from external loads", "To make it cure faster in cold weather", "To reduce the overall mass by hollowing it out", "To allow it to bend fluidly in earthquakes"], ans: "To introduce internal compressive stresses that counteract the tensile stresses resulting from external loads" }]
    },
    'Geotechnical Engineering': {
        beginner: [{ q: "What is geotechnical engineering primarily concerned with?", opts: ["The engineering behavior of earth materials (soil and rock)", "Designing airplanes", "Studying oceanic currents", "Programming weather models"], ans: "The engineering behavior of earth materials (soil and rock)" }],
        intermediate: [{ q: "What is soil bearing capacity?", opts: ["The capacity of soil to support the loads applied to the ground", "The volume of water a soil can absorb", "The pH level of the soil", "The depth at which hitting bedrock is guaranteed"], ans: "The capacity of soil to support the loads applied to the ground" }],
        advanced: [{ q: "According to Terzaghi's principle, what is effective stress?", opts: ["The total stress minus the pore water pressure", "The absolute pressure exerted by gravity", "The shear stress at failure", "The nominal stress calculated theoretically"], ans: "The total stress minus the pore water pressure" }]
    },
    'Environmental Engineering': {
        beginner: [{ q: "What is the primary goal of physical water treatment?", opts: ["To remove solid particles using screening and filtration", "To add flavoring", "To dissolve all plastics", "To heat the water to boiling point"], ans: "To remove solid particles using screening and filtration" }],
        intermediate: [{ q: "What does BOD measure in wastewater treatment?", opts: ["Biochemical Oxygen Demand; the amount of dissolved oxygen needed by aerobic organisms", "Basic Output Depth", "Bacterial Optimization Degree", "Binary Organic Disposal"], ans: "Biochemical Oxygen Demand; the amount of dissolved oxygen needed by aerobic organisms" }],
        advanced: [{ q: "Which process uses a membrane to remove ions, molecules, and larger particles from drinking water?", opts: ["Reverse Osmosis", "Flocculation", "Sedimentation", "Chlorination"], ans: "Reverse Osmosis" }]
    },
    'Transportation Engineering': {
        beginner: [{ q: "What is the primary objective of transportation engineering?", opts: ["Safe and efficient movement of people and goods", "Building race tracks", "Manufacturing cars", "Designing airplanes exclusively"], ans: "Safe and efficient movement of people and goods" }],
        intermediate: [{ q: "In highway design, what is 'superelevation'?", opts: ["Banking the roadway along a curve to offset centrifugal forces", "Raising the highway above sea level entirely", "The maximum speed limit allowed", "Adding extra lanes for trucks"], ans: "Banking the roadway along a curve to offset centrifugal forces" }],
        advanced: [{ q: "What does a Level of Service (LOS) metric evaluate in traffic engineering?", opts: ["Operating conditions within a traffic stream (speed, density, freedom to maneuver)", "The cost of building the road", "The environmental impact of an airport", "The depth of asphalt required"], ans: "Operating conditions within a traffic stream (speed, density, freedom to maneuver)" }]
    }
};

// Generic fallback logic mapped in case of unmatched topics, extending the 65 items natively.
module.exports = {
    questionBanks
};
