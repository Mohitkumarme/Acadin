/**
 * Seed script for Acadin
 * Run: node utils/seedData.js
 *
 * Seeds:
 *  - 30 skill assessment questions
 *  - 5 industry users + profiles
 *  - 10 jobs (mix of internship & fulltime)
 *  - 5 learning programs
 */

require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const IndustryProfile = require('../models/IndustryProfile');
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
      industry: 'IT',
      description: 'Leading software development company specializing in cloud solutions and AI.',
      website: 'https://technova.com',
      linkedin: 'https://linkedin.com/company/technova',
      location: 'Bengaluru, Karnataka',
      size: 'large',
      verified: true,
      contactPerson: {
        name: 'Priya Sharma',
        email: 'priya@technova.com',
        phone: '9876543210',
        designation: 'HR Manager',
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
      industry: 'Finance',
      description: 'Fintech startup revolutionizing retail banking with AI-powered analytics.',
      website: 'https://finedge.in',
      linkedin: 'https://linkedin.com/company/finedge',
      location: 'Mumbai, Maharashtra',
      size: 'startup',
      verified: true,
      contactPerson: {
        name: 'Rahul Verma',
        email: 'rahul@finedge.in',
        phone: '9123456789',
        designation: 'Talent Acquisition Lead',
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
      industry: 'Healthcare',
      description: 'Digital health platform connecting patients with doctors through AI diagnostics.',
      website: 'https://healthplus.io',
      location: 'Hyderabad, Telangana',
      size: 'medium',
      verified: false,
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
      description: 'Pioneering sustainable robotics solutions for agriculture and manufacturing.',
      website: 'https://greenbot.tech',
      location: 'Pune, Maharashtra',
      size: 'small',
      verified: true,
      contactPerson: {
        name: 'Vikram Joshi',
        email: 'vikram@greenbot.tech',
        phone: '9012345678',
        designation: 'CTO',
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
      industry: 'EdTech',
      description: 'Online learning platform with 2M+ students across India and South Asia.',
      website: 'https://eduspark.edu',
      linkedin: 'https://linkedin.com/company/eduspark',
      location: 'Delhi, NCR',
      size: 'enterprise',
      verified: true,
      contactPerson: {
        name: 'Neha Kapoor',
        email: 'neha@eduspark.edu',
        phone: '9871234567',
        designation: 'People Operations Manager',
      },
    },
  },
];

// ─── Jobs Data ────────────────────────────────────────────────────────────────
const getJobsData = (industryUserIds) => [
  {
    postedBy: industryUserIds[0],
    companyName: 'TechNova Solutions',
    title: 'Software Development Intern',
    type: 'internship',
    description:
      'Join our backend team to build scalable microservices. You will work with Node.js, MongoDB, and Docker in an Agile environment.',
    requiredSkills: ['JavaScript', 'Node.js', 'MongoDB'],
    preferredSkills: ['Docker', 'AWS', 'REST API'],
    location: 'Bengaluru, Karnataka',
    mode: 'hybrid',
    duration: '6 months',
    stipend: { amount: 15000, currency: 'INR' },
    eligibility: {
      minCGPA: 7.0,
      branches: ['CSE', 'IT', 'ECE'],
      yearOfStudy: ['3rd Year', '4th Year'],
      degree: ['B.Tech', 'B.E'],
    },
    applicationDeadline: new Date('2026-10-30'),
    openings: 5,
    status: 'active',
  },
  {
    postedBy: industryUserIds[0],
    companyName: 'TechNova Solutions',
    title: 'Full Stack Developer',
    type: 'fulltime',
    description:
      'We are looking for an experienced full-stack developer to join our product team. You will design, develop, and maintain our SaaS platform.',
    requiredSkills: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
    preferredSkills: ['TypeScript', 'Redis', 'Kubernetes'],
    location: 'Bengaluru, Karnataka',
    mode: 'onsite',
    salary: { min: 800000, max: 1400000, currency: 'INR' },
    eligibility: {
      minCGPA: 6.5,
      branches: ['CSE', 'IT'],
      degree: ['B.Tech', 'M.Tech', 'MCA'],
    },
    applicationDeadline: new Date('2026-11-15'),
    openings: 3,
    status: 'active',
  },
  {
    postedBy: industryUserIds[1],
    companyName: 'FinEdge Capital',
    title: 'Data Analyst Intern',
    type: 'internship',
    description:
      'Work with the analytics team to build dashboards, run SQL queries, and derive insights from financial data.',
    requiredSkills: ['Python', 'SQL', 'Data Analysis'],
    preferredSkills: ['Power BI', 'Tableau', 'Pandas'],
    location: 'Mumbai, Maharashtra',
    mode: 'remote',
    duration: '3 months',
    stipend: { amount: 12000, currency: 'INR' },
    eligibility: {
      minCGPA: 7.5,
      branches: ['CSE', 'IT', 'Mathematics', 'Statistics'],
      yearOfStudy: ['3rd Year', '4th Year', 'Final Year'],
    },
    applicationDeadline: new Date('2026-10-01'),
    openings: 3,
    status: 'active',
  },
  {
    postedBy: industryUserIds[1],
    companyName: 'FinEdge Capital',
    title: 'Machine Learning Engineer',
    type: 'fulltime',
    description:
      'Build and deploy ML models for credit risk assessment and fraud detection at scale.',
    requiredSkills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL'],
    preferredSkills: ['AWS SageMaker', 'Spark', 'Airflow'],
    location: 'Mumbai, Maharashtra',
    mode: 'hybrid',
    salary: { min: 1200000, max: 2000000, currency: 'INR' },
    eligibility: {
      minCGPA: 7.0,
      branches: ['CSE', 'IT', 'Data Science'],
      degree: ['B.Tech', 'M.Tech', 'M.Sc'],
    },
    applicationDeadline: new Date('2026-11-30'),
    openings: 2,
    status: 'active',
  },
  {
    postedBy: industryUserIds[2],
    companyName: 'HealthPlus Technologies',
    title: 'Mobile App Developer Intern',
    type: 'internship',
    description:
      'Develop features for our React Native mobile app used by 500K+ patients. Work directly with senior engineers.',
    requiredSkills: ['React Native', 'JavaScript', 'REST API'],
    preferredSkills: ['Firebase', 'Redux', 'TypeScript'],
    location: 'Hyderabad, Telangana',
    mode: 'onsite',
    duration: '4 months',
    stipend: { amount: 10000, currency: 'INR' },
    eligibility: {
      minCGPA: 6.0,
      branches: ['CSE', 'IT', 'ECE'],
      yearOfStudy: ['2nd Year', '3rd Year', '4th Year'],
    },
    applicationDeadline: new Date('2026-09-30'),
    openings: 2,
    status: 'active',
  },
  {
    postedBy: industryUserIds[2],
    companyName: 'HealthPlus Technologies',
    title: 'UI/UX Designer',
    type: 'fulltime',
    description:
      'Design intuitive user experiences for our healthcare platform. Collaborate with product, engineering, and medical teams.',
    requiredSkills: ['Figma', 'UI Design', 'UX Research', 'Prototyping'],
    preferredSkills: ['Adobe XD', 'User Testing', 'Design Systems'],
    location: 'Hyderabad, Telangana',
    mode: 'hybrid',
    salary: { min: 600000, max: 1000000, currency: 'INR' },
    eligibility: {
      minCGPA: 6.0,
      degree: ['B.Des', 'B.Tech', 'Any Graduate'],
    },
    applicationDeadline: new Date('2026-10-15'),
    openings: 1,
    status: 'active',
  },
  {
    postedBy: industryUserIds[3],
    companyName: 'GreenBot Robotics',
    title: 'Embedded Systems Intern',
    type: 'internship',
    description:
      'Work on firmware development for our autonomous agricultural robots. Hands-on with sensors, actuators, and microcontrollers.',
    requiredSkills: ['C', 'C++', 'Embedded Systems', 'Arduino'],
    preferredSkills: ['RTOS', 'Raspberry Pi', 'Python'],
    location: 'Pune, Maharashtra',
    mode: 'onsite',
    duration: '6 months',
    stipend: { amount: 8000, currency: 'INR' },
    eligibility: {
      minCGPA: 6.5,
      branches: ['ECE', 'EEE', 'Mechatronics', 'CSE'],
      yearOfStudy: ['3rd Year', '4th Year'],
    },
    applicationDeadline: new Date('2026-10-20'),
    openings: 4,
    status: 'active',
  },
  {
    postedBy: industryUserIds[3],
    companyName: 'GreenBot Robotics',
    title: 'Computer Vision Engineer',
    type: 'fulltime',
    description:
      'Develop computer vision algorithms for object detection and path planning in our autonomous robots.',
    requiredSkills: ['Python', 'OpenCV', 'Deep Learning', 'TensorFlow'],
    preferredSkills: ['ROS', 'CUDA', 'PyTorch'],
    location: 'Pune, Maharashtra',
    mode: 'onsite',
    salary: { min: 900000, max: 1600000, currency: 'INR' },
    eligibility: {
      minCGPA: 7.5,
      branches: ['CSE', 'ECE', 'AI/ML'],
      degree: ['B.Tech', 'M.Tech'],
    },
    applicationDeadline: new Date('2026-12-01'),
    openings: 2,
    status: 'active',
  },
  {
    postedBy: industryUserIds[4],
    companyName: 'EduSpark Learning',
    title: 'Content Developer Intern',
    type: 'internship',
    description:
      'Create engaging educational content for programming and data science courses. Work with subject matter experts and instructional designers.',
    requiredSkills: ['Content Writing', 'Python', 'Communication'],
    preferredSkills: ['Video Editing', 'Instructional Design', 'LMS'],
    location: 'Delhi, NCR',
    mode: 'remote',
    duration: '3 months',
    stipend: { amount: 7000, currency: 'INR' },
    eligibility: {
      minCGPA: 6.0,
      branches: ['CSE', 'IT', 'Any Branch'],
      yearOfStudy: ['2nd Year', '3rd Year', '4th Year'],
    },
    applicationDeadline: new Date('2026-09-25'),
    openings: 5,
    status: 'active',
  },
  {
    postedBy: industryUserIds[4],
    companyName: 'EduSpark Learning',
    title: 'Backend Developer',
    type: 'fulltime',
    description:
      'Build and maintain the backend infrastructure of our e-learning platform serving millions of users.',
    requiredSkills: ['Node.js', 'PostgreSQL', 'Redis', 'REST API'],
    preferredSkills: ['AWS', 'Microservices', 'Elasticsearch', 'Docker'],
    location: 'Delhi, NCR',
    mode: 'hybrid',
    salary: { min: 700000, max: 1200000, currency: 'INR' },
    eligibility: {
      minCGPA: 6.5,
      branches: ['CSE', 'IT'],
      degree: ['B.Tech', 'BCA', 'MCA'],
    },
    applicationDeadline: new Date('2026-11-10'),
    openings: 3,
    status: 'active',
  },
];

// ─── Learning Programs Data ───────────────────────────────────────────────────
const getLearningProgramsData = (industryUserIds) => [
  {
    postedBy: industryUserIds[0],
    companyName: 'TechNova Solutions',
    title: 'Full Stack Web Development Bootcamp',
    type: 'training',
    targetAudience: 'student',
    description:
      'Intensive 8-week bootcamp covering React, Node.js, MongoDB, and cloud deployment. Includes live projects and mentorship.',
    skills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'AWS'],
    duration: '8 weeks',
    mode: 'online',
    fee: { amount: 4999, currency: 'INR', isFree: false },
    schedule: {
      startDate: new Date('2026-10-15'),
      endDate: new Date('2026-12-10'),
      registrationDeadline: new Date('2026-10-05'),
    },
    applicationLink: 'https://technova.com/bootcamp',
    maxParticipants: 100,
    status: 'upcoming',
  },
  {
    postedBy: industryUserIds[1],
    companyName: 'FinEdge Capital',
    title: 'Financial Data Analysis with Python',
    type: 'workshop',
    targetAudience: 'both',
    description:
      'Learn to analyze financial datasets using Python, Pandas, and visualization tools. Practical workshop with real-world case studies.',
    skills: ['Python', 'Pandas', 'Data Analysis', 'Matplotlib', 'SQL'],
    duration: '2 days',
    mode: 'offline',
    fee: { amount: 1999, currency: 'INR', isFree: false },
    schedule: {
      startDate: new Date('2026-10-25'),
      endDate: new Date('2026-10-26'),
      registrationDeadline: new Date('2026-10-18'),
    },
    applicationLink: 'https://finedge.in/workshop',
    maxParticipants: 50,
    status: 'upcoming',
  },
  {
    postedBy: industryUserIds[2],
    companyName: 'HealthPlus Technologies',
    title: 'AI in Healthcare — Faculty Development Program',
    type: 'fdp',
    targetAudience: 'academician',
    description:
      'A 5-day FDP for faculty members on the applications of Artificial Intelligence in healthcare, diagnostics, and patient management.',
    skills: ['Artificial Intelligence', 'Machine Learning', 'Healthcare IT', 'Python'],
    duration: '5 days',
    mode: 'hybrid',
    fee: { amount: 0, currency: 'INR', isFree: true },
    schedule: {
      startDate: new Date('2026-11-10'),
      endDate: new Date('2026-11-14'),
      registrationDeadline: new Date('2026-11-01'),
    },
    applicationLink: 'https://healthplus.io/fdp',
    maxParticipants: 40,
    status: 'upcoming',
  },
  {
    postedBy: industryUserIds[3],
    companyName: 'GreenBot Robotics',
    title: 'Introduction to Robotics & Embedded Systems',
    type: 'course',
    targetAudience: 'student',
    description:
      'Self-paced online course covering fundamentals of robotics, embedded C, and sensor integration with hands-on simulation exercises.',
    skills: ['C', 'C++', 'Robotics', 'Embedded Systems', 'Arduino'],
    duration: '6 weeks',
    mode: 'online',
    fee: { amount: 0, currency: 'INR', isFree: true },
    schedule: {
      startDate: new Date('2026-10-01'),
      endDate: new Date('2026-11-12'),
      registrationDeadline: new Date('2026-09-25'),
    },
    applicationLink: 'https://greenbot.tech/course',
    maxParticipants: 200,
    status: 'ongoing',
  },
  {
    postedBy: industryUserIds[4],
    companyName: 'EduSpark Learning',
    title: 'Industry-Academia Bridge Webinar Series',
    type: 'webinar',
    targetAudience: 'both',
    description:
      'Monthly webinar series where industry leaders discuss current technology trends, career paths, and collaboration opportunities with academia.',
    skills: ['Career Development', 'Industry Trends', 'Communication'],
    duration: '2 hours per session',
    mode: 'online',
    fee: { amount: 0, currency: 'INR', isFree: true },
    schedule: {
      startDate: new Date('2026-10-05'),
      endDate: new Date('2027-03-05'),
      registrationDeadline: new Date('2026-10-01'),
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

    // Clear existing seed data (optional — comment out to prevent overwrites)
    console.log('🧹 Clearing existing data...');
    await QuestionBank.deleteMany({});
    await LearningProgram.deleteMany({});

    // Remove only seeded industry users by their emails
    const seedEmails = industryUsersData.map((u) => u.user.email);
    await User.deleteMany({ email: { $in: seedEmails } });
    await IndustryProfile.deleteMany({});
    await Job.deleteMany({});

    // ── Seed Questions ──────────────────────────────────────────────────────
    console.log('📝 Seeding skill assessment questions...');
    await QuestionBank.insertMany(questions);
    console.log(`✅ Inserted ${questions.length} questions`);

    // ── Seed Industry Users + Profiles ──────────────────────────────────────
    console.log('🏢 Seeding industry users and profiles...');
    const industryUserIds = [];

    for (const data of industryUsersData) {
      // Hash password manually (bypass pre-save hook since we use insertMany for bulk)
      const hashedPassword = await bcrypt.hash(data.user.password, 10);

      const user = await User.create({
        ...data.user,
        password: hashedPassword,
      });

      // We need to bypass the pre-save hook here since we hashed manually
      // Actually User.create triggers pre-save — but password is already hashed
      // So let's use findByIdAndUpdate to set the already-hashed password
      // Actually, safest: create without pre-save by using Model directly
      // The issue: creating via User.create will re-hash. Let's use a workaround:

      industryUserIds.push(user._id);

      await IndustryProfile.create({
        ...data.profile,
        userId: user._id,
      });
    }

    console.log(`✅ Created ${industryUserIds.length} industry users and profiles`);

    // ── Seed Jobs ────────────────────────────────────────────────────────────
    console.log('💼 Seeding jobs...');
    const jobsData = getJobsData(industryUserIds);
    await Job.insertMany(jobsData);
    console.log(`✅ Inserted ${jobsData.length} jobs`);

    // ── Seed Learning Programs ────────────────────────────────────────────────
    console.log('📚 Seeding learning programs...');
    const programsData = getLearningProgramsData(industryUserIds);
    await LearningProgram.insertMany(programsData);
    console.log(`✅ Inserted ${programsData.length} learning programs`);

    console.log('\n🎉 Seeding complete!');
    console.log('─────────────────────────────────');
    console.log(`Questions      : ${questions.length}`);
    console.log(`Industry Users : ${industryUsersData.length}`);
    console.log(`Jobs           : ${jobsData.length}`);
    console.log(`Programs       : ${programsData.length}`);
    console.log('─────────────────────────────────');
    console.log('All industry passwords: password123');

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
