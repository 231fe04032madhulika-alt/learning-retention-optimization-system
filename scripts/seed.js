const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') }); // Make sure to load env
const MockTest = require('../models/MockTest');
const User = require('../models/User');
const StudySchedule = require('../models/StudySchedule');
const bcrypt = require('bcryptjs');
const { questionBanks } = require('./questionData');

// Subject Taxonomy requested by the user (Expanded to 65+ subjects)
const taxonomy = [
    // 1. School Subjects (Class 1-10)
    { educationLevel: 'School', course: 'Common', branch: 'General', subjects: ['Mathematics', 'Science', 'Social Studies', 'English', 'Hindi', 'Telugu (or Regional Language)', 'General Knowledge', 'Computer Basics'] },
    { educationLevel: 'School', course: 'Higher (8-10)', branch: 'General', subjects: ['Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Civics'] },
    
    // 2. Intermediate (11th & 12th)
    { educationLevel: 'Intermediate', course: 'MPC', branch: 'General', subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'] },
    { educationLevel: 'Intermediate', course: 'BiPC', branch: 'General', subjects: ['Biology (Botany + Zoology)', 'Physics', 'Chemistry', 'English'] },
    { educationLevel: 'Intermediate', course: 'MEC', branch: 'General', subjects: ['Mathematics / Statistics', 'Economics', 'Commerce', 'English'] },
    { educationLevel: 'Intermediate', course: 'CEC', branch: 'General', subjects: ['Civics', 'Economics', 'Commerce', 'English'] },
    { educationLevel: 'Intermediate', course: 'Other', branch: 'General', subjects: ['History', 'Economics', 'Civics', 'English'] },

    // 3. Diploma (Polytechnic)
    { educationLevel: 'Diploma', course: 'Common', branch: 'All Branches', subjects: ['Engineering Mathematics', 'Engineering Physics', 'Engineering Chemistry', 'Basic Electrical Engineering', 'Engineering Drawing'] },
    { educationLevel: 'Diploma', course: 'Specific', branch: 'CSE / IT', subjects: ['Programming in C', 'Data Structures', 'Computer Networks', 'Database Management Systems', 'Operating Systems'] },
    { educationLevel: 'Diploma', course: 'Specific', branch: 'ECE', subjects: ['Electronic Devices', 'Digital Electronics', 'Analog Electronics', 'Communication Systems'] },
    { educationLevel: 'Diploma', course: 'Specific', branch: 'Mechanical', subjects: ['Engineering Mechanics', 'Thermodynamics', 'Manufacturing Technology', 'Strength of Materials'] },
    { educationLevel: 'Diploma', course: 'Specific', branch: 'EEE', subjects: ['Electrical Machines', 'Power Systems', 'Control Systems'] },

    // 4. B.Tech
    { educationLevel: 'B.Tech', course: 'Engineering 1st Year', branch: 'Common', subjects: ['Engineering Mathematics', 'Engineering Physics', 'Engineering Chemistry', 'Basic Electrical Engineering', 'Engineering Mechanics', 'Programming in C'] },
    { educationLevel: 'B.Tech', course: 'Engineering', branch: 'CSE / AI / DS / IT', subjects: ['Data Structures', 'Algorithms', 'Operating Systems', 'Database Management Systems', 'Computer Networks', 'Software Engineering', 'Machine Learning', 'Artificial Intelligence', 'Python Programming', 'Java Programming'] },
    { educationLevel: 'B.Tech', course: 'Engineering', branch: 'ECE', subjects: ['Signals and Systems', 'Digital Electronics', 'Analog Circuits', 'Microprocessors', 'VLSI Design', 'Communication Systems'] },
    { educationLevel: 'B.Tech', course: 'Engineering', branch: 'EEE', subjects: ['Electrical Machines', 'Power Systems', 'Control Systems', 'Power Electronics'] },
    { educationLevel: 'B.Tech', course: 'Engineering', branch: 'Mechanical', subjects: ['Thermodynamics', 'Fluid Mechanics', 'Heat Transfer', 'Machine Design', 'Manufacturing Engineering'] },
    { educationLevel: 'B.Tech', course: 'Engineering', branch: 'Civil', subjects: ['Structural Engineering', 'Geotechnical Engineering', 'Environmental Engineering', 'Transportation Engineering'] },

    // 5. Programming Languages
    { educationLevel: 'Programming', course: 'Languages', branch: 'Software', subjects: ['C', 'C++', 'Java', 'Python', 'JavaScript', 'SQL', 'HTML', 'CSS', 'React (Basic)', 'Node.js'] },

    // 6. Degree (BSc / BBA / BCom / MBA)
    { educationLevel: 'Degree', course: 'BSc', branch: 'Computers', subjects: ['Mathematics', 'Physics', 'Computer Science', 'Data Structures', 'Database Management Systems'] },
    { educationLevel: 'Degree', course: 'BBA / MBA', branch: 'Management', subjects: ['Management Principles', 'Marketing', 'Human Resource Management', 'Finance', 'Business Communication'] },
    { educationLevel: 'Degree', course: 'BCom', branch: 'Commerce', subjects: ['Accounting', 'Economics', 'Business Law', 'Taxation'] }
];

// Dynamic Question Generator based on Topic and Level
function generateQuestions(topic, level) {
    const qArray = [];
    
    // Check if we have specific questions for this topic and level
    if (questionBanks[topic] && questionBanks[topic][level] && questionBanks[topic][level].length > 0) {
        const specificReqs = questionBanks[topic][level];
        // Generate precisely 3 questions as the user requested "3 mock tests/questions" per level mapped.
        // It cycles nicely if banks provide 1 to 3 distinct.
        for (let i = 0; i < 3; i++) {
            const template = specificReqs[i % specificReqs.length];
            const variationStr = i >= specificReqs.length ? ` (Var ${Math.floor(i/specificReqs.length) + 1})` : "";
            qArray.push({
                questionText: `[${level.toUpperCase()} Q${i+1}] ${template.q}${variationStr}`,
                options: template.opts,
                correctAnswer: template.ans
            });
        }
        return qArray;
    }

    // Generic fallback if a subject somehow doesn't have an exact mapping
    const fallbacks = [
        { q: `Which of the following describes a widely recognized principle in ${topic}?`, opts: [`It focuses on optimizing targeted processes.`, `It requires outdated context.`, `It is only used in theoretical research.`, `It relies entirely on random variables.`], ans: `It focuses on optimizing targeted processes.` },
        { q: `What is one of the foundational elements you first learn in ${topic}?`, opts: [`Basic definitions and core methodologies.`, `Advanced unstructured analysis.`, `Historical trivia from 1800s.`, `Irrelevant external theories.`], ans: `Basic definitions and core methodologies.` },
        { q: `How is ${topic} typically utilized in practical applications?`, opts: [`To solve specific domain-related problems efficiently.`, `To design aesthetic layouts only.`, `To generate completely random numeric data.`, `To bypass security protocols.`], ans: `To solve specific domain-related problems efficiently.` }
    ];

    for (let i = 0; i < 3; i++) {
        const f = fallbacks[i % fallbacks.length];
        qArray.push({
            questionText: `[${level.toUpperCase()} Q${i+1}] ${f.q}`,
            options: f.opts,
            correctAnswer: f.ans
        });
    }
    return qArray;
}

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/assistant");
        console.log('Connected to MongoDB. Wiping existing prep data...');
        await MockTest.deleteMany({});
        await User.deleteMany({});
        await StudySchedule.deleteMany({});
        
        console.log('Inserting test user and schedule...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        
        const testUser = new User({
            name: 'Test Local User',
            email: 'test@example.com',
            password: hashedPassword,
            preferredStudyTimeRange: { start: '17:00', end: '19:00' },
            semesterStartDate: new Date(),
            semesterEndDate: new Date(Date.now() + 30*24*60*60*1000)
        });
        await testUser.save();
        
        const testSchedule = new StudySchedule({
            userId: testUser._id,
            subject: 'Programming Languages',
            topic: 'Python',
            scheduledTime: new Date(),
            completed: true
        });
        await testSchedule.save();
        
        const mockTestsToInsert = [];
        const levels = ['beginner', 'intermediate', 'advanced'];

        console.log('Generating dynamic tests across all taxonomies (3 distinct tests per subject)...');

        // Loop Taxonomies uniquely capturing each subject
        const insertedTopics = new Set();
        
        for (const branchDetails of taxonomy) {
            for (const subject of branchDetails.subjects) {
                // To avoid duplicate mock test definitions for identical subjects spanning branches
                if (!insertedTopics.has(subject)) {
                    for (const lvl of levels) {
                        mockTestsToInsert.push({
                            topic: subject,
                            educationLevel: branchDetails.educationLevel,
                            course: branchDetails.course,
                            branch: branchDetails.branch,
                            level: lvl,
                            questions: generateQuestions(subject, lvl)
                        });
                    }
                    insertedTopics.add(subject);
                }
            }
        }

        console.log(`Inserting ${mockTestsToInsert.length} strictly structured tests into the database...`);
        await MockTest.insertMany(mockTestsToInsert);
        console.log(`✅ Seeding Complete! ${mockTestsToInsert.length} Mock Tests generated spanning all educational categories.`);
        process.exit(0);

    } catch (e) {
        console.error('Seeding failed:', e);
        process.exit(1);
    }
}

seed();
