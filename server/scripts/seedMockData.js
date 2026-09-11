const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const IndustryProfile = require('../models/IndustryProfile');
const AcademicianProfile = require('../models/AcademicianProfile');
const InstitutionProfile = require('../models/InstitutionProfile');
const Job = require('../models/Job');
const LearningProgram = require('../models/LearningProgram');
const Collaboration = require('../models/Collaboration');

const MOCK_PASSWORD = 'Password@123';

const runSeeder = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/acadin';
    await mongoose.connect(mongoURI);
    console.log('📦 Connected to MongoDB');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(MOCK_PASSWORD, salt);

    console.log('🧹 Cleaning up old mock data...');
    const mockEmails = [
      'student1@example.com', 'student2@example.com', 'student3@example.com',
      'hr@techcorp.com', 'careers@innovate.io',
      'dr.sharma@iitb.ac.in', 'prof.gupta@nit.ac.in',
      'admin@iitb.ac.in', 'tnp@nit.ac.in'
    ];
    
    // Find existing mock users to delete their relational data
    const existingUsers = await User.find({ email: { $in: mockEmails } });
    const userIds = existingUsers.map(u => u._id);

    await User.deleteMany({ _id: { $in: userIds } });
    await StudentProfile.deleteMany({ userId: { $in: userIds } });
    await IndustryProfile.deleteMany({ userId: { $in: userIds } });
    await AcademicianProfile.deleteMany({ userId: { $in: userIds } });
    await InstitutionProfile.deleteMany({ userId: { $in: userIds } });
    await Job.deleteMany({ postedBy: { $in: userIds } });
    await LearningProgram.deleteMany({ postedBy: { $in: userIds } });
    await Collaboration.deleteMany({ postedBy: { $in: userIds } });

    console.log('🌱 Planting new professional mock data...');

    // 1. Create Users
    const usersData = [
      { name: 'Arjun Reddy', email: 'student1@example.com', password: hashedPassword, role: 'student' },
      { name: 'Priya Sharma', email: 'student2@example.com', password: hashedPassword, role: 'student' },
      { name: 'Rahul Verma', email: 'student3@example.com', password: hashedPassword, role: 'student' },
      
      { name: 'TechCorp HR', email: 'hr@techcorp.com', password: hashedPassword, role: 'industry' },
      { name: 'Innovate AI Team', email: 'careers@innovate.io', password: hashedPassword, role: 'industry' },
      
      { name: 'Dr. A.K. Sharma', email: 'dr.sharma@iitb.ac.in', password: hashedPassword, role: 'academician' },
      { name: 'Prof. Neha Gupta', email: 'prof.gupta@nit.ac.in', password: hashedPassword, role: 'academician' },
      
      { name: 'IIT Bombay Admin', email: 'admin@iitb.ac.in', password: hashedPassword, role: 'institution' },
      { name: 'NIT Trichy T&P', email: 'tnp@nit.ac.in', password: hashedPassword, role: 'institution' },
    ];
    const createdUsers = await User.insertMany(usersData);
    const uMap = {};
    createdUsers.forEach(u => uMap[u.email] = u._id);

    // 2. Create Industry Profiles
    await IndustryProfile.insertMany([
      {
        userId: uMap['hr@techcorp.com'],
        companyName: 'TechCorp Solutions',
        industry: 'Software Development',
        description: 'Leading provider of cloud infrastructure and scalable enterprise software solutions driving digital transformation worldwide.',
        website: 'https://techcorp.example.com',
        location: 'Bangalore, India',
        verified: true,
      },
      {
        userId: uMap['careers@innovate.io'],
        companyName: 'Innovate AI',
        industry: 'Artificial Intelligence',
        description: 'Pioneering AI startup focused on machine learning models for healthcare and financial predictive analytics.',
        website: 'https://innovate.io',
        location: 'Hyderabad, India',
        verified: true,
      }
    ]);

    // 3. Create Jobs
    const createdJobs = await Job.insertMany([
      {
        postedBy: uMap['hr@techcorp.com'],
        companyName: 'TechCorp Solutions',
        title: 'Software Development Engineer - I',
        type: 'fulltime',
        location: 'Bangalore / Remote',
        description: 'We are looking for a passionate SDE-1 to join our core platform team. You will be building scalable APIs and distributed systems.',
        requiredSkills: ['React', 'Node.js', 'System Design'],
        salary: { min: 1200000, max: 1500000 },
        eligibility: { branches: ['CSE', 'IT'] },
        status: 'active',
      },
      {
        postedBy: uMap['careers@innovate.io'],
        companyName: 'Innovate AI',
        title: 'Machine Learning Intern',
        type: 'internship',
        location: 'Hyderabad',
        description: 'Join our data science team as an intern and work on cutting-edge LLMs and predictive models.',
        requiredSkills: ['Python', 'Machine Learning', 'TensorFlow'],
        stipend: { amount: 40000 },
        eligibility: { branches: ['CSE', 'ECE'] },
        status: 'active',
      }
    ]);

    // 4. Create Collaborations & FDPs
    const createdCollabs = await Collaboration.insertMany([
      {
        postedBy: uMap['hr@techcorp.com'],
        title: 'Industry-Academia Research on Edge Computing',
        type: 'research',
        description: 'Collaborative research opportunity for professors working on low-latency edge computing architectures.',
        targetAudience: 'academician',
        requiredExpertise: ['Edge Computing', 'IoT', 'Distributed Systems'],
        status: 'open',
      },
      {
        postedBy: uMap['careers@innovate.io'],
        title: 'AI Mentorship Program 2026',
        type: 'mentorship',
        description: '6-month mentorship program for final year students to build production-grade AI applications under industry guidance.',
        targetAudience: 'both',
        requiredExpertise: ['Python', 'AI Fundamentals'],
        status: 'open',
      }
    ]);

    const createdPrograms = await LearningProgram.insertMany([
      {
        postedBy: uMap['hr@techcorp.com'],
        title: 'Faculty Development Program on Cloud Native Architecture',
        type: 'training',
        description: 'A 5-day extensive FDP covering Docker, Kubernetes, and AWS deployment strategies for academic curriculum integration.',
        targetAudience: 'academician',
        mode: 'online',
        fee: { isFree: true, amount: 0 },
        schedule: { startDate: new Date('2026-10-10'), endDate: new Date('2026-10-15') },
        status: 'upcoming'
      }
    ]);

    // 5. Create Student Profiles (with applications)
    await StudentProfile.insertMany([
      {
        userId: uMap['student1@example.com'],
        branch: 'CSE', degree: 'B.Tech', cgpa: 8.8, yearOfStudy: '4th Year',
        institution: 'IIT Bombay',
        skills: [{ name: 'React', level: 'advanced' }, { name: 'Node.js', level: 'intermediate' }],
        skillScores: [{ category: 'Web Development', score: 85 }, { category: 'DSA', score: 92 }],
        portfolio: { about: 'Passionate full-stack developer building scalable web apps.' },
        appliedJobs: [{ jobId: createdJobs[0]._id, status: 'selected', appliedAt: new Date() }],
      },
      {
        userId: uMap['student2@example.com'],
        branch: 'IT', degree: 'B.Tech', cgpa: 9.1, yearOfStudy: '3rd Year',
        institution: 'NIT Trichy',
        skills: [{ name: 'Python', level: 'advanced' }, { name: 'Machine Learning', level: 'advanced' }],
        skillScores: [{ category: 'Data Science', score: 94 }, { category: 'Python', score: 88 }],
        portfolio: { about: 'AI enthusiast interested in NLP and computer vision.' },
        appliedJobs: [{ jobId: createdJobs[1]._id, status: 'shortlisted', appliedAt: new Date() }, { jobId: createdJobs[0]._id, status: 'rejected', appliedAt: new Date() }],
      },
      {
        userId: uMap['student3@example.com'],
        branch: 'ECE', degree: 'B.Tech', cgpa: 7.9, yearOfStudy: '4th Year',
        institution: 'IIT Bombay',
        skills: [{ name: 'C++', level: 'intermediate' }, { name: 'IoT', level: 'advanced' }],
        skillScores: [{ category: 'Embedded Systems', score: 82 }],
        portfolio: { about: 'Hardware and software integration specialist.' },
        appliedJobs: [{ jobId: createdJobs[0]._id, status: 'applied', appliedAt: new Date() }],
      }
    ]);

    // Also push these students as applicants to the actual jobs
    await Job.findByIdAndUpdate(createdJobs[0]._id, {
      $push: {
        applicants: { $each: [
          { studentId: uMap['student1@example.com'], status: 'selected', appliedAt: new Date() },
          { studentId: uMap['student2@example.com'], status: 'rejected', appliedAt: new Date() },
          { studentId: uMap['student3@example.com'], status: 'applied', appliedAt: new Date() },
        ]}
      }
    });

    await Job.findByIdAndUpdate(createdJobs[1]._id, {
      $push: {
        applicants: { $each: [
          { studentId: uMap['student2@example.com'], status: 'shortlisted', appliedAt: new Date() },
        ]}
      }
    });

    // 6. Create Academician Profiles
    await AcademicianProfile.insertMany([
      {
        userId: uMap['dr.sharma@iitb.ac.in'],
        institution: 'IIT Bombay', department: 'Computer Science', designation: 'Professor',
        institutionEmail: 'dr.sharma@iitb.ac.in', verified: true, experience: 15,
        specializations: ['Distributed Systems', 'Cloud Computing'],
        appliedOpportunities: [
          { opportunityId: createdPrograms[0]._id, type: 'fdp', status: 'selected' },
          { opportunityId: createdCollabs[0]._id, type: 'research', status: 'applied' }
        ]
      },
      {
        userId: uMap['prof.gupta@nit.ac.in'],
        institution: 'NIT Trichy', department: 'Information Technology', designation: 'Associate Professor',
        institutionEmail: 'prof.gupta@nit.ac.in', verified: true, experience: 8,
        specializations: ['Machine Learning', 'Data Mining'],
        appliedOpportunities: [
          { opportunityId: createdCollabs[1]._id, type: 'consultancy', status: 'selected' }
        ]
      }
    ]);

    // 7. Create Institution Profiles
    await InstitutionProfile.insertMany([
      {
        userId: uMap['admin@iitb.ac.in'],
        institutionName: 'IIT Bombay',
        website: 'https://iitb.ac.in',
        contactEmail: 'admin@iitb.ac.in'
      },
      {
        userId: uMap['tnp@nit.ac.in'],
        institutionName: 'NIT Trichy',
        website: 'https://nitt.edu',
        contactEmail: 'tnp@nit.ac.in'
      }
    ]);

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

runSeeder();
