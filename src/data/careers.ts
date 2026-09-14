import { Career } from '../types';

export const CAREER_DATABASE: Career[] = [
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    aliases: ['Software Developer', 'Full-Stack Engineer', 'Application Programmer'],
    description: 'Designs, develops, tests, and maintains software applications, algorithms, and computing systems across web, mobile, and cloud platforms.',
    careerCluster: 'Software & Computing',
    industry: 'Information Technology',
    tasks: [
      'Write clean, maintainable, and efficient code in modern languages',
      'Design modular software architectures and APIs',
      'Debug issues, write unit tests, and optimize performance',
      'Collaborate in agile sprint teams with code reviews and pair programming',
      'Deploy applications to cloud infrastructure and monitor uptime'
    ],
    responsibilities: [
      'Delivering scalable software features on schedule',
      'Maintaining software quality and code documentation',
      'Safeguarding application security and data privacy'
    ],
    workEnvironment: ['Modern collaborative office', 'Remote / Work-from-home friendly', 'High screen time', 'Agile team environment'],
    requiredSkills: ['Programming (Python, JS/TS, or Java)', 'Algorithms & Data Structures', 'Problem Solving', 'Git Version Control'],
    recommendedSkills: ['Database Design (SQL/NoSQL)', 'REST APIs', 'Cloud Computing (GCP/AWS)', 'Testing & CI/CD'],
    softSkills: ['Analytical Thinking', 'Team Communication', 'Continuous Learning', 'Adaptability'],
    technicalSkills: ['TypeScript', 'Python', 'React', 'Docker', 'Linux', 'SQL'],
    relevantSubjects: ['Computer Science', 'Mathematics', 'Physics', 'Information Technology', 'English'],
    relevantInterests: ['Programming', 'Problem Solving', 'Building Software', 'Technology', 'Puzzles & Logic'],
    riaSecProfile: { R: 0.55, I: 0.90, A: 0.45, S: 0.35, E: 0.40, C: 0.70 },
    mbtiCompatibility: ['INTJ', 'INTP', 'ISTJ', 'ENTP'],
    educationPaths: [
      {
        type: 'University',
        duration: '4 Years (B.S. in Computer Science or Software Engineering)',
        description: 'Comprehensive theoretical foundations in computational theory, operating systems, compilers, and advanced mathematics.',
        tradeoffs: 'High depth of theory and strong campus recruiting, but higher financial tuition and slower direct hands-on industry iteration.'
      },
      {
        type: 'College/Vocational',
        duration: '2-3 Years (Associate Degree / Applied IT)',
        description: 'Focus on applied web and app development, enterprise frameworks, and direct vocational training.',
        tradeoffs: 'Quicker market entry with lower cost, but might face resume screening hurdles at top-tier deep-tech research labs.'
      },
      {
        type: 'Self-Taught / Portfolio',
        duration: '1-2 Years intensive self-study',
        description: 'Mastering coding bootcamps, open-source contributions, personal GitHub repositories, and freelance projects.',
        tradeoffs: 'Maximum flexibility and lowest financial cost, but requires exceptional self-discipline and networking grit.'
      }
    ],
    relatedMajors: ['Computer Science', 'Software Engineering', 'Information Technology', 'Computer Engineering', 'Computational Mathematics'],
    vocationalPaths: ['Junior Web Developer', 'QA Automation Tester', 'Technical Support Engineer'],
    certifications: ['AWS Certified Developer', 'Google Cloud Professional Cloud Architect', 'Oracle Java Associate'],
    portfolioExamples: ['Full-stack task management web application', 'Open-source CLI tool for data parsing', 'Mobile personal budget tracker'],
    beginnerProjects: ['Build an interactive personal calculator', 'Create a text-based adventure game in Python', 'Develop a responsive personal portfolio site'],
    progressionPath: {
      entry: 'Junior Software Engineer (bug fixing, implementing small features under senior guidance)',
      mid: 'Mid-Level Engineer (independently owning entire services, mentoring juniors)',
      senior: 'Senior Engineer / Staff Architect / Engineering Manager (system design, tech roadmap, org leadership)'
    },
    workStyle: 'Analytical, project-oriented, collaborative sprints with independent deep-focus blocks',
    challenges: ['Fast-paced tech turnover requiring relentless upskilling', 'Sedentary screen hours', 'Debugging complex edge cases'],
    advantages: ['High global demand and mobility', 'Strong compensation', 'High autonomy and creative satisfaction in building systems'],
    futureTrends: 'Increasing leverage through AI coding assistants; growing focus on distributed systems, security, and developer productivity.',
    salaryInfo: {
      rangeDescription: 'Varies widely by region; typically in the top 20% of professional starting salaries.',
      disclaimer: 'Example / illustrative information - requires local verification with regional labor authorities.',
      levelIndicator: 'Very High'
    },
    experiments: [
      {
        title: 'Hour of Code & Mini Python Automation',
        duration: '2 Hours',
        difficulty: 'Beginner',
        description: 'Write a Python script that automates renaming 20 files or solves 5 logic puzzles on LeetCode/Codecademy.',
        steps: ['Install Python or use an online browser REPL', 'Complete basic variables, loops, and condition tutorials', 'Write a script to compute factorial or parse text'],
        expectedOutcome: 'Understand if you enjoy the step-by-step logic and patience needed to track down errors.'
      },
      {
        title: 'Deploy a Web Page to GitHub Pages',
        duration: '1 Weekend',
        difficulty: 'Beginner',
        description: 'Build a single-page website using HTML/CSS/JavaScript and publish it live on the web for friends to see.',
        steps: ['Create HTML structure', 'Style with CSS', 'Add a JavaScript button click counter', 'Push to GitHub and enable Pages'],
        expectedOutcome: 'Experience the tangible thrill of seeing your code accessible to anyone in the world.'
      }
    ],
    alternativeCareers: [
      { careerId: 'robotics-engineer', title: 'Robotics Engineer', similarityReason: 'Both write software to automate tasks', distinction: 'Robotics interfaces directly with physical actuators and real-time hardware constraints.' },
      { careerId: 'data-scientist', title: 'AI & Data Scientist', similarityReason: 'Both rely heavily on programming and algorithms', distinction: 'Data science emphasizes statistical modeling, data cleaning, and probabilistic inference over software architectures.' },
      { careerId: 'cybersecurity-specialist', title: 'Cybersecurity Specialist', similarityReason: 'Both need deep system and code comprehension', distinction: 'Cybersecurity focuses on threat models, vulnerability discovery, defensive posture, and compliance.' }
    ],
    source: 'EduPath Career Knowledge Base v2.4 (O*NET 15-1252.00 & STEM Edu benchmarks)',
    lastUpdated: '2026-09'
  },
  {
    id: 'ai-data-scientist',
    title: 'AI & Data Scientist',
    aliases: ['Machine Learning Engineer', 'Data Scientist', 'AI Researcher'],
    description: 'Extracts actionable insights from large-scale datasets, constructs predictive machine learning models, and develops artificial intelligence systems.',
    careerCluster: 'AI & Data',
    industry: 'Information Technology / Advanced Analytics',
    tasks: [
      'Clean, preprocess, and explore structured and unstructured data',
      'Train, fine-tune, and evaluate machine learning & deep learning models',
      'Conduct statistical experiments and A/B hypothesis tests',
      'Collaborate with product teams to translate business problems into mathematical formulations',
      'Deploy models as scalable inference microservices'
    ],
    responsibilities: [
      'Ensuring model accuracy, robustness, and ethical fairness',
      'Communicating statistical findings clearly to non-technical stakeholders',
      'Guarding against data leakage and biases in training sets'
    ],
    workEnvironment: ['Tech campus / Research laboratory', 'Hybrid / Remote friendly', 'Data-rich analytical workstations'],
    requiredSkills: ['Python & Data Science Libraries (NumPy, Pandas, Scikit-Learn)', 'Applied Statistics & Linear Algebra', 'Data Visualization', 'SQL'],
    recommendedSkills: ['PyTorch or TensorFlow', 'Big Data (Spark)', 'Feature Engineering', 'MLOps (MLflow, Docker)'],
    softSkills: ['Scientific Curiosity', 'Critical Skepticism', 'Data Storytelling', 'Business Acumen'],
    technicalSkills: ['Python', 'SQL', 'PyTorch', 'Jupyter', 'Pandas', 'Docker'],
    relevantSubjects: ['Mathematics', 'Statistics', 'Computer Science', 'Physics', 'Logic'],
    relevantInterests: ['Data Analysis', 'Artificial Intelligence', 'Mathematics & Modeling', 'Finding Patterns', 'Research'],
    riaSecProfile: { R: 0.35, I: 0.95, A: 0.40, S: 0.30, E: 0.45, C: 0.75 },
    mbtiCompatibility: ['INTJ', 'INTP', 'INFJ', 'ENTP'],
    educationPaths: [
      {
        type: 'University',
        duration: '4-6 Years (B.S. + M.S. in Data Science, CS, or Applied Statistics)',
        description: 'Rigorous mathematical background in multivariate calculus, Bayesian inference, and neural network architectures.',
        tradeoffs: 'Premier qualification for competitive R&D labs; requires high commitment to academic rigor.'
      },
      {
        type: 'College/Vocational',
        duration: '2-3 Years (Applied Data Analytics)',
        description: 'Focus on business intelligence dashboards, SQL reporting, and tabular analytics.',
        tradeoffs: 'Excellent for business data analyst roles, but may require bridge degrees for senior research engineering.'
      }
    ],
    relatedMajors: ['Data Science', 'Statistics', 'Computer Science', 'Applied Mathematics', 'Cognitive Science'],
    vocationalPaths: ['Junior Data Analyst', 'BI Dashboard Developer', 'Data Quality Specialist'],
    certifications: ['Google Professional Data Engineer', 'TensorFlow Developer Certificate', 'AWS Machine Learning Specialty'],
    portfolioExamples: ['End-to-end sentiment classification pipeline', 'House price prediction model with feature importance analysis', 'Customer churn predictive dashboard'],
    beginnerProjects: ['Analyze Titanic survivor dataset with Pandas', 'Train an image classifier to detect cats vs dogs in 50 lines of code', 'Scrape real-estate listings and visualize price distributions'],
    progressionPath: {
      entry: 'Junior Data Analyst / Associate Data Scientist (data wrangling, baseline models)',
      mid: 'Data Scientist (owning end-to-end model development, experiment design)',
      senior: 'Principal Data Scientist / Head of AI (strategic vision, cutting-edge R&D)'
    },
    workStyle: 'Hypothesis-driven, deeply analytical, iterative experimentation with statistical verification',
    challenges: ['Noisy or missing real-world data', 'Balancing model explainability against black-box complexity', 'Managing stakeholder expectations around AI'],
    advantages: ['Massive technological relevance', 'Intellectually invigorating challenges', 'High industry compensation'],
    futureTrends: 'Autonomous agent frameworks, multimodal generative intelligence, domain-specialized small language models.',
    salaryInfo: {
      rangeDescription: 'Consistently ranks among the top echelon of STEM compensations.',
      disclaimer: 'Example / illustrative information - requires local verification.',
      levelIndicator: 'Very High'
    },
    experiments: [
      {
        title: 'Exploratory Data Analysis of Spotify Hits',
        duration: '3 Hours',
        difficulty: 'Beginner',
        description: 'Download an open dataset of Spotify songs from Kaggle. Plot danceability vs popularity using Seaborn/Matplotlib in Google Colab.',
        steps: ['Open Google Colab (free)', 'Load dataset with pandas.read_csv', 'Plot correlations and find interesting music trends'],
        expectedOutcome: 'See if discovering hidden stories in rows and columns excites your curiosity.'
      }
    ],
    alternativeCareers: [
      { careerId: 'software-engineer', title: 'Software Engineer', similarityReason: 'Shares programming tools and infrastructure', distinction: 'Software engineering focuses on software reliability and code architecture rather than statistical inference.' },
      { careerId: 'quantitative-analyst', title: 'Quantitative Financial Analyst', similarityReason: 'Both use heavy mathematics and Python modeling', distinction: 'Quants focus exclusively on algorithmic trading, financial markets, and risk arbitration.' }
    ],
    source: 'EduPath Career Knowledge Base v2.4 (O*NET 15-2051.00)',
    lastUpdated: '2026-09'
  },
  {
    id: 'robotics-engineer',
    title: 'Robotics & Automation Engineer',
    aliases: ['Mechatronics Engineer', 'Automation Specialist', 'Robotics Systems Designer'],
    description: 'Bridges mechanical, electrical, and computer engineering to create autonomous machines and robotic systems for manufacturing, medicine, exploration, and logistics.',
    careerCluster: 'Robotics & Automation',
    industry: 'Advanced Manufacturing & Robotics',
    tasks: [
      'Design mechanical kinematics, chassis, and gripper mechanisms',
      'Integrate sensors (LiDAR, cameras, IMUs) with microcontrollers',
      'Program motion planning, feedback loops (PID), and state machines',
      'Simulate robotic behaviors in ROS (Robot Operating System) and Gazebo',
      'Calibrate hardware and troubleshoot electrical wiring and servos'
    ],
    responsibilities: [
      'Ensuring human safety in collaborative robot (cobot) work zones',
      'Guaranteeing high reliability and sub-millimeter positioning precision',
      'Documenting mechanical blueprints and electrical wiring schematics'
    ],
    workEnvironment: ['Robotics lab / Prototyping workshop', 'Factory automation floor', 'R&D testing arenas with hardware in the loop'],
    requiredSkills: ['C++ / Python Programming', 'Circuit Design & Microcontrollers (Arduino/STM32/ESP32)', 'Physics & Kinematics', 'CAD 3D Modeling (SolidWorks/Fusion 360)'],
    recommendedSkills: ['ROS / ROS2', 'Control Theory (PID, Kalman Filter)', 'Computer Vision (OpenCV)', 'PCB Layout'],
    softSkills: ['Hands-on Problem Solving', 'Interdisciplinary Teamwork', 'Patience with Physical Hardware', 'Attention to Detail'],
    technicalSkills: ['C++', 'Python', 'ROS2', 'Fusion 360', 'C/Embedded', 'Soldering'],
    relevantSubjects: ['Physics', 'Mathematics', 'Computer Science', 'Design & Technology', 'Mechanics'],
    relevantInterests: ['Building Gadgets', 'Robotics & Mechanics', 'Electronics & Arduino', 'Hands-on Tinkering', '3D Printing'],
    riaSecProfile: { R: 0.95, I: 0.85, A: 0.35, S: 0.25, E: 0.40, C: 0.65 },
    mbtiCompatibility: ['ISTP', 'INTJ', 'INTP', 'ESTP'],
    educationPaths: [
      {
        type: 'University',
        duration: '4-5 Years (B.S. in Mechatronics, Robotics, Electrical, or Mechanical Engineering)',
        description: 'Comprehensive study of dynamics, signals and systems, microprocessors, and modern control theory.',
        tradeoffs: 'Solid multi-disciplinary credential; demanding workload spanning mechanics, electronics, and code.'
      },
      {
        type: 'College/Vocational',
        duration: '2-3 Years (Robotics & Automation Technician Diploma)',
        description: 'Hands-on training in PLC programming, industrial robotic arm maintenance (Fanuc/KUKA), and pneumatics.',
        tradeoffs: 'Immediate employability in high-demand factories, but less focus on autonomous algorithm research.'
      }
    ],
    relatedMajors: ['Mechatronics Engineering', 'Robotics Engineering', 'Mechanical Engineering', 'Electrical Engineering'],
    vocationalPaths: ['Industrial Automation Technician', 'Field Service Technician', 'Rapid Prototyping Specialist'],
    certifications: ['Certified Automation Professional (CAP)', 'FANUC Robot Operator Certification', 'SolidWorks CSWA/CSWP'],
    portfolioExamples: ['Autonomous line-following and obstacle-avoiding rover', '3D printed 4-DOF robotic arm controlled via Bluetooth', 'Inverted pendulum balancer with PID control'],
    beginnerProjects: ['Build an Arduino obstacle-avoiding robot chassis with ultrasonic sensors', 'Design and 3D print a custom robotic gripper in Tinkercad', 'Simulate a turtle robot path in ROS Turtlesim'],
    progressionPath: {
      entry: 'Junior Automation Engineer (firmware testing, wiring prototypes, component assembly)',
      mid: 'Robotics Engineer (full subsystem integration, motion planning, sensor fusion)',
      senior: 'Lead Robotics Architect (autonomous vehicle fleet architecture, safety compliance)'
    },
    workStyle: 'Splits time between code editor, CAD software, soldering iron, and physical test floor',
    challenges: ['Physical hardware bugs take longer to fix than pure software', 'Supply chain lead times for parts', 'Strict safety tolerances'],
    advantages: ['Tangible physical realization of your intellectual work', 'Cross-disciplinary versatility', 'High growth in smart manufacturing & logistics'],
    futureTrends: 'Humanoid robots, collaborative cobots in surgery, warehouse autonomy, edge AI sensor integration.',
    salaryInfo: {
      rangeDescription: 'High demand across aerospace, automotive, electronics, and medical robotics.',
      disclaimer: 'Example / illustrative information - requires local verification.',
      levelIndicator: 'High'
    },
    experiments: [
      {
        title: 'Build a Virtual Robot in Tinkercad Circuits',
        duration: '2 Hours',
        difficulty: 'Beginner',
        description: 'Use Tinkercad (free web app) to wire a virtual Arduino, servo motor, and distance sensor, and write C code to turn the motor when an object approaches.',
        steps: ['Open Tinkercad Circuits', 'Drag Arduino Uno and Ultrasonic Sensor', 'Write block or C++ code to read distance', 'Simulate!'],
        expectedOutcome: 'Understand how code translates into physical movement in real-time.'
      }
    ],
    alternativeCareers: [
      { careerId: 'semiconductor-engineer', title: 'Semiconductor Hardware Engineer', similarityReason: 'Both deal with advanced electronic hardware and physics', distinction: 'Semiconductor engineers focus on micro-scale silicon chips rather than macro mechanical movement.' },
      { careerId: 'software-engineer', title: 'Software Engineer', similarityReason: 'Both write algorithms and compile code', distinction: 'Software engineers work purely in the digital domain without mechanical or thermal constraints.' }
    ],
    source: 'EduPath Career Knowledge Base v2.4 (O*NET 17-2199.08)',
    lastUpdated: '2026-09'
  },
  {
    id: 'semiconductor-engineer',
    title: 'Semiconductor Hardware Engineer',
    aliases: ['VLSI Design Engineer', 'Microchip Engineer', 'ASIC/FPGA Engineer'],
    description: 'Designs, verifies, and fabricates microchips, integrated circuits, and processors powering modern smartphones, computers, automotive, and AI accelerators.',
    careerCluster: 'Electronics & Semiconductor',
    industry: 'Semiconductor & Microelectronics',
    tasks: [
      'Write hardware description code (Verilog / SystemVerilog / VHDL)',
      'Simulate digital logic and conduct formal timing and power verification',
      'Design physical layouts, transistor routing, and tape-out masks',
      'Characterize silicon wafers in cleanroom or post-silicon test labs',
      'Optimize silicon power, performance, and area (PPA metrics)'
    ],
    responsibilities: [
      'Zero-defect tolerance before multi-million dollar silicon manufacturing',
      'Adhering to strict semiconductor design rules and thermal limits',
      'Coordinating with fabrication foundries (TSMC, Intel, Samsung)'
    ],
    workEnvironment: ['High-tech semiconductor design office', 'Cleanroom fabrication facility', 'Advanced electronics test lab'],
    requiredSkills: ['Digital Logic Design', 'Verilog / SystemVerilog', 'Computer Architecture', 'Electronic Circuits'],
    recommendedSkills: ['FPGA Prototyping', 'Static Timing Analysis (STA)', 'Python / Tcl Scripting', 'Semiconductor Physics'],
    softSkills: ['Extreme Precision', 'Methodical Root-Cause Analysis', 'Patience', 'Team Coordination'],
    technicalSkills: ['SystemVerilog', 'Verilog', 'Tcl', 'Linux', 'Cadence/Synopsys EDA tools', 'FPGA'],
    relevantSubjects: ['Physics', 'Mathematics', 'Electrical Engineering', 'Chemistry', 'Computer Science'],
    relevantInterests: ['Microchips & Hardware', 'Digital Electronics', 'Physics & Nanotechnology', 'High Performance Computing'],
    riaSecProfile: { R: 0.80, I: 0.95, A: 0.25, S: 0.20, E: 0.40, C: 0.85 },
    mbtiCompatibility: ['INTJ', 'INTP', 'ISTJ'],
    educationPaths: [
      {
        type: 'University',
        duration: '4-6 Years (B.S. or M.S. in Electrical, Electronics, or Microelectronics Engineering)',
        description: 'Deep grounding in solid-state physics, semiconductor fabrication processes, electromagnetic theory, and VLSI design.',
        tradeoffs: 'High barriers to entry and intense coursework; unmatched strategic global career security.'
      }
    ],
    relatedMajors: ['Electrical Engineering', 'Electronics & Telecommunications', 'Microelectronics', 'Computer Engineering', 'Materials Science'],
    vocationalPaths: ['Cleanroom Process Operator', 'Wafer Test Technician', 'PCB Assembly Technician'],
    certifications: ['Arm Accredited Engineer', 'IEEE Microelectronics Professional Development'],
    portfolioExamples: ['8-bit RISC CPU implemented in Verilog on an FPGA board', 'UART communication controller with parity check', 'Digital ALU with pipeline registers'],
    beginnerProjects: ['Design a digital 4-bit adder using logic gates in an online simulator', 'Program an FPGA board to display numbers on a 7-segment display', 'Write a Verilog testbench for a traffic light controller'],
    progressionPath: {
      entry: 'Junior Design/Verification Engineer (testbench writing, regression debugging)',
      mid: 'Senior Silicon Engineer (block-level owner, RTL synthesis, timing closure)',
      senior: 'Principal Chip Architect (full-chip architecture, tape-out signoff)'
    },
    workStyle: 'Deeply disciplined, analytical, using specialized EDA software with multi-day simulation runs',
    challenges: ['Silicon mistakes cost millions to re-spin', 'Steep learning curve with proprietary EDA tools', 'Global geopolitical sensitivity'],
    advantages: ['Critical national-security and global infrastructure domain', 'Exceptional job stability and compensation', 'Frontier of nanotechnology'],
    futureTrends: 'AI accelerator chipsets, chiplets and 3D packaging, 2nm/sub-2nm gate-all-around architectures.',
    salaryInfo: {
      rangeDescription: 'High starting salary with strong bonuses driven by global semiconductor talent shortage.',
      disclaimer: 'Example / illustrative information - requires local verification.',
      levelIndicator: 'Very High'
    },
    experiments: [
      {
        title: 'Simulate Logic Gates and Build an ALU Online',
        duration: '2 Hours',
        difficulty: 'Beginner',
        description: 'Use the free online tool circuitverse.org to connect AND, OR, and XOR gates into a 1-bit full adder and test the truth table.',
        steps: ['Open CircuitVerse', 'Drag switches, XOR gates, and an LED bulb', 'Verify addition of 1 + 1 = 10 (binary)'],
        expectedOutcome: 'Discover if you love understanding how computing works at the physical transistor level.'
      }
    ],
    alternativeCareers: [
      { careerId: 'robotics-engineer', title: 'Robotics Engineer', similarityReason: 'Both deal with circuits and microcontrollers', distinction: 'Robotics integrates ready-made chips into mechanical systems, whereas semiconductor engineers design the chips themselves.' },
      { careerId: 'cybersecurity-specialist', title: 'Cybersecurity Specialist', similarityReason: 'Both look for low-level architecture vulnerabilities', distinction: 'Semiconductor focuses on physical silicon design; cybersecurity on software/network threat defense.' }
    ],
    source: 'EduPath Career Knowledge Base v2.4 (O*NET 17-2072.00)',
    lastUpdated: '2026-09'
  },
  {
    id: 'cybersecurity-specialist',
    title: 'Cybersecurity Specialist',
    aliases: ['Information Security Analyst', 'Security Engineer', 'Penetration Tester / Ethical Hacker'],
    description: 'Protects computer networks, cloud infrastructure, and sensitive data from cyber attacks, unauthorized access, ransomware, and vulnerabilities.',
    careerCluster: 'Cybersecurity',
    industry: 'Information Security / Defense & Enterprise',
    tasks: [
      'Monitor networks for security breaches and analyze alert telemetry',
      'Conduct vulnerability assessments and penetration testing on systems',
      'Configure firewalls, encryption keys, and identity management policies',
      'Lead incident response and root-cause forensics during security incidents',
      'Train employees and audit systems for regulatory security compliance'
    ],
    responsibilities: [
      'Defending critical digital infrastructure 24/7 from sophisticated adversaries',
      'Preserving data confidentiality, integrity, and availability (CIA triad)',
      'Documenting compliance with ISO 27001, SOC2, or NIST cybersecurity frameworks'
    ],
    workEnvironment: ['Security Operations Center (SOC)', 'Corporate tech environment', 'Remote / hybrid friendly', 'High-readiness standby for incidents'],
    requiredSkills: ['Computer Networking (TCP/IP, DNS, Routing)', 'Operating Systems (Linux & Windows Internals)', 'Security Principles (Cryptography, Firewalls)', 'Scripting (Python, Bash)'],
    recommendedSkills: ['Penetration Testing Tools (Wireshark, Burp Suite, Nmap)', 'Cloud Security (AWS/Azure IAM)', 'SIEM Tools (Splunk)', 'Reverse Engineering'],
    softSkills: ['Investigative Mindset', 'Calm Under Pressure', 'Integrity & Ethics', 'Clear Risk Communication'],
    technicalSkills: ['Linux', 'Wireshark', 'Python', 'Nmap', 'Bash', 'Docker'],
    relevantSubjects: ['Computer Science', 'Information Technology', 'Mathematics', 'English', 'Law & Ethics'],
    relevantInterests: ['Hacking & Defense', 'Computer Networks', 'Puzzles & Mystery Solving', 'Privacy & Rights', 'Technology Security'],
    riaSecProfile: { R: 0.60, I: 0.90, A: 0.30, S: 0.30, E: 0.50, C: 0.80 },
    mbtiCompatibility: ['INTJ', 'ISTP', 'INTP', 'ENTP'],
    educationPaths: [
      {
        type: 'University',
        duration: '4 Years (B.S. in Cybersecurity, Computer Science, or Network Engineering)',
        description: 'Deep study of cryptography, computer architecture, network protocols, and secure coding practices.',
        tradeoffs: 'Prestigious degree pathway, but practical hands-on lab experience (CTFs) remains mandatory alongside coursework.'
      },
      {
        type: 'Certifications',
        duration: '6-18 Months self-paced with practical labs',
        description: 'Industry certifications (CompTIA Security+, CEH, OSCP) combined with active participation in HackTheBox and CTF competitions.',
        tradeoffs: 'Rapid entry into junior SOC roles; top offensive certifications (OSCP) carry enormous practical industry respect.'
      }
    ],
    relatedMajors: ['Cybersecurity', 'Computer Science', 'Information Assurance', 'Computer Networks'],
    vocationalPaths: ['SOC Analyst Tier 1', 'Junior IT Security Administrator', 'Helpdesk Security Support'],
    certifications: ['CompTIA Security+', 'Certified Ethical Hacker (CEH)', 'Offensive Security Certified Professional (OSCP)', 'CISSP'],
    portfolioExamples: ['Documented penetration test write-up on a simulated vulnerable VM', 'Custom Python port scanner and packet analyzer', 'Secure home network lab with pfSense firewall and Snort IDS'],
    beginnerProjects: ['Solve beginner challenges on OverTheWire Bandit to master Linux commands', 'Capture and inspect HTTP vs HTTPS traffic in Wireshark', 'Set up a virtual lab using VirtualBox with a Kali Linux attacker and Ubuntu target'],
    progressionPath: {
      entry: 'Tier 1 SOC Analyst (triaging automated alerts, identifying false positives)',
      mid: 'Security Engineer / Penetration Tester (hunting threats, conducting full pentests)',
      senior: 'Lead Incident Responder / Chief Information Security Officer (CISO)'
    },
    workStyle: 'Adversarial thinking, forensic analysis, constant vigilance and rapid response',
    challenges: ['Attackers only need one mistake; defenders must protect everything', 'On-call stress during suspected breaches', 'Fast-evolving threats'],
    advantages: ['Immense job security—every industry requires cybersecurity', 'Exciting cat-and-mouse intellectual game', 'Strong compensation'],
    futureTrends: 'AI-powered automated malware and deepfake fraud, zero-trust network architectures, quantum-safe post-quantum cryptography.',
    salaryInfo: {
      rangeDescription: 'High demand worldwide with persistent talent deficit across enterprise and government.',
      disclaimer: 'Example / illustrative information - requires local verification.',
      levelIndicator: 'Very High'
    },
    experiments: [
      {
        title: 'OverTheWire Bandit Linux Wargame',
        duration: '2 Hours',
        difficulty: 'Beginner',
        description: 'Play levels 0 to 5 of the free online Bandit game (overthewire.org) using SSH to find hidden passwords in files.',
        steps: ['Open terminal or browser SSH', 'Connect to bandit.labs.overthewire.org', 'Use ls, cat, and grep to locate the flags'],
        expectedOutcome: 'Test your patience and curiosity for investigative detective work in text systems.'
      }
    ],
    alternativeCareers: [
      { careerId: 'software-engineer', title: 'Software Engineer', similarityReason: 'Both write code and understand OS concepts', distinction: 'Cybersecurity focuses on finding ways systems fail or can be subverted rather than feature building.' },
      { careerId: 'corporate-lawyer', title: 'Corporate & Tech IP Lawyer', similarityReason: 'Both deal with compliance, regulations, and risk prevention', distinction: 'Cybersecurity enforces technical guardrails; lawyers interpret legal statutes.' }
    ],
    source: 'EduPath Career Knowledge Base v2.4 (O*NET 15-1212.00)',
    lastUpdated: '2026-09'
  },
  {
    id: 'biomedical-engineer',
    title: 'Biomedical Engineer',
    aliases: ['Bioengineer', 'Medical Device Engineer', 'Tissue Engineer'],
    description: 'Applies engineering principles and design concepts to medicine and biology for healthcare purposes, such as artificial organs, prosthetics, and medical diagnostics.',
    careerCluster: 'Medicine & Health',
    industry: 'Healthcare Technology & Medical Devices',
    tasks: [
      'Design biomedical devices such as pacemakers, ventilators, and MRI machines',
      'Conduct biocompatibility tests on biomaterials and surgical implants',
      'Program biosignal acquisition and filtering algorithms (ECG, EEG)',
      'Interface with clinicians, surgeons, and regulatory bodies (FDA, CE)',
      'Supervise clinical trials and ensure patient safety protocols'
    ],
    responsibilities: [
      'Ensuring medical device reliability and life-critical patient safety',
      'Complying with strict biomedical quality standards (ISO 13485)',
      'Translating medical doctor requirements into engineering tolerances'
    ],
    workEnvironment: ['Hospital biomedical engineering unit', 'Medical device R&D clean lab', 'Biotechnology research center'],
    requiredSkills: ['Human Anatomy & Physiology Basics', 'Electronics & Biosensors', 'Biomechanics / Biomaterials', 'CAD Modeling & Prototyping'],
    recommendedSkills: ['Signal Processing (MATLAB/Python)', 'Medical Device Regulations (FDA 510k)', '3D Bioprinting', 'Microfluidics'],
    softSkills: ['Empathy for Patients', 'Cross-disciplinary Communication', 'Methodical Documentation', 'Ethical Responsibility'],
    technicalSkills: ['MATLAB', 'SolidWorks', 'Python', 'LabVIEW', 'C++', '3D Printing'],
    relevantSubjects: ['Biology', 'Physics', 'Mathematics', 'Chemistry', 'Computer Science'],
    relevantInterests: ['Healthcare & Medicine', 'Engineering & Technology', 'Helping Sick People', 'Biotechnology', 'Human Body Function'],
    riaSecProfile: { R: 0.70, I: 0.90, A: 0.35, S: 0.65, E: 0.35, C: 0.70 },
    mbtiCompatibility: ['INFJ', 'INTJ', 'INTP', 'ENFJ'],
    educationPaths: [
      {
        type: 'University',
        duration: '4-6 Years (B.S. or M.S. in Biomedical Engineering or Bioengineering)',
        description: 'Balanced curriculum covering engineering physics, organic chemistry, physiology, and medical device design.',
        tradeoffs: 'Direct alignment with healthcare technology; requires broad mastery across both biology and engineering.'
      }
    ],
    relatedMajors: ['Biomedical Engineering', 'Bioengineering', 'Mechanical Engineering (Biomedical concentration)', 'Electrical Engineering'],
    vocationalPaths: ['Hospital Clinical Equipment Specialist', 'Medical Device Calibration Technician', 'Quality Control Inspector'],
    certifications: ['Certified Biomedical Equipment Technician (CBET)', 'Regulatory Affairs Certification (RAC)'],
    portfolioExamples: ['Low-cost 3D printed prosthetic hand with EMG muscle sensor activation', 'Pulse oximeter circuit and display built from scratch', 'Finite element stress analysis of a titanium hip implant'],
    beginnerProjects: ['Wire a pulse sensor to an Arduino to measure your own heart rate', 'Design a customized ergonomic wrist brace in Tinkercad', 'Model blood flow resistance in an artery using a basic physics simulator'],
    progressionPath: {
      entry: 'Junior Biomedical Engineer (bench testing, component verification, documentation)',
      mid: 'Medical Device R&D Engineer (designing new instruments, managing clinical trials)',
      senior: 'Chief Medical Device Architect / Director of Clinical Engineering'
    },
    workStyle: 'Disciplined laboratory testing, clinical validation, high humanitarian purpose',
    challenges: ['Long regulatory approval cycles before devices reach patients', 'Extensive paperwork and validation testing', 'High moral gravity'],
    advantages: ['Direct, tangible impact on saving human lives', 'Exciting intersection of medicine and technology', 'Growing elder-care demographic demand'],
    futureTrends: 'Brain-computer interfaces (BCI), wearable non-invasive health monitors, organ-on-a-chip, robotic assisted surgery.',
    salaryInfo: {
      rangeDescription: 'Competitive engineering compensation with steady growth in healthcare sector.',
      disclaimer: 'Example / illustrative information - requires local verification.',
      levelIndicator: 'Above Average'
    },
    experiments: [
      {
        title: 'Build a DIY Heart Rate Monitor with Microcontroller',
        duration: '3 Hours',
        difficulty: 'Beginner',
        description: 'Connect an optical pulse sensor (or use your smartphone camera) to measure and plot beats per minute on screen.',
        steps: ['Obtain a photoplethysmography sensor or phone app', 'Observe how blood flow changes light absorption', 'Calculate heart rate variability'],
        expectedOutcome: 'Understand how physiological biology converts into electrical data signals.'
      }
    ],
    alternativeCareers: [
      { careerId: 'physician-doctor', title: 'Physician / Clinical Doctor', similarityReason: 'Both are dedicated to human health and healing', distinction: 'Doctors treat individual patients directly; biomedical engineers create the tools doctors use to treat thousands.' },
      { careerId: 'robotics-engineer', title: 'Robotics Engineer', similarityReason: 'Both design electro-mechanical systems', distinction: 'Biomedical engineering must respect living human tissue, sterilizability, and patient safety constraints.' }
    ],
    source: 'EduPath Career Knowledge Base v2.4 (O*NET 17-2031.00)',
    lastUpdated: '2026-09'
  },
  {
    id: 'physician-doctor',
    title: 'Physician / Clinical Doctor',
    aliases: ['Medical Doctor (MD)', 'General Practitioner', 'Medical Specialist'],
    description: 'Diagnoses illnesses, prescribes treatments, performs medical procedures, and counsels patients on preventive health and disease management.',
    careerCluster: 'Medicine & Health',
    industry: 'Clinical Healthcare & Hospitals',
    tasks: [
      'Examine patients, take comprehensive medical histories, and order diagnostic tests',
      'Diagnose complex conditions based on laboratory tests, imaging, and clinical symptoms',
      'Formulate tailored treatment plans, prescribe medications, and monitor recovery',
      'Communicate empathetically with anxious patients and their family members',
      'Coordinate patient care across multidisciplinary teams of nurses and specialists'
    ],
    responsibilities: [
      'Upholding the Hippocratic oath: patient well-being and do no harm',
      'Maintaining precise patient medical records and diagnostic justifications',
      'Adhering strictly to medical ethics, consent, and patient confidentiality'
    ],
    workEnvironment: ['Hospitals and emergency departments', 'Outpatient community clinics', 'High-pressure clinical settings', 'Irregular / on-call shift work'],
    requiredSkills: ['Clinical Diagnostics & Anatomy', 'Pharmacology & Pathology', 'Active Listening & Empathy', 'Critical Decision Making Under Pressure'],
    recommendedSkills: ['Emergency Resuscitation (BLS/ACLS)', 'Medical Research Literacy', 'Patient Counseling', 'Electronic Health Records (EHR)'],
    softSkills: ['Compassion', 'Emotional Resilience', 'Clear Communication', 'Dedication to Lifelong Study'],
    technicalSkills: ['Stethoscope Examination', 'Suturing & Minor Procedures', 'Interpreting X-rays/Blood Tests', 'Clinical Protocols'],
    relevantSubjects: ['Biology', 'Chemistry', 'Physics', 'Psychology', 'English'],
    relevantInterests: ['Human Biology & Health', 'Helping People', 'Medical Science', 'Hospital Work', 'Lifelong Learning'],
    riaSecProfile: { R: 0.40, I: 0.90, A: 0.30, S: 0.90, E: 0.50, C: 0.60 },
    mbtiCompatibility: ['ISFJ', 'ESFJ', 'INFJ', 'ENFJ', 'ISTJ'],
    educationPaths: [
      {
        type: 'University',
        duration: '6-10+ Years (Pre-med/B.S. + Medical School MD + Residency Training)',
        description: 'Rigorous medical curriculum followed by supervised hospital residency training in specialty.',
        tradeoffs: 'Longest, most demanding educational commitment; unmatched professional prestige, trust, and career fulfillment.'
      }
    ],
    relatedMajors: ['Medicine', 'Pre-Med / Biomedical Sciences', 'Human Biology', 'Biochemistry'],
    vocationalPaths: ['Emergency Medical Technician (EMT)', 'Medical Assistant', 'Phlebotomist'],
    certifications: ['Medical License (National Medical Board Examination)', 'USMLE / GMC Registration', 'Board Specialty Certification'],
    portfolioExamples: ['Published case report in student medical journal', 'Community health screening volunteer leadership', 'Undergraduate biology thesis on antibiotic resistance'],
    beginnerProjects: ['Complete a certified First Aid & CPR course', 'Volunteer at a local hospital or nursing home to observe patient interactions', 'Shadow a family physician for a day to observe real clinical workflow'],
    progressionPath: {
      entry: 'Medical Resident (hands-on hospital rounds under attending physician supervision)',
      mid: 'Attending Physician (independent practice, specialty diagnosis)',
      senior: 'Chief of Department / Medical Director / Professor of Medicine'
    },
    workStyle: 'Intense human connection, fast-paced clinical diagnostic decisions, long hours requiring high stamina',
    challenges: ['High emotional stress and burnout risk', 'Long educational path before independent practice', 'Heavy administrative burden'],
    advantages: ['Highest societal respect and profound emotional reward', 'Recession-proof employment anywhere in the world', 'High lifelong earnings'],
    futureTrends: 'AI-assisted medical imaging and diagnostic triage, telemedicine remote care, personalized genomic therapies.',
    salaryInfo: {
      rangeDescription: 'Top tier professional compensation once residency training is completed.',
      disclaimer: 'Example / illustrative information - requires local verification.',
      levelIndicator: 'Very High'
    },
    experiments: [
      {
        title: 'Take a Free Online First Aid & CPR Training Module',
        duration: '2 Hours',
        difficulty: 'Beginner',
        description: 'Learn the primary DRSABCD emergency response protocol and practice pulse checking and triage decision trees.',
        steps: ['Register for an introductory Red Cross / St John First Aid course', 'Learn how to recognize stroke (FAST protocol)', 'Practice on a volunteer mannequin or family member'],
        expectedOutcome: 'Discover how you react to emergency protocols and caring for biological needs.'
      }
    ],
    alternativeCareers: [
      { careerId: 'biomedical-engineer', title: 'Biomedical Engineer', similarityReason: 'Both dedicated to advancing human health', distinction: 'Biomedical engineers build technology; doctors apply it to patients face-to-face.' },
      { careerId: 'clinical-psychologist', title: 'Clinical Child & Adolescent Psychologist', similarityReason: 'Both diagnose and care for human ailments', distinction: 'Psychologists specialize in mental health, emotional development, and psychotherapy without pharmaceutical surgery.' }
    ],
    source: 'EduPath Career Knowledge Base v2.4 (O*NET 29-1229.00)',
    lastUpdated: '2026-09'
  },
  {
    id: 'product-manager',
    title: 'Product Manager (Tech & Digital)',
    aliases: ['Digital Product Manager', 'Associate Product Manager (APM)', 'Technical Product Manager'],
    description: 'Drives the strategy, roadmap, and execution of technology products by aligning software engineers, UI/UX designers, and business executives around user needs.',
    careerCluster: 'Business',
    industry: 'Technology & Enterprise Business',
    tasks: [
      'Interview customers and analyze usage metrics to identify core user pain points',
      'Define product requirements, user stories, and acceptance criteria in agile PRDs',
      'Prioritize product backlog and feature releases based on business impact and engineering effort',
      'Collaborate closely with tech leads and UX designers during sprint planning',
      'Track key product KPIs (retention, conversion, revenue, NPS) and iterate post-launch'
    ],
    responsibilities: [
      'Delivering product-market fit and maximizing user value',
      'Aligning cross-functional stakeholders without direct authority',
      'Ensuring features align with corporate strategic goals and profitability'
    ],
    workEnvironment: ['Tech company headquarters', 'Dynamic open collaborative spaces', 'Hybrid / Remote friendly', 'Frequent meetings and presentations'],
    requiredSkills: ['Product Strategy & Roadmapping', 'User Research & Empathy', 'Data Analytics (SQL, Mixpanel, Amplitude)', 'Agile / Scrum Methodologies'],
    recommendedSkills: ['Basic Technical Understanding (APIs, System Architecture)', 'Wireframing (Figma)', 'A/B Testing Methodology', 'Financial Modeling'],
    softSkills: ['Influence Without Authority', 'Strategic Prioritization', 'Clear Storytelling', 'Conflict Resolution'],
    technicalSkills: ['Jira', 'Figma', 'SQL', 'Mixpanel', 'Notion / Confluence', 'Google Analytics'],
    relevantSubjects: ['Business Studies', 'Computer Science', 'Economics', 'Psychology', 'English & Communication'],
    relevantInterests: ['Business & Startups', 'Technology Products', 'Leadership & Strategy', 'Understanding How Things Work', 'Team Projects'],
    riaSecProfile: { R: 0.25, I: 0.70, A: 0.55, S: 0.65, E: 0.95, C: 0.60 },
    mbtiCompatibility: ['ENTJ', 'ENTP', 'ENFJ', 'INTJ'],
    educationPaths: [
      {
        type: 'University',
        duration: '4 Years (B.S. in Computer Science, Business Administration, or Engineering)',
        description: 'Combination of technical computational fundamentals and business strategy or finance.',
        tradeoffs: 'Prepares for top APM programs (Google, Meta, Uber); requires balance of technical and soft leadership.'
      }
    ],
    relatedMajors: ['Business Administration', 'Computer Science', 'Management Information Systems (MIS)', 'Economics', 'Industrial Engineering'],
    vocationalPaths: ['Associate Product Specialist', 'Agile Scrum Master', 'Customer Success Analyst'],
    certifications: ['Certified Scrum Product Owner (CSPO)', 'Product School PMC Certification', 'Pragmatic Institute Certified'],
    portfolioExamples: ['Comprehensive Product Requirements Document (PRD) for a new Spotify feature', 'Redesign teardown of Airbnb onboarding with metric hypotheses', 'Side-project app launched with 500 active beta users'],
    beginnerProjects: ['Analyze your favorite mobile app: identify 1 glaring flaw and write a 1-page proposal on how to fix it', 'Create a clickable interactive Figma prototype of a new student homework planner', 'Conduct 3 user interviews with classmates about their biggest frustration with school apps'],
    progressionPath: {
      entry: 'Associate Product Manager (APM) (feature scoping, analytics tracking, daily standups)',
      mid: 'Product Manager (owning complete product modules, metric outcomes)',
      senior: 'VP of Product / Chief Product Officer (CPO) (company product portfolio and vision)'
    },
    workStyle: 'High cross-functional communication, synthesizing data with intuition, decisive prioritization',
    challenges: ['High responsibility without direct line-management authority', 'Context switching across meetings', 'Ambiguity and shifting trade-offs'],
    advantages: ['Direct influence over what gets built and how people interact with technology', 'Mini-CEO experience', 'Strong executive path'],
    futureTrends: 'AI-first product management, automated telemetry analysis, hyper-personalized consumer experiences.',
    salaryInfo: {
      rangeDescription: 'High compensation comparable to senior software engineering tracks.',
      disclaimer: 'Example / illustrative information - requires local verification.',
      levelIndicator: 'Very High'
    },
    experiments: [
      {
        title: 'Conduct an App Teardown and Write a 1-Page PRD',
        duration: '3 Hours',
        difficulty: 'Beginner',
        description: 'Pick an app you use daily (e.g. YouTube or Duolingo). Identify one feature that annoys you, interview 2 friends, and draft a 1-page solution doc.',
        steps: ['Draft Problem Statement', 'Describe target persona', 'Propose solution with 3 core user stories', 'Define success metric (e.g. +5% completion)'],
        expectedOutcome: 'Experience how product managers turn messy ideas into actionable engineering blueprints.'
      }
    ],
    alternativeCareers: [
      { careerId: 'software-engineer', title: 'Software Engineer', similarityReason: 'Both build digital software products', distinction: 'Engineers focus on how to build it robustly; PMs focus on what to build and why it matters to users.' },
      { careerId: 'ux-designer', title: 'UI/UX Product Designer', similarityReason: 'Both obsess over user experience and user journeys', distinction: 'Designers craft visual layouts and emotional interaction; PMs manage business viability, scope, and technical trade-offs.' }
    ],
    source: 'EduPath Career Knowledge Base v2.4 (O*NET 11-1021.00 & Product Org Standards)',
    lastUpdated: '2026-09'
  },
  {
    id: 'ux-designer',
    title: 'UI/UX Product Designer',
    aliases: ['User Experience Designer', 'Interaction Designer', 'Product Designer'],
    description: 'Researches user behaviors and crafts intuitive, accessible, and visually captivating digital interfaces for websites, mobile applications, and software tools.',
    careerCluster: 'Design',
    industry: 'Design & Creative Technology',
    tasks: [
      'Conduct user interviews, usability testing, and persona research',
      'Create wireframes, user flow diagrams, and interactive clickable prototypes in Figma',
      'Build and maintain scalable design systems with reusable components, typography, and color tokens',
      'Collaborate with developers to ensure pixel-perfect design implementation',
      'Advocate for digital accessibility (WCAG) and seamless cognitive clarity'
    ],
    responsibilities: [
      'Transforming complex technical workflows into effortless user experiences',
      'Validating design hypotheses with empirical usability testing',
      'Maintaining brand aesthetic consistency across digital touchpoints'
    ],
    workEnvironment: ['Creative design studio or tech office', 'High collaborative design reviews', 'Remote / freelance friendly', 'Visual dual-monitor setups'],
    requiredSkills: ['UI Design (Figma, Sketch)', 'User Research & Usability Testing', 'Interaction Design & Wireframing', 'Information Architecture'],
    recommendedSkills: ['Design Systems & Component Libraries', 'Basic HTML/CSS/JS knowledge', 'Motion & Micro-interactions', 'Accessibility Standards (WCAG)'],
    softSkills: ['Deep Empathy', 'Aesthetic Sensitivity', 'Active Listening', 'Giving & Receiving Constructive Critique'],
    technicalSkills: ['Figma', 'Prototyping', 'Design Systems', 'HTML/CSS Basics', 'User Journey Mapping', 'Miro'],
    relevantSubjects: ['Art & Graphic Design', 'Psychology', 'Computer Science', 'Communication', 'English'],
    relevantInterests: ['Drawing & Visual Arts', 'Technology & Mobile Apps', 'Human Psychology', 'Graphic Layouts', 'Creativity & Aesthetics'],
    riaSecProfile: { R: 0.25, I: 0.65, A: 0.95, S: 0.65, E: 0.45, C: 0.50 },
    mbtiCompatibility: ['INFP', 'ENFP', 'ISFP', 'INFJ'],
    educationPaths: [
      {
        type: 'University',
        duration: '4 Years (B.Des. in Interaction Design, Human-Computer Interaction (HCI), or Graphic Design)',
        description: 'Comprehensive design studio critiques, cognitive psychology, typography, and portfolio synthesis.',
        tradeoffs: 'Strong conceptual foundation and peer network; portfolio quality remains the ultimate hiring gatekeeper.'
      },
      {
        type: 'Self-Taught / Portfolio',
        duration: '6-12 Months intensive portfolio development',
        description: 'Mastering Figma tutorials, completing real client redesigns, and publishing case studies on Behance/Dribbble.',
        tradeoffs: 'High viability in design industry where demonstrable portfolio outshines traditional degrees.'
      }
    ],
    relatedMajors: ['Interaction Design', 'Human-Computer Interaction (HCI)', 'Graphic Design', 'Cognitive Psychology', 'Digital Media'],
    vocationalPaths: ['Junior UI Designer', 'Graphic & Web Designer', 'Design Production Specialist'],
    certifications: ['Google UX Design Professional Certificate', 'Nielsen Norman Group UX Master Certified', 'Interaction Design Foundation Certifications'],
    portfolioExamples: ['Case study redesigning a municipal transport ticketing mobile app with user testing metrics', 'E-commerce mobile checkout flow with 30% fewer taps', 'Comprehensive dark/light design system with 50+ Figma variants'],
    beginnerProjects: ['Pick a bad website and redesign its homepage layout in Figma', 'Create a 5-screen mobile app for tracking daily water intake with smooth interactions', 'Conduct a 15-minute usability test on a family member navigating a shopping website and document their struggles'],
    progressionPath: {
      entry: 'Junior UX/UI Designer (wireframing, UI asset production, user test notes)',
      mid: 'Product Designer (owning complete user journeys, managing design system)',
      senior: 'Staff Designer / Head of Design (design strategy, brand language, creative direction)'
    },
    workStyle: 'Visual, iterative, high empathy, sketching and testing continuously',
    challenges: ['Subjective aesthetic feedback from stakeholders', 'Keeping up with changing platform design guidelines (iOS/Android)', 'Advocating for user needs against commercial pressures'],
    advantages: ['Tangible creative output that millions of people touch every day', 'Thriving freelance and global remote opportunities', 'High career satisfaction'],
    futureTrends: 'Generative AI design tools, spatial computing (AR/VR) interface design, conversational and voice UI, adaptive dynamic layouts.',
    salaryInfo: {
      rangeDescription: 'Strong compensation in tech, with senior designers commanding parity with senior software engineers.',
      disclaimer: 'Example / illustrative information - requires local verification.',
      levelIndicator: 'High'
    },
    experiments: [
      {
        title: 'Create Your First Interactive Mobile Prototype in Figma',
        duration: '2 Hours',
        difficulty: 'Beginner',
        description: 'Sign up for free at Figma.com. Follow a 30-minute tutorial to design 2 mobile app screens and connect them with an interactive click transition.',
        steps: ['Open Figma', 'Use an iPhone frame template', 'Add buttons, text, and an image', 'Use Prototype tab to connect Screen 1 to Screen 2 and hit Play'],
        expectedOutcome: 'Feel the magic of tapping a screen and having an app you created respond.'
      }
    ],
    alternativeCareers: [
      { careerId: 'product-manager', title: 'Product Manager', similarityReason: 'Both champion user needs and design interfaces', distinction: 'Designers focus on visual interaction and usability; PMs manage the overall business viability, schedule, and revenue.' },
      { careerId: 'game-designer', title: 'Game Designer & Developer', similarityReason: 'Both design interactive digital experiences', distinction: 'Game designers focus on player fun, emotional game mechanics, and world rules rather than utility productivity.' }
    ],
    source: 'EduPath Career Knowledge Base v2.4 (O*NET 27-1024.00)',
    lastUpdated: '2026-09'
  },
  {
    id: 'game-designer',
    title: 'Game Designer & Developer',
    aliases: ['Video Game Designer', 'Gameplay Programmer', 'Level Designer'],
    description: 'Conceptualizes and programs gameplay mechanics, rules, balance, narrative worlds, and interactive audio-visual systems for video games on PC, console, and mobile.',
    careerCluster: 'Arts',
    industry: 'Video Game Entertainment & Interactive Media',
    tasks: [
      'Design core game mechanics, reward loops, and progression systems',
      'Script gameplay logic and character movement in Unity (C#) or Unreal Engine (C++/Blueprints)',
      'Design levels, encounter layouts, and environmental storytelling',
      'Conduct playtesting sessions and analyze player telemetry to tune game balance',
      'Collaborate with concept artists, 3D animators, and sound designers'
    ],
    responsibilities: [
      'Creating fun, engaging, and memorable interactive player experiences',
      'Balancing game difficulty and pacing to avoid player boredom or frustration',
      'Optimizing game performance to maintain smooth frame rates on target devices'
    ],
    workEnvironment: ['Game development studio', 'Creative collaborative setting', 'High screen time with gamepad/keyboard testing', 'Game jams and demo milestones'],
    requiredSkills: ['Game Engine (Unity or Unreal Engine)', 'Scripting (C# or C++)', 'Game Balance & Systems Design', 'Level Design & Spatial Awareness'],
    recommendedSkills: ['3D Math & Physics for Games', 'Shaders & Visual Effects', 'Sound Design Integration', 'Narrative Storytelling'],
    softSkills: ['Creative Imagination', 'Patience with Bug Fixing', 'Receptive to Player Feedback', 'Passionate Drive'],
    technicalSkills: ['Unity', 'C#', 'Unreal Engine', 'Blender Basics', 'Git', 'Photoshop Basics'],
    relevantSubjects: ['Computer Science', 'Art & Design', 'Mathematics & Physics', 'Literature & Creative Writing', 'Music'],
    relevantInterests: ['Video Games', 'Storytelling & Worldbuilding', 'Drawing & Animation', 'Coding & Math', 'Puzzles & Board Games'],
    riaSecProfile: { R: 0.50, I: 0.65, A: 0.95, S: 0.35, E: 0.50, C: 0.40 },
    mbtiCompatibility: ['INFP', 'INTP', 'ENFP', 'ENTP'],
    educationPaths: [
      {
        type: 'University',
        duration: '4 Years (B.S. in Game Design, Computer Science, or Interactive Media)',
        description: 'Combines rigorous programming with game history, 3D graphics theory, and multi-semester group game production.',
        tradeoffs: 'Great environment for shipping team capstone games; a finished playable game is the true ticket to employment.'
      },
      {
        type: 'Self-Taught / Portfolio',
        duration: '1-2 Years participating in Global Game Jams and publishing on Itch.io',
        description: 'Building small complete games in Godot, Unity, or Pico-8 and publishing them online.',
        tradeoffs: 'Proven path in indie game development where shipped playable games speak louder than diplomas.'
      }
    ],
    relatedMajors: ['Game Design & Development', 'Computer Science', 'Interactive Media Arts', 'Animation & Digital Arts'],
    vocationalPaths: ['Game QA Playtester', 'Junior Level Scripter', '3D Asset Integrator'],
    certifications: ['Unity Certified User / Professional Programmer', 'Unreal Engine Certified Creator'],
    portfolioExamples: ['Playable 2D platformer published on Itch.io with custom mechanics', 'Unity puzzle game demonstrating procedural level generation', 'Game Design Document (GDD) with economy balance spreadsheet'],
    beginnerProjects: ['Create a Flappy Bird clone in Scratch or Unity following a beginner tutorial', 'Design a playable tabletop board game using index cards and test it with 3 friends', 'Participate in a 48-hour weekend online Game Jam (e.g. Ludum Dare)'],
    progressionPath: {
      entry: 'Junior Gameplay Programmer / Assistant Level Designer (scripting events, fixing collision bugs)',
      mid: 'Game Designer / Senior Programmer (owning core combat or economy systems)',
      senior: 'Creative Director / Game Director (overall vision, art style, franchise leadership)'
    },
    workStyle: 'High creativity blended with rigorous logic, frequent playtest iterations',
    challenges: ['Competitive industry with intense release cycles (crunch)', 'Balancing creative ambition with technical budget', 'Harsh online player reviews'],
    advantages: ['Immense joy seeing players emotionally engaged in worlds you created', 'Billion-dollar global industry surpassing film and music', 'Endless room for artistic innovation'],
    futureTrends: 'Procedural world generation with generative AI, virtual reality experiences, cross-platform cloud streaming games.',
    salaryInfo: {
      rangeDescription: 'Wide variance between indie self-publishing and major AAA corporate studios.',
      disclaimer: 'Example / illustrative information - requires local verification.',
      levelIndicator: 'Above Average'
    },
    experiments: [
      {
        title: 'Make a 2D Game in Scratch or Godot in One Afternoon',
        duration: '3 Hours',
        difficulty: 'Beginner',
        description: 'Go to scratch.mit.edu and build a simple game where a character dodges falling objects and tracks score.',
        steps: ['Create sprite character and backdrop', 'Code arrow keys for movement', 'Code falling apples with clone blocks', 'Add game over condition and score counter'],
        expectedOutcome: 'Discover how game mechanics, rules, and instant player feedback loop together.'
      }
    ],
    alternativeCareers: [
      { careerId: 'software-engineer', title: 'Software Engineer', similarityReason: 'Both write clean code and build digital systems', distinction: 'Software engineers focus on enterprise reliability and business logic; game devs focus on player sensation and 60fps rendering.' },
      { careerId: 'ux-designer', title: 'UI/UX Product Designer', similarityReason: 'Both care about user interaction and cognitive feedback', distinction: 'UX designers remove friction; game designers deliberately introduce fun challenges and calibrated friction.' }
    ],
    source: 'EduPath Career Knowledge Base v2.4 (O*NET 15-1255.01)',
    lastUpdated: '2026-09'
  },
  {
    id: 'environmental-scientist',
    title: 'Environmental & Climate Scientist',
    aliases: ['Environmental Specialist', 'Conservation Scientist', 'Climate Data Analyst'],
    description: 'Studies the natural environment, analyzes pollutants, assesses climate change impacts, and designs conservation and remediation strategies for a sustainable planet.',
    careerCluster: 'Environment',
    industry: 'Environmental Science & Sustainability',
    tasks: [
      'Collect soil, water, air, and plant samples during field expeditions',
      'Perform chemical and biological assays in analytical laboratories',
      'Analyze geospatial satellite imagery and climate models using GIS',
      'Draft Environmental Impact Assessments (EIA) for infrastructure projects',
      'Advise government agencies and corporations on environmental compliance and carbon reduction'
    ],
    responsibilities: [
      'Protecting public ecosystems, wildlife habitats, and human drinking water',
      'Delivering scientifically defensible environmental audit reports',
      'Communicating urgent climate findings objectively to policy makers'
    ],
    workEnvironment: ['Field expeditions (rivers, forests, industrial sites)', 'Analytical chemistry laboratory', 'Office workstation with GIS mapping software'],
    requiredSkills: ['Ecology & Environmental Chemistry', 'Fieldwork & Sampling Protocols', 'GIS (Geographic Information Systems)', 'Data Analysis & Statistics'],
    recommendedSkills: ['Remote Sensing & Satellite Imagery', 'Environmental Law & Policy', 'Hydrology Modeling', 'Python/R for Environmental Data'],
    softSkills: ['Scientific Rigor', 'Passion for Nature & Conservation', 'Clear Technical Writing', 'Physical Resilience Outdoors'],
    technicalSkills: ['QGIS / ArcGIS', 'R / Python', 'Spectrophotometry', 'Water Quality Meters', 'GPS Mapping'],
    relevantSubjects: ['Biology', 'Chemistry', 'Geography', 'Physics', 'Mathematics'],
    relevantInterests: ['Nature & Outdoors', 'Climate Action & Conservation', 'Science Experiments', 'Wildlife Protection', 'Geography & Maps'],
    riaSecProfile: { R: 0.75, I: 0.90, A: 0.35, S: 0.60, E: 0.40, C: 0.65 },
    mbtiCompatibility: ['INFJ', 'INFP', 'INTJ', 'ISFP'],
    educationPaths: [
      {
        type: 'University',
        duration: '4-6 Years (B.S. or M.S. in Environmental Science, Ecology, or Earth Sciences)',
        description: 'Comprehensive study of earth systems, geochemical cycles, environmental policy, and field ecology research.',
        tradeoffs: 'Core pathway for scientific credibility and consulting licenses; M.S. often preferred for senior research.'
      }
    ],
    relatedMajors: ['Environmental Science', 'Ecology', 'Earth & Planetary Sciences', 'Environmental Engineering', 'Geography'],
    vocationalPaths: ['Environmental Sampling Technician', 'Wastewater Treatment Operator', 'Forest Ranger Assistant'],
    certifications: ['Certified Environmental Scientist (CES)', 'OSHA HAZWOPER Certification', 'GIS Professional (GISP)'],
    portfolioExamples: ['Local watershed nitrate pollution investigation report with GIS maps', 'Urban heat island analysis using satellite thermal bands in Google Earth Engine', 'Biodiversity census of native pollinators in a regional park'],
    beginnerProjects: ['Test tap water and local pond water using a home pH and chemical test kit', 'Map tree canopy coverage in your neighborhood using Google Earth Engine', 'Conduct a 1-week home plastic waste audit and calculate carbon footprint'],
    progressionPath: {
      entry: 'Junior Field Scientist / Environmental Technician (collecting samples, lab testing, data logging)',
      mid: 'Environmental Consultant / Project Scientist (managing EIA reports, remediation plans)',
      senior: 'Principal Environmental Scientist / Director of Sustainability'
    },
    workStyle: 'Splits time between outdoor fieldwork in natural elements, clean lab analysis, and geospatial report writing',
    challenges: ['Fieldwork in harsh weather conditions', 'Frustrations with slow policy implementation', 'Balancing commercial development with conservation'],
    advantages: ['Working outdoors in nature', 'Deep moral alignment with safeguarding the planet for future generations', 'Rapidly growing ESG corporate demand'],
    futureTrends: 'Carbon credit verification, satellite drone ecological monitoring, climate risk modeling for financial markets.',
    salaryInfo: {
      rangeDescription: 'Solid public sector and expanding corporate sustainability consulting compensation.',
      disclaimer: 'Example / illustrative information - requires local verification.',
      levelIndicator: 'Moderate'
    },
    experiments: [
      {
        title: 'Investigate Local Water Quality with a Test Kit',
        duration: '2 Hours',
        difficulty: 'Beginner',
        description: 'Use a low-cost aquarium test strip kit to test tap water, bottled water, and local stream water for pH, hardness, and nitrates.',
        steps: ['Dip test strips in 3 different water samples', 'Record values in a spreadsheet table', 'Compare results against WHO drinking water guidelines'],
        expectedOutcome: 'Experience how environmental scientists collect physical data to monitor ecological health.'
      }
    ],
    alternativeCareers: [
      { careerId: 'architect-urban-planner', title: 'Architect & Sustainable Urban Planner', similarityReason: 'Both focus on human impact on habitats and sustainability', distinction: 'Architects design built structures; environmental scientists study and protect natural ecosystems.' },
      { careerId: 'biomedical-scientist', title: 'Biomedical & Genomics Researcher', similarityReason: 'Both conduct rigorous laboratory assays and research', distinction: 'Biomedical scientists focus on human disease mechanisms; environmental scientists on ecological ecosystems.' }
    ],
    source: 'EduPath Career Knowledge Base v2.4 (O*NET 19-2041.00)',
    lastUpdated: '2026-09'
  },
  {
    id: 'architect-urban-planner',
    title: 'Architect & Sustainable Urban Planner',
    aliases: ['Architect', 'Urban Designer', 'City Planner'],
    description: 'Plans, designs, and oversees the construction of buildings, urban spaces, and transit networks balancing aesthetics, environmental sustainability, structural safety, and human community needs.',
    careerCluster: 'Architecture',
    industry: 'Architecture, Construction & Urban Planning',
    tasks: [
      'Develop conceptual architectural drawings and physical/3D digital models',
      'Coordinate with structural, mechanical, and civil engineers on building systems',
      'Incorporate green building principles (solar orientation, natural ventilation, low-carbon materials)',
      'Review municipal zoning laws, building codes, and accessibility compliance',
      'Conduct site inspections during construction to ensure fidelity to blueprints'
    ],
    responsibilities: [
      'Ensuring life-safety, fire resistance, and structural integrity of inhabited spaces',
      'Designing functional spaces that enhance community well-being and reduce energy consumption',
      'Managing client budgets and contractor relationships'
    ],
    workEnvironment: ['Architectural design studio', 'Active construction sites with hard hats', 'City hall planning hearings'],
    requiredSkills: ['Architectural Drawing & Spatial Visualization', 'CAD & BIM Software (Revit, AutoCAD, Rhino)', 'Sustainable Building Concepts (LEED/BREEAM)', 'Building Codes & Structural Basics'],
    recommendedSkills: ['Parametric Design (Grasshopper)', '3D Rendering (V-Ray, Lumion)', 'Urban GIS Mapping', 'Physical Model Making'],
    softSkills: ['Creative Vision', 'Client Presentation', 'Diplomatic Collaboration', 'Spatial Intuition'],
    technicalSkills: ['Revit', 'AutoCAD', 'Rhino', 'SketchUp', 'Photoshop', 'Lumion'],
    relevantSubjects: ['Art & Design', 'Mathematics (Geometry)', 'Physics', 'Geography', 'History'],
    relevantInterests: ['Drawing & Architecture', 'City Planning & Transit', 'Building Things', 'Sustainable Design', 'Art & Culture'],
    riaSecProfile: { R: 0.65, I: 0.70, A: 0.95, S: 0.40, E: 0.55, C: 0.55 },
    mbtiCompatibility: ['INTJ', 'INFJ', 'INFP', 'ENTP'],
    educationPaths: [
      {
        type: 'University',
        duration: '5 Years (B.Arch professional degree) or 4+2 Years (B.A. + M.Arch)',
        description: 'Accredited professional architectural degree with heavy studio design coursework, structural engineering, and history.',
        tradeoffs: 'Mandatory pathway for licensed professional architect stamping rights; intensive studio hours.'
      }
    ],
    relatedMajors: ['Architecture', 'Urban Planning', 'Landscape Architecture', 'Interior Architecture', 'Civil Engineering'],
    vocationalPaths: ['CAD Draftsperson', 'BIM Modeler', 'Construction Estimator'],
    certifications: ['Licensed Registered Architect (AIA / RIBA / National Board)', 'LEED Green Associate / AP'],
    portfolioExamples: ['Design portfolio featuring a community library with passive solar shading', 'Revit BIM model of a mixed-use apartment complex with material schedules', 'Urban redesign of a pedestrian street corridor with bike transit lanes'],
    beginnerProjects: ['Draw scaled floor plans of your own bedroom and propose a creative furniture optimization', 'Build a 3D model of a modern house in free SketchUp or Minecraft Architecture mode', 'Photograph 5 historical and modern buildings in your town and analyze their structural style'],
    progressionPath: {
      entry: 'Junior Architectural Intern (drafting detail sections, 3D renderings, site measure-ups)',
      mid: 'Project Architect (managing complete building design packages, coordinating consultants)',
      senior: 'Partner / Principal Architect (winning major commissions, firm leadership)'
    },
    workStyle: 'Studio design culture, sketching by hand and on computer, collaborating with engineering specialists',
    challenges: ['Long studio hours and demanding licensing exams', 'Balancing artistic vision against strict construction budgets', 'Liable for building safety'],
    advantages: ['Leaving lasting physical monuments on the city skyline that stand for generations', 'Rare fusion of high art and rigorous engineering', 'Prestigious profession'],
    futureTrends: 'Net-zero energy buildings, mass timber construction, automated AI generative layouts, resilient urban sponge cities.',
    salaryInfo: {
      rangeDescription: 'Steadily increasing compensation with licensure and firm partnership.',
      disclaimer: 'Example / illustrative information - requires local verification.',
      levelIndicator: 'Above Average'
    },
    experiments: [
      {
        title: 'Design a Tiny House in Free SketchUp Web',
        duration: '3 Hours',
        difficulty: 'Beginner',
        description: 'Use the free browser version of SketchUp to design a 200 sq ft sustainable tiny house with a living room, loft bed, and solar roof.',
        steps: ['Open SketchUp for Web', 'Draw the exterior foundation rectangle', 'Use Push/Pull tool to extrude 3D walls', 'Add windows, door, and solar panels'],
        expectedOutcome: 'Experience how architects manipulate three-dimensional space and functional living layouts.'
      }
    ],
    alternativeCareers: [
      { careerId: 'environmental-scientist', title: 'Environmental & Climate Scientist', similarityReason: 'Both promote ecological sustainability and resource conservation', distinction: 'Architects design the built urban environment; environmental scientists analyze natural ecological systems.' },
      { careerId: 'ux-designer', title: 'UI/UX Product Designer', similarityReason: 'Both design human spaces and user interactions', distinction: 'Architects build physical 3D spaces with concrete and glass; UX designers build digital 2D/spatial interfaces.' }
    ],
    source: 'EduPath Career Knowledge Base v2.4 (O*NET 17-1011.00)',
    lastUpdated: '2026-09'
  },
  {
    id: 'financial-analyst',
    title: 'Quantitative Financial Analyst',
    aliases: ['Financial Analyst', 'Quant Trader', 'Investment Analyst'],
    description: 'Applies mathematical models, statistical algorithms, and financial data analysis to evaluate investment risks, value assets, and optimize financial portfolios.',
    careerCluster: 'Finance',
    industry: 'Financial Services & Investment Banking',
    tasks: [
      'Construct financial valuation models (DCF, Multiples) and algorithmic trading strategies',
      'Analyze corporate balance sheets, quarterly earnings, and macroeconomic indicators',
      'Write Python scripts to backtest trading hypotheses against historical market data',
      'Present investment memoranda and risk assessment reports to portfolio managers',
      'Monitor market volatility, interest rate fluctuations, and regulatory capital requirements'
    ],
    responsibilities: [
      'Guarding capital against downside risk and liquidity crises',
      'Delivering rigorous, objective financial valuation numbers',
      'Maintaining compliance with securities regulations (SEC, FINRA)'
    ],
    workEnvironment: ['Financial district office / Investment bank', 'Fast-paced trading floor or asset management office', 'Dual/triple Bloomberg terminal screens'],
    requiredSkills: ['Financial Modeling & Accounting Principles', 'Advanced Excel (VBA, PowerQuery)', 'Python or R for Financial Data', 'Statistics & Probability'],
    recommendedSkills: ['Bloomberg Terminal / FactSet', 'Stochastic Calculus & Time-Series Analysis', 'SQL Database Querying', 'Corporate Finance Law'],
    softSkills: ['High Analytical Acumen', 'Emotional Discipline Under Market Volatility', 'High Attention to Detail', 'Articulate Financial Presentation'],
    technicalSkills: ['Excel', 'Python', 'SQL', 'Bloomberg Terminal', 'PowerBI', 'Pandas'],
    relevantSubjects: ['Mathematics', 'Economics', 'Business Studies', 'Computer Science', 'Statistics'],
    relevantInterests: ['Stock Market & Investing', 'Mathematics & Probability', 'Business & Economics', 'Strategic Decision Making', 'Puzzles & Odds'],
    riaSecProfile: { R: 0.30, I: 0.85, A: 0.25, S: 0.35, E: 0.90, C: 0.85 },
    mbtiCompatibility: ['ENTJ', 'INTJ', 'ESTJ', 'INTP'],
    educationPaths: [
      {
        type: 'University',
        duration: '4-5 Years (B.S. in Finance, Economics, Financial Mathematics, or Computer Science)',
        description: 'Rigorous coursework in corporate valuation, options pricing, econometric statistics, and portfolio theory.',
        tradeoffs: 'High recruiting intensity from major financial institutions; intense initial analyst work hours.'
      }
    ],
    relatedMajors: ['Finance', 'Quantitative Finance', 'Economics', 'Applied Mathematics', 'Actuarial Science'],
    vocationalPaths: ['Junior Bookkeeper', 'Credit Risk Assistant', 'Accounts Analyst'],
    certifications: ['Chartered Financial Analyst (CFA)', 'Financial Risk Manager (FRM)', 'Series 7 / 63 Securities Licenses'],
    portfolioExamples: ['Discounted Cash Flow (DCF) valuation model for Apple with sensitivity table', 'Python algorithmic backtester evaluating moving-average crossover strategies on S&P 500', 'Macroeconomic research note on inflation effects on technology equities'],
    beginnerProjects: ['Build a personal budget and investment compound-interest spreadsheet in Google Sheets', 'Participate in a free online stock market simulator (Investopedia Simulator) with $100k virtual money', 'Analyze 1 public company annual report (10-K) and calculate revenue growth and gross margins'],
    progressionPath: {
      entry: 'Financial Analyst (data gathering, model updating, pitch book creation)',
      mid: 'Senior Associate / Portfolio Analyst (independent sector coverage, thesis generation)',
      senior: 'Portfolio Manager / Chief Investment Officer (CIO) (allocating millions in capital)'
    },
    workStyle: 'Data-intensive, fast-paced, high intellectual pressure during market hours',
    challenges: ['High stress tied to market swings and financial losses', 'Long hours during quarterly reporting cycles', 'High competition'],
    advantages: ['Among the highest compensation ceilings in the corporate world', 'Deep understanding of global economies and wealth generation', 'Meritocratic performance feedback'],
    futureTrends: 'AI-driven sentiment analysis of financial filings, automated quantitative execution, decentralized finance risk modeling.',
    salaryInfo: {
      rangeDescription: 'Very high compensation with substantial performance-based bonus structures.',
      disclaimer: 'Example / illustrative information - requires local verification.',
      levelIndicator: 'Very High'
    },
    experiments: [
      {
        title: 'Run a Virtual Stock Portfolio for 2 Weeks',
        duration: '1 Hour setup + daily check',
        difficulty: 'Beginner',
        description: 'Create a free paper-trading account on Investopedia.com. Research 3 companies in different sectors and track their performance.',
        steps: ['Pick 1 tech company, 1 healthcare company, and 1 retail company', 'Read recent news on why their stock moved', 'Log your rationales in a journal'],
        expectedOutcome: 'Understand how market psychology, company earnings, and numbers connect.'
      }
    ],
    alternativeCareers: [
      { careerId: 'ai-data-scientist', title: 'AI & Data Scientist', similarityReason: 'Both use advanced statistical modeling and Python scripts', distinction: 'Quants focus exclusively on financial capital and risk arbitrage; data scientists solve broad tech problems.' },
      { careerId: 'corporate-lawyer', title: 'Corporate & Tech IP Lawyer', similarityReason: 'Both advise corporate executives on high-stakes transactions', distinction: 'Financial analysts focus on numbers, valuation, and market risk; lawyers focus on legal liability and contract structure.' }
    ],
    source: 'EduPath Career Knowledge Base v2.4 (O*NET 13-2051.00)',
    lastUpdated: '2026-09'
  },
  {
    id: 'clinical-psychologist',
    title: 'Clinical Child & Adolescent Psychologist',
    aliases: ['Child Psychologist', 'School Psychologist', 'Behavioral Therapist'],
    description: 'Assesses, diagnoses, and treats mental health challenges, emotional difficulties, learning disabilities, and behavioral disorders in children and adolescents.',
    careerCluster: 'Social Services',
    industry: 'Mental Health & Healthcare',
    tasks: [
      'Conduct psychological evaluations, cognitive assessments, and behavioral observations',
      'Provide evidence-based psychotherapy (CBT, Play Therapy, Family Therapy)',
      'Formulate tailored treatment plans in collaboration with parents, pediatricians, and schools',
      'Crisis intervention and suicide risk assessment for distressed youth',
      'Write comprehensive clinical assessment reports with accommodation recommendations'
    ],
    responsibilities: [
      'Protecting the emotional well-being and safety of vulnerable children',
      'Maintaining strict patient confidentiality and mandatory reporting ethics',
      'Empathic de-escalation of acute emotional distress'
    ],
    workEnvironment: ['Private clinical therapy practice', 'Children hospital / pediatric mental health ward', 'Schools and youth counseling centers'],
    requiredSkills: ['Child Psychological Development Theories', 'Cognitive Behavioral Therapy (CBT)', 'Diagnostic Assessment (DSM-5)', 'Active Empathetic Listening'],
    recommendedSkills: ['Play Therapy Techniques', 'Neurodivergence (ADHD / Autism) Assessment', 'Crisis Counseling', 'Family Systems Therapy'],
    softSkills: ['Profound Empathy', 'Patience & Non-judgmental Warmth', 'Strong Emotional Boundaries', 'Perceptive Observation'],
    technicalSkills: ['Standardized IQ/Cognitive Testing (WISC)', 'Play Therapy Tools', 'Electronic Clinical Notes', 'Behavioral Rating Scales'],
    relevantSubjects: ['Psychology', 'Biology', 'English & Literature', 'Sociology', 'Statistics'],
    relevantInterests: ['Understanding Human Behavior', 'Helping Troubled Children', 'Mental Health & Well-being', 'Listening & Counseling', 'Child Development'],
    riaSecProfile: { R: 0.20, I: 0.85, A: 0.45, S: 0.95, E: 0.45, C: 0.50 },
    mbtiCompatibility: ['INFJ', 'ENFJ', 'INFP', 'ISFJ'],
    educationPaths: [
      {
        type: 'University',
        duration: '7-9 Years (B.A./B.S. in Psychology + Ph.D./Psy.D. in Clinical Psychology + Clinical Internship)',
        description: 'Doctoral level clinical training, dissertation research, and 2,000+ hours of supervised clinical psychotherapy practice.',
        tradeoffs: 'Required for licensed clinical psychologist status and independent diagnostic authority.'
      },
      {
        type: 'University',
        duration: '5-6 Years (B.S. + M.S. in School Counseling or Social Work LMFT/LCSW)',
        description: 'Focus on school counseling, youth mental health support, and community therapy.',
        tradeoffs: 'Faster entry into practice with lower tuition, though with slightly restricted scope compared to doctoral psychologists.'
      }
    ],
    relatedMajors: ['Psychology', 'Child Development', 'Social Work', 'Cognitive Science', 'Neuroscience'],
    vocationalPaths: ['Mental Health Technician', 'Behavioral Aide / Paraprofessional', 'Youth Center Coordinator'],
    certifications: ['Licensed Clinical Psychologist (State Licensing Board)', 'Board Certified Behavior Analyst (BCBA)'],
    portfolioExamples: ['Undergraduate honors thesis on peer relationship effects on adolescent anxiety', 'Published psychoeducational guide for parents supporting ADHD teenagers', 'Supervised 100-hour practicum portfolio at a children community center'],
    beginnerProjects: ['Volunteer with a supervised youth mentoring or crisis peer-support helpline', 'Read Viktor Frankl "Man Search for Meaning" or Daniel Kahneman "Thinking, Fast and Slow"', 'Conduct an observational study (ethically anonymous) on playground social dynamics during recess'],
    progressionPath: {
      entry: 'Clinical Psychology Intern / Resident (supervised psychotherapy sessions, diagnostic testing)',
      mid: 'Licensed Clinical Psychologist (independent therapy practice, school district consultant)',
      senior: 'Clinical Director / Professor of Child Psychology'
    },
    workStyle: 'Deep 1-on-1 human connection, careful emotional attunement, thoughtful clinical documentation',
    challenges: ['Secondary traumatic stress and compassion fatigue', 'Navigating complicated and resistant family dynamics', 'Strict ethical responsibilities'],
    advantages: ['Profoundly transforming a young person life trajectory and mental health', 'Deeply meaningful work', 'High autonomy in private practice'],
    futureTrends: 'Digital mental health apps and tele-therapy, trauma-informed schooling, neurodivergence-affirming therapeutic models.',
    salaryInfo: {
      rangeDescription: 'Strong compensation especially in established private practice and specialized pediatric centers.',
      disclaimer: 'Example / illustrative information - requires local verification.',
      levelIndicator: 'Above Average'
    },
    experiments: [
      {
        title: 'Practice Active Listening and Empathy Mapping',
        duration: '2 Hours',
        difficulty: 'Beginner',
        description: 'Have a 15-minute conversation with a friend going through stress without giving any advice. Practice reflective listening ("What I hear you saying is...") and note how it changes their demeanor.',
        steps: ['Choose a quiet setting', 'Ask open questions without interrupting', 'Reflect emotions and summarize', 'Reflect on your own emotional state after the session'],
        expectedOutcome: 'Discover whether holding emotional space for others energizes you or drains your energy.'
      }
    ],
    alternativeCareers: [
      { careerId: 'physician-doctor', title: 'Physician / Clinical Doctor', similarityReason: 'Both care for human health and diagnose conditions', distinction: 'Psychologists specialize in psychological therapy and cognitive behavior without prescribing surgeries or bodily medications.' },
      { careerId: 'educational-technologist', title: 'Educational Technologist', similarityReason: 'Both seek to optimize youth learning and development', distinction: 'Educational technologists focus on digital learning tools; psychologists focus on deep emotional and cognitive well-being.' }
    ],
    source: 'EduPath Career Knowledge Base v2.4 (O*NET 19-3031.00)',
    lastUpdated: '2026-09'
  },
  {
    id: 'educational-technologist',
    title: 'Educational Technologist & Instructional Designer',
    aliases: ['Learning Experience Designer (LXD)', 'Instructional Technologist', 'EdTech Specialist'],
    description: 'Designs effective digital learning experiences, interactive curricula, and educational software integrating pedagogy with modern technology for schools, universities, and corporate training.',
    careerCluster: 'Education',
    industry: 'Education Technology & Online Learning',
    tasks: [
      'Analyze learner profiles and pedagogical needs to design curriculum structures',
      'Create interactive e-learning modules, quizzes, and simulations using modern authoring tools',
      'Integrate Learning Management Systems (Canvas, Blackboard, Moodle) with adaptive learning software',
      'Train teachers, university professors, and corporate mentors on effective digital teaching methodologies',
      'Evaluate learning analytics to identify where students struggle and refine educational content'
    ],
    responsibilities: [
      'Ensuring learning materials are cognitively engaging and pedagogically sound',
      'Adhering to universal design for learning (UDL) and accessibility standards',
      'Maximizing learner completion, retention, and skill mastery'
    ],
    workEnvironment: ['Universities and school districts', 'EdTech startups (Duolingo, Khan Academy, Coursera)', 'Remote / hybrid friendly', 'Creative multimedia production spaces'],
    requiredSkills: ['Instructional Design Models (ADDIE, SAM)', 'Learning Management Systems (LMS)', 'E-learning Authoring Tools (Articulate Storyline, Rise)', 'Pedagogical Learning Theory'],
    recommendedSkills: ['Multimedia Production (Video, Audio, Graphics)', 'Basic Web Development (HTML/CSS/JS)', 'Gamification in Education', 'Learning Analytics (xAPI / SCORM)'],
    softSkills: ['Empathy for Diverse Learners', 'Pedagogical Clarity', 'Creative Communication', 'Patience & Mentorship'],
    technicalSkills: ['Articulate Storyline', 'Canvas LMS', 'Camtasia / Premiere', 'Figma', 'Moodle', 'HTML/CSS'],
    relevantSubjects: ['Education', 'Psychology', 'Computer Science', 'English & Communication', 'Art & Media'],
    relevantInterests: ['Teaching & Explaining', 'Education & Technology', 'Making Learning Fun', 'Creative Writing & Multimedia', 'Helping Others Learn'],
    riaSecProfile: { R: 0.30, I: 0.70, A: 0.80, S: 0.90, E: 0.55, C: 0.60 },
    mbtiCompatibility: ['ENFJ', 'INFJ', 'ENFP', 'INFP'],
    educationPaths: [
      {
        type: 'University',
        duration: '4-6 Years (B.A. in Education or Multimedia + M.S. in Instructional Design / EdTech)',
        description: 'Comprehensive study of cognitive learning sciences, digital media creation, and educational measurement.',
        tradeoffs: 'Gold standard for university instructional design jobs and senior corporate EdTech leadership.'
      }
    ],
    relatedMajors: ['Instructional Design', 'Educational Technology', 'Education / Pedagogy', 'Cognitive Science', 'Digital Media'],
    vocationalPaths: ['E-Learning Content Developer', 'LMS Administrator', 'Corporate Training Coordinator'],
    certifications: ['Certified Professional in Learning and Performance (CPLP)', 'ATD Instructional Design Certificate'],
    portfolioExamples: ['Gamified interactive biology module on cell mitosis built in Articulate Storyline', 'Complete 4-week micro-learning course designed for mobile corporate training', 'Instructional design evaluation report on student dropout rates in an online math course'],
    beginnerProjects: ['Create a 5-minute interactive video lesson teaching a topic you love (e.g. guitar basics or chess)', 'Build a fun interactive educational quiz on Kahoot! or Quizizz with feedback explanations', 'Redesign a confusing textbook chapter into a clear visual infographic summary'],
    progressionPath: {
      entry: 'Junior Instructional Designer / E-learning Developer (authoring modules, graphic assets)',
      mid: 'Senior Learning Experience Designer (curriculum architecture, pedagogical consulting)',
      senior: 'Director of Learning Innovation / Head of EdTech'
    },
    workStyle: 'Collaborative, creative, focused on breaking down complex knowledge into joyful simple steps',
    challenges: ['Educator resistance to new digital tools', 'Balancing flashy tech against genuine pedagogical efficacy', 'Tight production schedules'],
    advantages: ['Direct impact on how future generations acquire knowledge', 'Rapidly growing global e-learning market', 'Creative and meaningful daily work'],
    futureTrends: 'AI-personalized adaptive tutors, immersive VR educational field trips, micro-credential skill verification.',
    salaryInfo: {
      rangeDescription: 'Competitive compensation in corporate training and EdTech tech companies.',
      disclaimer: 'Example / illustrative information - requires local verification.',
      levelIndicator: 'Above Average'
    },
    experiments: [
      {
        title: 'Design an Interactive Micro-Lesson on a Free Tool',
        duration: '2 Hours',
        difficulty: 'Beginner',
        description: 'Use a free tool like Genially or Canva to design a 5-slide interactive lesson on any subject (e.g. how photosynthesis works). Add interactive clickable hotspots and a final check-for-understanding quiz.',
        steps: ['Define 1 clear learning objective', 'Write concise explanatory text with visuals', 'Add a 3-question quiz with feedback explanations for wrong answers', 'Share with a friend and see if they learn the concept'],
        expectedOutcome: 'Experience how instructional designers architect mental understanding through structured digital media.'
      }
    ],
    alternativeCareers: [
      { careerId: 'ux-designer', title: 'UI/UX Product Designer', similarityReason: 'Both design human digital interfaces and reduce cognitive friction', distinction: 'UX designers focus on app utility and ease of use; EdTech specialists focus on long-term cognitive learning and knowledge retention.' },
      { careerId: 'clinical-psychologist', title: 'Clinical Child & Adolescent Psychologist', similarityReason: 'Both understand child development and cognitive barriers', distinction: 'EdTech specialists build curriculum technology; psychologists provide clinical mental health therapy.' }
    ],
    source: 'EduPath Career Knowledge Base v2.4 (O*NET 25-9031.00)',
    lastUpdated: '2026-09'
  },
  {
    id: 'precision-automation-technician',
    title: 'Precision Automation & CNC Specialist',
    aliases: ['CNC Machinist / Programmer', 'Advanced Manufacturing Technician', 'Industrial Robotics Technician'],
    description: 'Sets up, programs, and operates computer numerically controlled (CNC) machines, laser cutters, and automated fabrication systems to produce high-precision aerospace, medical, and automotive components.',
    careerCluster: 'Manufacturing',
    industry: 'Advanced Precision Manufacturing & Skilled Trades',
    tasks: [
      'Interpret engineering blueprints and geometric dimensioning & tolerancing (GD&T)',
      'Program multi-axis CNC mills and lathes using CAM software (Mastercam, Fusion 360)',
      'Set up cutting tools, work-holding fixtures, and calibrate automated robotic part loaders',
      'Inspect machined parts using micrometers, calipers, and coordinate measuring machines (CMM)',
      'Perform preventative maintenance on high-speed spindles and hydraulic systems'
    ],
    responsibilities: [
      'Maintaining microscopic tolerances (often within 0.005 millimeters / 5 microns)',
      'Preventing expensive machine tool crashes through thorough simulation verification',
      'Upholding workshop safety and personal protective equipment standards'
    ],
    workEnvironment: ['High-tech climate-controlled manufacturing facility', 'Precision machine shop', 'Surrounded by multi-axis robotic machines and cutting fluid'],
    requiredSkills: ['Blueprint Reading & GD&T', 'G-code & M-code Programming', 'Precision Measurement (Micrometers, CMM)', 'Machining Physics & Material Speeds/Feeds'],
    recommendedSkills: ['CAM Software (Mastercam, Fusion 360)', '5-Axis Machining', 'Industrial Hydraulics & Pneumatics', 'Toolpath Optimization'],
    softSkills: ['Spatial Visualization', 'Meticulous Attention to Detail', 'Problem Solving on the Shop Floor', 'Physical Reliability'],
    technicalSkills: ['G-Code', 'Fusion 360 CAM', 'Mastercam', 'Micrometer / Caliper', 'CNC Mill / Lathe Operation'],
    relevantSubjects: ['Design & Technology', 'Mathematics (Geometry & Trig)', 'Physics', 'Metalworking / Woodworking'],
    relevantInterests: ['Hands-on Making', 'Machines & Tools', 'Metalworking & Fabrication', 'Precision Engineering', 'Car Engines & Mechanics'],
    riaSecProfile: { R: 0.95, I: 0.60, A: 0.25, S: 0.20, E: 0.35, C: 0.85 },
    mbtiCompatibility: ['ISTP', 'ISTJ', 'ESTP'],
    educationPaths: [
      {
        type: 'College/Vocational',
        duration: '1-2 Years (Vocational Certificate or Associate Degree in Precision Machining & CNC)',
        description: 'Hands-on training in machine operation, tooling selection, CAM programming, and shop math.',
        tradeoffs: 'Fastest path to debt-free, high-paying skilled trade employment with immense hiring demand.'
      },
      {
        type: 'Apprenticeship',
        duration: '2-4 Years (Paid Apprenticeship combining on-the-job training with evening classes)',
        description: 'Earn while you learn under the guidance of master toolmakers and machinists.',
        tradeoffs: 'Zero student debt, immediate wage earnings, but requires physical stamina and reliable workshop attendance.'
      }
    ],
    relatedMajors: ['Precision Machining Technology', 'Manufacturing Engineering Technology', 'Industrial Automation', 'Mechanical Technology'],
    vocationalPaths: ['Entry-level Machine Operator', 'Quality Control Inspector', 'Tool & Die Apprentice'],
    certifications: ['NIMS (National Institute for Metalworking Skills) Certifications', 'HAAS CNC Operator Certification'],
    portfolioExamples: ['Finished precision aluminum chess piece machined on a 4-axis mill with 0.01mm tolerance', 'Custom titanium medical bone screw prototype with thread inspection sheet', 'Complete CAM toolpath simulation video showing collision-free cutting strategy'],
    beginnerProjects: ['Visit a local maker space or vocational school and watch a CNC mill cut a part', 'Learn basic G-Code commands (G00, G01, G02) using a free online G-code simulator', 'Model a mechanical bracket in Fusion 360 and generate a 2D engineering drawing with dimensions'],
    progressionPath: {
      entry: 'CNC Operator (loading parts, deburring, checking dimensions with calipers)',
      mid: 'CNC Programmer / Setup Specialist (writing CAM toolpaths, building custom fixtures)',
      senior: 'Shop Floor Manager / Lead Manufacturing Engineer'
    },
    workStyle: 'Hands-on, tangible, pride in physical craftsmanship and mathematical precision',
    challenges: ['Physical standing and shop noise (managed with PPE)', 'High cost of mistakes if a spindle crashes', 'Continuous need to keep up with automated robotic cells'],
    advantages: ['Immense pride in fabricating tangible physical hardware that flies into space or goes into human bodies', 'Outstanding job security with huge shortages of skilled machinists', 'Rapid debt-free career launch'],
    futureTrends: 'Lights-out autonomous manufacturing, hybrid additive (3D printing) + subtractive CNC machines, cobot automated loading.',
    salaryInfo: {
      rangeDescription: 'High starting wages for skilled programmers with overtime potential.',
      disclaimer: 'Example / illustrative information - requires local verification.',
      levelIndicator: 'Above Average'
    },
    experiments: [
      {
        title: 'Run a Virtual G-Code Simulator Online',
        duration: '1.5 Hours',
        difficulty: 'Beginner',
        description: 'Use a free browser tool like ncviewer.com to write 10 lines of G-code to carve your initials into a virtual metal plate and watch the toolpath trace.',
        steps: ['Open NCViewer.com', 'Write G00 X0 Y0 (rapid move), G01 Z-1 F200 (cut down), G01 X20 (cut line)', 'Trace your letter and inspect the 3D toolpath'],
        expectedOutcome: 'Discover the satisfaction of using coordinates and code to shape physical materials.'
      }
    ],
    alternativeCareers: [
      { careerId: 'robotics-engineer', title: 'Robotics & Automation Engineer', similarityReason: 'Both work with automated factory systems and motors', distinction: 'Technicians specialize in precision tooling, physical fabrication, and direct machine setup; engineers design the wider systems.' },
      { careerId: 'architect-urban-planner', title: 'Architect & Sustainable Urban Planner', similarityReason: 'Both read blueprints and manipulate geometric shapes', distinction: 'Machinists fabricate metal components with micron accuracy; architects design buildings.' }
    ],
    source: 'EduPath Career Knowledge Base v2.4 (O*NET 51-4041.00)',
    lastUpdated: '2026-09'
  }
];

export const CAREER_LOOKUP: Record<string, Career> = CAREER_DATABASE.reduce((acc, career) => {
  acc[career.id] = career;
  return acc;
}, {} as Record<string, Career>);
