/**
 * Seed script for Acadin
 * Run: node utils/seedData.js
 *
 * Seeds:
 *  - 30 skill assessment questions
 *  - 5 industry users + profiles
 *  - 16 jobs (8 internships & 8 fulltime placements)
 *  - 8 learning programs (bootcamps, workshops, certifications, mentorships)
 *  - Student users & complete student profiles with mock applications, portfolio & skill scores
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const IndustryProfile = require('../models/IndustryProfile');
const StudentProfile = require('../models/StudentProfile');
const Job = require('../models/Job');
const LearningProgram = require('../models/LearningProgram');
const { QuestionBank } = require('../models/SkillAssessment');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/acadin';

// ─── Questions ────────────────────────────────────────────────────────────────
const questions = [
  // Programming (5)
  {
    category: 'Programming',
    question: 'Which of the following is NOT a programming paradigm?',
    type: 'mcq',
    options: ['Object-Oriented', 'Functional', 'Declarative', 'Sequential'],
    correctAnswer: 'Sequential',
    difficulty: 'easy',
    tags: ['concepts', 'paradigms'],
  },
  {
    category: 'Programming',
    question: 'What does OOP stand for?',
    type: 'mcq',
    options: [
      'Object Oriented Programming',
      'Object Oriented Process',
      'Operational Oriented Programming',
      'None of the above',
    ],
    correctAnswer: 'Object Oriented Programming',
    difficulty: 'easy',
    tags: ['oop'],
  },
  {
    category: 'Programming',
    question: 'What is the time complexity of binary search?',
    type: 'mcq',
    options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
    correctAnswer: 'O(log n)',
    difficulty: 'medium',
    tags: ['algorithms', 'complexity'],
  },
  {
    category: 'Programming',
    question: 'Which keyword is used to define a constant in JavaScript?',
    type: 'mcq',
    options: ['var', 'let', 'const', 'static'],
    correctAnswer: 'const',
    difficulty: 'easy',
    tags: ['javascript'],
  },
  {
    category: 'Programming',
    question: 'A recursive function must always have a base case to avoid infinite loops.',
    type: 'boolean',
    options: ['True', 'False'],
    correctAnswer: 'True',
    difficulty: 'easy',
    tags: ['recursion'],
  },

  // Data Structures (5)
  {
    category: 'Data Structures',
    question: 'Which data structure uses LIFO (Last In, First Out) order?',
    type: 'mcq',
    options: ['Queue', 'Stack', 'Linked List', 'Tree'],
    correctAnswer: 'Stack',
    difficulty: 'easy',
    tags: ['stack'],
  },
  {
    category: 'Data Structures',
    question: 'What is the worst-case time complexity for searching in a Binary Search Tree?',
    type: 'mcq',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    correctAnswer: 'O(n)',
    difficulty: 'medium',
    tags: ['bst', 'complexity'],
  },
  {
    category: 'Data Structures',
    question: 'An array is stored in contiguous memory locations.',
    type: 'boolean',
    options: ['True', 'False'],
    correctAnswer: 'True',
    difficulty: 'easy',
    tags: ['arrays'],
  },
  {
    category: 'Data Structures',
    question: 'Which traversal of a BST gives elements in sorted order?',
    type: 'mcq',
    options: ['Preorder', 'Postorder', 'Inorder', 'Level order'],
    correctAnswer: 'Inorder',
    difficulty: 'medium',
    tags: ['bst', 'traversal'],
  },
  {
    category: 'Data Structures',
    question: 'What data structure is used in implementing BFS (Breadth First Search)?',
    type: 'mcq',
    options: ['Stack', 'Queue', 'Heap', 'Graph'],
    correctAnswer: 'Queue',
    difficulty: 'medium',
    tags: ['bfs', 'graph'],
  },

  // Communication (4)
  {
    category: 'Communication',
    question: 'How would you rate your ability to present technical concepts to non-technical stakeholders?',
    type: 'rating',
    difficulty: 'medium',
    tags: ['presentation', 'soft-skills'],
  },
  {
    category: 'Communication',
    question: 'Active listening involves giving full attention to the speaker and not interrupting.',
    type: 'boolean',
    options: ['True', 'False'],
    correctAnswer: 'True',
    difficulty: 'easy',
    tags: ['listening'],
  },
  {
    category: 'Communication',
    question: 'Which of the following is an example of non-verbal communication?',
    type: 'mcq',
    options: ['Email', 'Phone call', 'Body language', 'Report'],
    correctAnswer: 'Body language',
    difficulty: 'easy',
    tags: ['non-verbal'],
  },
  {
    category: 'Communication',
    question: 'How would you rate your written communication skills (emails, reports)?',
    type: 'rating',
    difficulty: 'easy',
    tags: ['written', 'soft-skills'],
  },

  // Problem Solving (4)
  {
    category: 'Problem Solving',
    question: 'How would you rate your ability to break down complex problems into smaller steps?',
    type: 'rating',
    difficulty: 'medium',
    tags: ['analytical'],
  },
  {
    category: 'Problem Solving',
    question: 'Which approach involves solving a problem by dividing it into overlapping sub-problems?',
    type: 'mcq',
    options: [
      'Greedy Algorithm',
      'Dynamic Programming',
      'Divide and Conquer',
      'Brute Force',
    ],
    correctAnswer: 'Dynamic Programming',
    difficulty: 'hard',
    tags: ['dp', 'algorithms'],
  },
  {
    category: 'Problem Solving',
    question: 'Debugging is an important part of problem solving in software development.',
    type: 'boolean',
    options: ['True', 'False'],
    correctAnswer: 'True',
    difficulty: 'easy',
    tags: ['debugging'],
  },
  {
    category: 'Problem Solving',
    question: 'What does the term "edge case" refer to in problem solving?',
    type: 'mcq',
    options: [
      'The most common scenario',
      'A scenario at the boundary of expected input ranges',
      'An error in the code',
      'The fastest solution',
    ],
    correctAnswer: 'A scenario at the boundary of expected input ranges',
    difficulty: 'medium',
    tags: ['testing', 'edge-cases'],
  },

  // Database (4)
  {
    category: 'Database',
    question: 'What does SQL stand for?',
    type: 'mcq',
    options: [
      'Structured Query Language',
      'Sequential Query Language',
      'Simple Query Language',
      'Standard Query Language',
    ],
    correctAnswer: 'Structured Query Language',
    difficulty: 'easy',
    tags: ['sql'],
  },
  {
    category: 'Database',
    question: 'Which normal form removes partial dependencies?',
    type: 'mcq',
    options: ['1NF', '2NF', '3NF', 'BCNF'],
    correctAnswer: '2NF',
    difficulty: 'hard',
    tags: ['normalization'],
  },
  {
    category: 'Database',
    question: 'A primary key can contain NULL values.',
    type: 'boolean',
    options: ['True', 'False'],
    correctAnswer: 'False',
    difficulty: 'easy',
    tags: ['keys'],
  },
  {
    category: 'Database',
    question: 'MongoDB is an example of a NoSQL database.',
    type: 'boolean',
    options: ['True', 'False'],
    correctAnswer: 'True',
    difficulty: 'easy',
    tags: ['nosql', 'mongodb'],
  },

  // Web Development (4)
  {
    category: 'Web Development',
    question: 'What does CSS stand for?',
    type: 'mcq',
    options: [
      'Creative Style Sheets',
      'Cascading Style Sheets',
      'Computer Style Sheets',
      'Colorful Style Sheets',
    ],
    correctAnswer: 'Cascading Style Sheets',
    difficulty: 'easy',
    tags: ['css'],
  },
  {
    category: 'Web Development',
    question: 'Which HTTP method is used to update a resource?',
    type: 'mcq',
    options: ['GET', 'POST', 'PUT', 'DELETE'],
    correctAnswer: 'PUT',
    difficulty: 'medium',
    tags: ['http', 'rest'],
  },
  {
    category: 'Web Development',
    question: 'React is a JavaScript library for building user interfaces.',
    type: 'boolean',
    options: ['True', 'False'],
    correctAnswer: 'True',
    difficulty: 'easy',
    tags: ['react'],
  },
  {
    category: 'Web Development',
    question: 'How would you rate your experience with building RESTful APIs?',
    type: 'rating',
    difficulty: 'medium',
    tags: ['api', 'backend'],
  },

  // Soft Skills (4)
  {
    category: 'Soft Skills',
    question: 'How would you rate your teamwork and collaboration skills?',
    type: 'rating',
    difficulty: 'easy',
    tags: ['teamwork'],
  },
  {
    category: 'Soft Skills',
    question: 'Time management is a critical soft skill for professionals.',
    type: 'boolean',
    options: ['True', 'False'],
    correctAnswer: 'True',
    difficulty: 'easy',
    tags: ['time-management'],
  },
  {
    category: 'Soft Skills',
    question: 'Which of the following best describes emotional intelligence?',
    type: 'mcq',
    options: [
      'The ability to solve math problems quickly',
      'The ability to recognize and manage emotions in oneself and others',
      'High academic performance',
      'Technical expertise',
    ],
    correctAnswer: 'The ability to recognize and manage emotions in oneself and others',
    difficulty: 'medium',
    tags: ['eq', 'leadership'],
  },
  {
    category: 'Soft Skills',
    question: 'How would you rate your adaptability when facing unexpected changes at work?',
    type: 'rating',
    difficulty: 'medium',
    tags: ['adaptability'],
  },
];

// ─── Industry Users Data ──────────────────────────────────────────────────────
const industryUsersData = [
  {
    user: {
      name: 'TechNova Solutions',
      email: 'hr@technova.com',
      password: 'password123',
      role: 'industry',
    },
    profile: {
      companyName: 'TechNova Solutions',
      industry: 'IT & Cloud Services',
      description: 'Leading software development enterprise specializing in cloud computing, SaaS, and enterprise AI platforms.',
      website: 'https://technova.com',
      linkedin: 'https://linkedin.com/company/technova',
      location: 'Bengaluru, Karnataka',
      size: 'large',
      verified: true,
      contactPerson: {
        name: 'Priya Sharma',
        email: 'priya@technova.com',
        phone: '9876543210',
        designation: 'Head of Talent Acquisition',
      },
    },
  },
  {
    user: {
      name: 'FinEdge Capital',
      email: 'careers@finedge.in',
      password: 'password123',
      role: 'industry',
    },
    profile: {
      companyName: 'FinEdge Capital',
      industry: 'Fintech & Analytics',
      description: 'Fast-growing fintech startup revolutionizing algorithmic trading and risk analytics with deep learning.',
      website: 'https://finedge.in',
      linkedin: 'https://linkedin.com/company/finedge',
      location: 'Mumbai, Maharashtra',
      size: 'startup',
      verified: true,
      contactPerson: {
        name: 'Rahul Verma',
        email: 'rahul@finedge.in',
        phone: '9123456789',
        designation: 'VP Engineering',
      },
    },
  },
  {
    user: {
      name: 'HealthPlus Technologies',
      email: 'jobs@healthplus.io',
      password: 'password123',
      role: 'industry',
    },
    profile: {
      companyName: 'HealthPlus Technologies',
      industry: 'Healthcare & MedTech',
      description: 'Digital health ecosystem connecting healthcare providers and patients via AI diagnostic screening.',
      website: 'https://healthplus.io',
      location: 'Hyderabad, Telangana',
      size: 'medium',
      verified: true,
      contactPerson: {
        name: 'Anita Reddy',
        email: 'anita@healthplus.io',
        phone: '9988776655',
        designation: 'HR Executive',
      },
    },
  },
  {
    user: {
      name: 'GreenBot Robotics',
      email: 'hr@greenbot.tech',
      password: 'password123',
      role: 'industry',
    },
    profile: {
      companyName: 'GreenBot Robotics',
      industry: 'Robotics & Automation',
      description: 'Pioneering autonomous agricultural and industrial robotics for green, zero-emission automation.',
      website: 'https://greenbot.tech',
      location: 'Pune, Maharashtra',
      size: 'small',
      verified: true,
      contactPerson: {
        name: 'Vikram Joshi',
        email: 'vikram@greenbot.tech',
        phone: '9012345678',
        designation: 'CTO & Co-founder',
      },
    },
  },
  {
    user: {
      name: 'EduSpark Learning',
      email: 'talent@eduspark.edu',
      password: 'password123',
      role: 'industry',
    },
    profile: {
      companyName: 'EduSpark Learning',
      industry: 'EdTech & Upskilling',
      description: 'Premier interactive e-learning platform with 3M+ active students in coding, system design, and AI.',
      website: 'https://eduspark.edu',
      linkedin: 'https://linkedin.com/company/eduspark',
      location: 'Delhi, NCR',
      size: 'enterprise',
      verified: true,
      contactPerson: {
        name: 'Neha Kapoor',
        email: 'neha@eduspark.edu',
        phone: '9871234567',
        designation: 'People Operations Lead',
      },
    },
  },
];

// ─── Jobs Data (8 Internships + 8 Placements) ─────────────────────────────────
const getJobsData = (industryUserIds) => [
  // ── 8 Internships ──────────────────────────────────────────────────────────
  {
    postedBy: industryUserIds[0],
    companyName: 'TechNova Solutions',
    title: 'Software Development Intern',
    type: 'internship',
    description:
      'Join our core backend engineering team to build scalable microservices and APIs. You will work with Node.js, Express, MongoDB, and Docker in an Agile sprint cycle.',
    requiredSkills: ['JavaScript', 'Node.js', 'MongoDB'],
    preferredSkills: ['Docker', 'AWS', 'REST API'],
    location: 'Bengaluru, Karnataka',
    mode: 'hybrid',
    duration: '6 months',
    stipend: { amount: 18000, currency: 'INR' },
    eligibility: {
      minCGPA: 7.0,
      branches: ['CSE', 'IT', 'ECE'],
      yearOfStudy: ['3rd Year', '4th Year'],
      degree: ['B.Tech', 'B.E'],
    },
    applicationDeadline: new Date('2026-11-30'),
    openings: 6,
    status: 'active',
  },
  {
    postedBy: industryUserIds[0],
    companyName: 'TechNova Solutions',
    title: 'Frontend Engineer Intern',
    type: 'internship',
    description:
      'Create responsive, lightning-fast web interfaces for enterprise dashboard clients. Work with React 18, Tailwind CSS, TypeScript, and state management.',
    requiredSkills: ['React', 'JavaScript', 'Tailwind CSS'],
    preferredSkills: ['TypeScript', 'Next.js', 'Redux'],
    location: 'Bengaluru, Karnataka',
    mode: 'remote',
    duration: '6 months',
    stipend: { amount: 20000, currency: 'INR' },
    eligibility: {
      minCGPA: 6.8,
      branches: ['CSE', 'IT', 'Any Branch'],
      yearOfStudy: ['3rd Year', '4th Year'],
      degree: ['B.Tech', 'BCA', 'MCA'],
    },
    applicationDeadline: new Date('2026-12-15'),
    openings: 4,
    status: 'active',
  },
  {
    postedBy: industryUserIds[1],
    companyName: 'FinEdge Capital',
    title: 'Data Science & Analyst Intern',
    type: 'internship',
    description:
      'Collaborate with quantitative research teams to analyze stock trends, write automated SQL extraction scripts, and build visual dashboards with Python & Pandas.',
    requiredSkills: ['Python', 'SQL', 'Data Analysis'],
    preferredSkills: ['Power BI', 'Tableau', 'Pandas', 'NumPy'],
    location: 'Mumbai, Maharashtra',
    mode: 'remote',
    duration: '3 months',
    stipend: { amount: 15000, currency: 'INR' },
    eligibility: {
      minCGPA: 7.5,
      branches: ['CSE', 'IT', 'Data Science', 'Mathematics'],
      yearOfStudy: ['3rd Year', '4th Year'],
      degree: ['B.Tech', 'B.Sc', 'M.Sc'],
    },
    applicationDeadline: new Date('2026-10-31'),
    openings: 3,
    status: 'active',
  },
  {
    postedBy: industryUserIds[2],
    companyName: 'HealthPlus Technologies',
    title: 'Mobile App Developer Intern',
    type: 'internship',
    description:
      'Help build cross-platform telemedicine apps in React Native and Flutter. Integrate real-time audio/video consultations and biometric device APIs.',
    requiredSkills: ['React Native', 'JavaScript', 'REST API'],
    preferredSkills: ['Firebase', 'Redux', 'TypeScript', 'Flutter'],
    location: 'Hyderabad, Telangana',
    mode: 'onsite',
    duration: '4 months',
    stipend: { amount: 14000, currency: 'INR' },
    eligibility: {
      minCGPA: 6.5,
      branches: ['CSE', 'IT', 'ECE'],
      yearOfStudy: ['2nd Year', '3rd Year', '4th Year'],
      degree: ['B.Tech', 'MCA'],
    },
    applicationDeadline: new Date('2026-11-20'),
    openings: 3,
    status: 'active',
  },
  {
    postedBy: industryUserIds[3],
    companyName: 'GreenBot Robotics',
    title: 'Embedded Systems & IoT Intern',
    type: 'internship',
    description:
      'Work hands-on with microcontrollers (ESP32, STM32, Arduino) and sensor arrays to develop embedded firmware for agricultural drones and ground rovers.',
    requiredSkills: ['C', 'C++', 'Embedded Systems', 'Arduino'],
    preferredSkills: ['RTOS', 'Raspberry Pi', 'Python', 'PCB Design'],
    location: 'Pune, Maharashtra',
    mode: 'onsite',
    duration: '6 months',
    stipend: { amount: 12000, currency: 'INR' },
    eligibility: {
      minCGPA: 6.5,
      branches: ['ECE', 'EEE', 'Mechatronics', 'CSE'],
      yearOfStudy: ['3rd Year', '4th Year'],
      degree: ['B.Tech', 'B.E'],
    },
    applicationDeadline: new Date('2026-11-15'),
    openings: 4,
    status: 'active',
  },
  {
    postedBy: industryUserIds[4],
    companyName: 'EduSpark Learning',
    title: 'UI/UX Design Intern',
    type: 'internship',
    description:
      'Design delightful mobile and web learning experiences. Create user journeys, high-fidelity wireframes, interactive Figma prototypes, and participate in usability studies.',
    requiredSkills: ['Figma', 'UI Design', 'UX Research', 'Prototyping'],
    preferredSkills: ['Adobe XD', 'Design Systems', 'HTML/CSS'],
    location: 'Delhi, NCR',
    mode: 'remote',
    duration: '3 months',
    stipend: { amount: 12000, currency: 'INR' },
    eligibility: {
      minCGPA: 6.0,
      branches: ['Any Branch', 'Design', 'CSE'],
      yearOfStudy: ['2nd Year', '3rd Year', '4th Year'],
      degree: ['B.Des', 'B.Tech', 'BCA'],
    },
    applicationDeadline: new Date('2026-10-25'),
    openings: 2,
    status: 'active',
  },
  {
    postedBy: industryUserIds[0],
    companyName: 'TechNova Solutions',
    title: 'Cloud & DevOps Intern',
    type: 'internship',
    description:
      'Automate deployment pipelines and manage cloud resources. Gain hands-on exposure with AWS, Docker containerization, Kubernetes clusters, and GitHub Actions CI/CD.',
    requiredSkills: ['Linux', 'Docker', 'AWS', 'Python'],
    preferredSkills: ['Kubernetes', 'CI/CD', 'Terraform', 'Bash'],
    location: 'Bengaluru, Karnataka',
    mode: 'hybrid',
    duration: '6 months',
    stipend: { amount: 22000, currency: 'INR' },
    eligibility: {
      minCGPA: 7.2,
      branches: ['CSE', 'IT', 'ECE'],
      yearOfStudy: ['3rd Year', '4th Year'],
      degree: ['B.Tech', 'M.Tech'],
    },
    applicationDeadline: new Date('2026-12-01'),
    openings: 3,
    status: 'active',
  },
  {
    postedBy: industryUserIds[1],
    companyName: 'FinEdge Capital',
    title: 'Cybersecurity Analyst Intern',
    type: 'internship',
    description:
      'Assist our InfoSec team with vulnerability assessment, code security audits, OWASP top 10 compliance checks, and security event log monitoring.',
    requiredSkills: ['Network Security', 'Python', 'Linux', 'SQL'],
    preferredSkills: ['Ethical Hacking', 'Cryptography', 'Wireshark', 'Burp Suite'],
    location: 'Mumbai, Maharashtra',
    mode: 'hybrid',
    duration: '4 months',
    stipend: { amount: 16000, currency: 'INR' },
    eligibility: {
      minCGPA: 7.0,
      branches: ['CSE', 'IT', 'Cybersecurity'],
      yearOfStudy: ['3rd Year', '4th Year'],
      degree: ['B.Tech', 'B.E'],
    },
    applicationDeadline: new Date('2026-11-10'),
    openings: 2,
    status: 'active',
  },

  // ── 8 Full-Time Placements ─────────────────────────────────────────────────
  {
    postedBy: industryUserIds[0],
    companyName: 'TechNova Solutions',
    title: 'Full Stack Developer',
    type: 'fulltime',
    description:
      'Design, develop, and maintain our enterprise SaaS platform. Work with modern React, Node.js microservices, GraphQL, distributed MongoDB, and Kubernetes.',
    requiredSkills: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
    preferredSkills: ['TypeScript', 'Redis', 'Kubernetes', 'Docker'],
    location: 'Bengaluru, Karnataka',
    mode: 'onsite',
    salary: { min: 800000, max: 1400000, currency: 'INR' },
    eligibility: {
      minCGPA: 6.5,
      branches: ['CSE', 'IT'],
      degree: ['B.Tech', 'M.Tech', 'MCA'],
    },
    applicationDeadline: new Date('2026-12-15'),
    openings: 5,
    status: 'active',
  },
  {
    postedBy: industryUserIds[1],
    companyName: 'FinEdge Capital',
    title: 'Machine Learning Engineer',
    type: 'fulltime',
    description:
      'Build and deploy production-grade ML models for automated credit scoring, fraud detection, and portfolio optimization using Python, PyTorch, and cloud ML endpoints.',
    requiredSkills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL'],
    preferredSkills: ['AWS SageMaker', 'PyTorch', 'Spark', 'Airflow'],
    location: 'Mumbai, Maharashtra',
    mode: 'hybrid',
    salary: { min: 1200000, max: 2000000, currency: 'INR' },
    eligibility: {
      minCGPA: 7.0,
      branches: ['CSE', 'IT', 'Data Science', 'AI/ML'],
      degree: ['B.Tech', 'M.Tech', 'M.Sc'],
    },
    applicationDeadline: new Date('2026-12-30'),
    openings: 3,
    status: 'active',
  },
  {
    postedBy: industryUserIds[4],
    companyName: 'EduSpark Learning',
    title: 'Associate Software Engineer',
    type: 'fulltime',
    description:
      'Join our core platform engineering team building low-latency live streaming, interactive coding sandboxes, and student progress tracking engines.',
    requiredSkills: ['Node.js', 'React', 'JavaScript', 'REST API', 'SQL'],
    preferredSkills: ['PostgreSQL', 'Redis', 'WebSocket', 'AWS'],
    location: 'Delhi, NCR',
    mode: 'hybrid',
    salary: { min: 700000, max: 1200000, currency: 'INR' },
    eligibility: {
      minCGPA: 6.5,
      branches: ['CSE', 'IT', 'ECE'],
      degree: ['B.Tech', 'BCA', 'MCA'],
    },
    applicationDeadline: new Date('2026-11-30'),
    openings: 4,
    status: 'active',
  },
  {
    postedBy: industryUserIds[3],
    companyName: 'GreenBot Robotics',
    title: 'Computer Vision Engineer',
    type: 'fulltime',
    description:
      'Architect computer vision pipelines for autonomous field navigation, crop disease classification, and real-time obstacle avoidance on edge devices.',
    requiredSkills: ['Python', 'OpenCV', 'Deep Learning', 'TensorFlow'],
    preferredSkills: ['ROS', 'CUDA', 'PyTorch', 'Edge AI'],
    location: 'Pune, Maharashtra',
    mode: 'onsite',
    salary: { min: 900000, max: 1600000, currency: 'INR' },
    eligibility: {
      minCGPA: 7.2,
      branches: ['CSE', 'ECE', 'AI/ML'],
      degree: ['B.Tech', 'M.Tech'],
    },
    applicationDeadline: new Date('2027-01-10'),
    openings: 2,
    status: 'active',
  },
  {
    postedBy: industryUserIds[2],
    companyName: 'HealthPlus Technologies',
    title: 'Frontend Engineer (React)',
    type: 'fulltime',
    description:
      'Own end-to-end frontend development for our patient portal and hospital administration suite. High emphasis on accessibility, performance, and responsive design.',
    requiredSkills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'REST API'],
    preferredSkills: ['Next.js', 'Redux Toolkit', 'Jest', 'Tailwind CSS'],
    location: 'Hyderabad, Telangana',
    mode: 'hybrid',
    salary: { min: 750000, max: 1300000, currency: 'INR' },
    eligibility: {
      minCGPA: 6.5,
      branches: ['CSE', 'IT', 'Any Branch'],
      degree: ['B.Tech', 'MCA', 'B.E'],
    },
    applicationDeadline: new Date('2026-12-20'),
    openings: 3,
    status: 'active',
  },
  {
    postedBy: industryUserIds[0],
    companyName: 'TechNova Solutions',
    title: 'Cloud Solutions Engineer',
    type: 'fulltime',
    description:
      'Manage multi-cloud infrastructure for mission-critical client systems. Architect automated CI/CD pipelines, container orchestration, and serverless compute.',
    requiredSkills: ['AWS', 'Docker', 'Linux', 'Python'],
    preferredSkills: ['Kubernetes', 'Terraform', 'Ansible', 'Prometheus'],
    location: 'Bengaluru, Karnataka',
    mode: 'remote',
    salary: { min: 1000000, max: 1800000, currency: 'INR' },
    eligibility: {
      minCGPA: 7.0,
      branches: ['CSE', 'IT', 'ECE'],
      degree: ['B.Tech', 'M.Tech'],
    },
    applicationDeadline: new Date('2027-01-15'),
    openings: 2,
    status: 'active',
  },
  {
    postedBy: industryUserIds[3],
    companyName: 'GreenBot Robotics',
    title: 'Robotics Firmware Engineer',
    type: 'fulltime',
    description:
      'Develop hard real-time firmware for motor control, sensor telemetry, and safety fail-safes in electric robotic utility vehicles.',
    requiredSkills: ['C', 'C++', 'Embedded Systems', 'RTOS'],
    preferredSkills: ['CAN bus', 'ROS2', 'Microchip PIC', 'Linux Kernel'],
    location: 'Pune, Maharashtra',
    mode: 'onsite',
    salary: { min: 850000, max: 1500000, currency: 'INR' },
    eligibility: {
      minCGPA: 6.8,
      branches: ['ECE', 'EEE', 'Mechatronics'],
      degree: ['B.Tech', 'M.Tech'],
    },
    applicationDeadline: new Date('2026-12-15'),
    openings: 2,
    status: 'active',
  },
  {
    postedBy: industryUserIds[1],
    companyName: 'FinEdge Capital',
    title: 'Data Platform Engineer',
    type: 'fulltime',
    description:
      'Build resilient high-throughput ETL data pipelines ingesting millions of market transactions daily. Work with Apache Kafka, Spark, and distributed SQL datastores.',
    requiredSkills: ['Python', 'SQL', 'Data Analysis', 'PostgreSQL'],
    preferredSkills: ['Apache Kafka', 'Spark', 'Snowflake', 'Airflow'],
    location: 'Mumbai, Maharashtra',
    mode: 'hybrid',
    salary: { min: 1100000, max: 1750000, currency: 'INR' },
    eligibility: {
      minCGPA: 7.2,
      branches: ['CSE', 'IT', 'Data Science'],
      degree: ['B.Tech', 'M.Tech'],
    },
    applicationDeadline: new Date('2026-12-25'),
    openings: 2,
    status: 'active',
  },
];

// ─── Learning Programs Data (8 Diverse Student Programs) ───────────────────────
const getLearningProgramsData = (industryUserIds) => [
  {
    postedBy: industryUserIds[0],
    companyName: 'TechNova Solutions',
    title: 'Full Stack Web Development Bootcamp',
    type: 'training',
    targetAudience: 'student',
    description:
      'Intensive 8-week bootcamp covering React, Node.js, Express, MongoDB, and cloud deployment with AWS. Includes real-world capstone projects and mentor code reviews.',
    skills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'AWS'],
    duration: '8 weeks',
    mode: 'online',
    fee: { amount: 3999, currency: 'INR', isFree: false },
    schedule: {
      startDate: new Date('2026-10-15'),
      endDate: new Date('2026-12-10'),
      registrationDeadline: new Date('2026-10-10'),
    },
    applicationLink: 'https://technova.com/bootcamp',
    maxParticipants: 150,
    status: 'upcoming',
  },
  {
    postedBy: industryUserIds[0],
    companyName: 'TechNova Solutions',
    title: 'AWS Certified Cloud Practitioner Mastery',
    type: 'certification',
    targetAudience: 'student',
    description:
      'Official curriculum preparation for the AWS Certified Cloud Practitioner exam. Covers core AWS cloud architecture, security, networking, and billing management.',
    skills: ['AWS', 'Cloud Computing', 'Docker', 'Linux'],
    duration: '4 weeks',
    mode: 'online',
    fee: { amount: 0, currency: 'INR', isFree: true },
    schedule: {
      startDate: new Date('2026-10-20'),
      endDate: new Date('2026-11-18'),
      registrationDeadline: new Date('2026-10-15'),
    },
    applicationLink: 'https://technova.com/cert-aws',
    maxParticipants: 300,
    status: 'upcoming',
  },
  {
    postedBy: industryUserIds[1],
    companyName: 'FinEdge Capital',
    title: 'Financial Data Analysis & Algorithmic Trading with Python',
    type: 'workshop',
    targetAudience: 'both',
    description:
      'Hands-on weekend workshop analyzing market datasets, testing momentum indicators, and building automated Python trading algorithms.',
    skills: ['Python', 'Pandas', 'Data Analysis', 'SQL', 'NumPy'],
    duration: '2 days',
    mode: 'hybrid',
    fee: { amount: 1499, currency: 'INR', isFree: false },
    schedule: {
      startDate: new Date('2026-11-05'),
      endDate: new Date('2026-11-06'),
      registrationDeadline: new Date('2026-10-31'),
    },
    applicationLink: 'https://finedge.in/workshop',
    maxParticipants: 80,
    status: 'upcoming',
  },
  {
    postedBy: industryUserIds[4],
    companyName: 'EduSpark Learning',
    title: '1-on-1 Software Engineering & Career Mentorship Circle',
    type: 'mentorship',
    targetAudience: 'student',
    description:
      'Pair with senior engineers from top tech firms for bi-weekly 1-on-1 sessions. Includes resume audits, mock technical coding interviews, and career roadmap guidance.',
    skills: ['Career Development', 'Resume Review', 'Problem Solving', 'Communication'],
    duration: '6 weeks',
    mode: 'online',
    fee: { amount: 0, currency: 'INR', isFree: true },
    schedule: {
      startDate: new Date('2026-10-25'),
      endDate: new Date('2026-12-05'),
      registrationDeadline: new Date('2026-10-20'),
    },
    applicationLink: 'https://eduspark.edu/mentorship',
    maxParticipants: 50,
    status: 'upcoming',
  },
  {
    postedBy: industryUserIds[3],
    companyName: 'GreenBot Robotics',
    title: 'Introduction to Robotics & Autonomous Systems',
    type: 'course',
    targetAudience: 'student',
    description:
      'Comprehensive self-paced course covering kinematics, embedded C++, ROS robot operating system simulation, and sensor fusion.',
    skills: ['C++', 'Robotics', 'Embedded Systems', 'Arduino', 'Python'],
    duration: '6 weeks',
    mode: 'online',
    fee: { amount: 0, currency: 'INR', isFree: true },
    schedule: {
      startDate: new Date('2026-10-01'),
      endDate: new Date('2026-11-15'),
      registrationDeadline: new Date('2026-09-30'),
    },
    applicationLink: 'https://greenbot.tech/course',
    maxParticipants: 250,
    status: 'ongoing',
  },
  {
    postedBy: industryUserIds[1],
    companyName: 'FinEdge Capital',
    title: 'Applied Generative AI & Large Language Models in Practice',
    type: 'training',
    targetAudience: 'student',
    description:
      'Learn how to build production AI applications with LangChain, LlamaIndex, OpenAI APIs, vector databases (Pinecone/Chroma), and prompt engineering techniques.',
    skills: ['Python', 'Machine Learning', 'Generative AI', 'Deep Learning'],
    duration: '4 weeks',
    mode: 'online',
    fee: { amount: 2499, currency: 'INR', isFree: false },
    schedule: {
      startDate: new Date('2026-11-15'),
      endDate: new Date('2026-12-15'),
      registrationDeadline: new Date('2026-11-08'),
    },
    applicationLink: 'https://finedge.in/genai',
    maxParticipants: 120,
    status: 'upcoming',
  },
  {
    postedBy: industryUserIds[4],
    companyName: 'EduSpark Learning',
    title: 'UI/UX Design Sprint & Figma Prototyping Workshop',
    type: 'workshop',
    targetAudience: 'student',
    description:
      'Intensive 3-day practical design sprint. Transform product specs into high-fidelity wireframes, interactive mobile prototypes, and design systems.',
    skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping'],
    duration: '3 days',
    mode: 'online',
    fee: { amount: 0, currency: 'INR', isFree: true },
    schedule: {
      startDate: new Date('2026-10-28'),
      endDate: new Date('2026-10-30'),
      registrationDeadline: new Date('2026-10-24'),
    },
    applicationLink: 'https://eduspark.edu/design-sprint',
    maxParticipants: 200,
    status: 'upcoming',
  },
  {
    postedBy: industryUserIds[4],
    companyName: 'EduSpark Learning',
    title: 'Industry-Academia Bridge Webinar Series',
    type: 'webinar',
    targetAudience: 'both',
    description:
      'Monthly interactive webinar series where engineering directors discuss trending technology stacks, hiring benchmarks, and interview preparation.',
    skills: ['Career Development', 'Industry Trends', 'Communication'],
    duration: '2 hours per session',
    mode: 'online',
    fee: { amount: 0, currency: 'INR', isFree: true },
    schedule: {
      startDate: new Date('2026-10-10'),
      endDate: new Date('2027-03-30'),
      registrationDeadline: new Date('2026-10-08'),
    },
    applicationLink: 'https://eduspark.edu/webinar',
    maxParticipants: 1000,
    status: 'upcoming',
  },
];

// ─── Main Seed Function ───────────────────────────────────────────────────────
const seed = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // ── Clear Collections ───────────────────────────────────────────────────
    console.log('🧹 Clearing existing collections...');
    await QuestionBank.deleteMany({});
    await LearningProgram.deleteMany({});
    await Job.deleteMany({});

    // Remove seeded industry users by email
    const seedEmails = industryUsersData.map((u) => u.user.email);
    await User.deleteMany({ email: { $in: seedEmails } });
    await IndustryProfile.deleteMany({});

    // ── Seed Questions ──────────────────────────────────────────────────────
    console.log('📝 Seeding skill assessment questions...');
    await QuestionBank.insertMany(questions);
    console.log(`✅ Inserted ${questions.length} questions`);

    // ── Seed Industry Users + Profiles ──────────────────────────────────────
    console.log('🏢 Seeding industry users and profiles...');
    const industryUserIds = [];

    for (const data of industryUsersData) {
      // User.create triggers Mongoose pre('save') hook to hash password once
      const user = await User.create({
        ...data.user,
        password: data.user.password,
      });

      industryUserIds.push(user._id);

      await IndustryProfile.create({
        ...data.profile,
        userId: user._id,
      });
    }
    console.log(`✅ Created ${industryUserIds.length} industry companies`);

    // ── Seed Jobs (Internships + Placements) ─────────────────────────────────
    console.log('💼 Seeding internships & placements...');
    const jobsData = getJobsData(industryUserIds);
    const createdJobs = await Job.insertMany(jobsData);
    console.log(`✅ Inserted ${createdJobs.length} jobs (8 internships + 8 placements)`);

    // ── Seed Learning Programs ──────────────────────────────────────────────
    console.log('📚 Seeding learning programs...');
    const programsData = getLearningProgramsData(industryUserIds);
    await LearningProgram.insertMany(programsData);
    console.log(`✅ Inserted ${programsData.length} learning programs`);

    // ── Ensure Student Users & Rich Student Profiles with Applications ──────
    console.log('👨‍🎓 Seeding student profiles and mock applications...');

    // We target both the current student (yahoo@gmail.com) and a universal demo student (student@acadin.com)
    const targetStudents = [
      { email: 'yahoo@gmail.com', name: 'Yahoo Student' },
      { email: 'student@acadin.com', name: 'Aarav Sharma' },
    ];

    // Pick 6 jobs for mock applications with distinct statuses
    // 0: Software Dev Intern (shortlisted)
    // 1: Frontend Engineer Intern (applied)
    // 3: Mobile App Developer Intern (selected)
    // 8: Full Stack Developer Placement (applied)
    // 9: Machine Learning Engineer Placement (rejected)
    // 10: Associate Software Engineer Placement (shortlisted)
    const appliedMockSpecs = [
      { jobIndex: 0, status: 'shortlisted', daysAgo: 6 },
      { jobIndex: 1, status: 'applied', daysAgo: 2 },
      { jobIndex: 3, status: 'selected', daysAgo: 14 },
      { jobIndex: 8, status: 'applied', daysAgo: 4 },
      { jobIndex: 9, status: 'rejected', daysAgo: 18 },
      { jobIndex: 10, status: 'shortlisted', daysAgo: 8 },
    ];

    for (const studentTarget of targetStudents) {
      let studentUser = await User.findOne({ email: studentTarget.email });
      if (!studentUser) {
        studentUser = await User.create({
          name: studentTarget.name,
          email: studentTarget.email,
          password: 'password123',
          role: 'student',
        });
        console.log(`  👤 Created student user: ${studentTarget.email}`);
      }

      // Build appliedJobs array referencing created jobs
      const studentAppliedJobs = appliedMockSpecs.map((spec) => {
        const targetJob = createdJobs[spec.jobIndex];
        const appliedDate = new Date();
        appliedDate.setDate(appliedDate.getDate() - spec.daysAgo);
        return {
          jobId: targetJob._id,
          appliedAt: appliedDate,
          status: spec.status,
        };
      });

      // Update or create student profile
      await StudentProfile.findOneAndUpdate(
        { userId: studentUser._id },
        {
          userId: studentUser._id,
          phone: '+91 9876543210',
          institution: 'National Institute of Technology (NIT)',
          degree: 'B.Tech',
          branch: 'Computer Science and Engineering',
          yearOfStudy: '4th Year',
          cgpa: 8.9,
          skills: [
            { name: 'React', level: 'advanced', verified: true },
            { name: 'Node.js', level: 'advanced', verified: true },
            { name: 'JavaScript', level: 'advanced', verified: true },
            { name: 'Python', level: 'intermediate', verified: true },
            { name: 'MongoDB', level: 'advanced', verified: true },
            { name: 'SQL', level: 'intermediate', verified: true },
            { name: 'Machine Learning', level: 'beginner', verified: false },
            { name: 'Docker', level: 'intermediate', verified: false },
          ],
          skillScores: [
            { category: 'Programming', score: 88 },
            { category: 'Data Structures', score: 84 },
            { category: 'Web Development', score: 92 },
            { category: 'Database', score: 82 },
            { category: 'Problem Solving', score: 78 },
            { category: 'Soft Skills', score: 85 },
          ],
          portfolio: {
            about:
              'Final-year CSE student passionate about full-stack web development, microservice architecture, and distributed systems. Actively looking for challenging internships and full-time software engineering roles.',
            github: 'https://github.com/student-demo',
            linkedin: 'https://linkedin.com/in/student-demo',
            website: 'https://portfolio-student.dev',
            projects: [
              {
                title: 'Acadin - Industry-Academia Skill & Placement Portal',
                description:
                  'A full-stack collaboration platform connecting students, companies, and colleges with real-time radar skill analytics and automated recommendation matching.',
                techStack: 'React 18, Node.js, Express, MongoDB, Tailwind CSS',
                link: 'https://github.com/student-demo/acadin-portal',
                status: 'Completed',
              },
              {
                title: 'Distributed In-Memory Cache Engine',
                description:
                  'High-performance cache implementation with consistent hashing, LRU eviction policy, and cluster node synchronization.',
                techStack: 'Go, Redis, Docker, gRPC',
                link: 'https://github.com/student-demo/dist-cache',
                status: 'Completed',
              },
              {
                title: 'AI Diagnostic Screening Assistant',
                description:
                  'Deep learning model and web interface analyzing medical imagery to highlight pulmonary abnormalities with 93% accuracy.',
                techStack: 'Python, PyTorch, FastAPI, React',
                link: 'https://github.com/student-demo/ai-screening',
                status: 'In Progress',
              },
            ],
            certifications: [
              {
                name: 'AWS Certified Solutions Architect - Associate',
                issuer: 'Amazon Web Services',
                date: new Date('2024-05-15'),
                credentialUrl: 'https://aws.amazon.com/verification',
              },
              {
                name: 'Meta Front-End Developer Professional Certificate',
                issuer: 'Coursera / Meta',
                date: new Date('2024-02-20'),
                credentialUrl: 'https://coursera.org/verify/professional-cert',
              },
              {
                name: 'Problem Solving (Advanced)',
                issuer: 'HackerRank',
                date: new Date('2024-07-10'),
                credentialUrl: 'https://hackerrank.com/certificates',
              },
            ],
            achievements: [
              {
                title: 'Winner — Smart India Hackathon (SIH 2024)',
                description: 'Led a 6-member team to design and build an automated skill mapping engine for university placements.',
                date: new Date('2024-03-22'),
              },
              {
                title: 'LeetCode Top 5% Global Rating',
                description: 'Solved over 450+ algorithm and data structure problems with maximum contest rating of 1880.',
                date: new Date('2024-08-15'),
              },
            ],
          },
          appliedJobs: studentAppliedJobs,
        },
        { upsert: true, new: true }
      );

      // Also add student into the respective Job.applicants arrays
      for (const spec of appliedMockSpecs) {
        const targetJob = createdJobs[spec.jobIndex];
        const appliedDate = new Date();
        appliedDate.setDate(appliedDate.getDate() - spec.daysAgo);
        await Job.findByIdAndUpdate(targetJob._id, {
          $push: {
            applicants: {
              studentId: studentUser._id,
              appliedAt: appliedDate,
              status: spec.status,
              resumeUrl: 'https://acadin.org/resumes/demo-student-resume.pdf',
            },
          },
        });
      }

      console.log(`  ✅ Synced profile & 6 mock applications for: ${studentTarget.email}`);
    }

    console.log('\n🎉 Seeding complete!');
    console.log('───────────────────────────────────────────────────────');
    console.log(`Questions            : ${questions.length}`);
    console.log(`Industry Companies   : ${industryUserIds.length}`);
    console.log(`Jobs (Internships)   : 8`);
    console.log(`Jobs (Placements)    : 8`);
    console.log(`Learning Programs    : ${programsData.length}`);
    console.log(`Student Applications : 6 mock applications per student`);
    console.log('───────────────────────────────────────────────────────');
    console.log('Industry Test Accounts (Password: password123):');
    console.log(' - hr@technova.com');
    console.log(' - careers@finedge.in');
    console.log(' - jobs@healthplus.io');
    console.log(' - hr@greenbot.tech');
    console.log(' - talent@eduspark.edu');
    console.log('Student Test Accounts (Password: password123):');
    console.log(' - yahoo@gmail.com');
    console.log(' - student@acadin.com');
    console.log('───────────────────────────────────────────────────────');

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seed();
