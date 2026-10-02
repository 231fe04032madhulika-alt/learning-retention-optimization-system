const mongoose = require('mongoose');
const MockTest = require('./models/MockTest');
require('dotenv').config();

const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/assistant";

const subjects = [
    // Programming
    "C", "C++", "Java", "Python", "Go", "Rust", "Ruby", "JavaScript", "TypeScript", "PHP", 
    "Swift", "Kotlin", "R", "MATLAB", "SQL", "C#", "Scala", "Shell Scripting", "Perl", "Visual Basic",
    
    // Web
    "HTML", "CSS", "React", "Angular", "Vue", "Node.js", "Express", "Django", "Flask", 
    "Spring Boot", "ASP.NET", "GraphQL", "MongoDB", "PostgreSQL", "REST APIs",
    
    // CS Fundamentals
    "Data Structures", "Algorithms", "Operating Systems", "Computer Networks", 
    "Database Management Systems", "Computer Architecture", "Theory of Computation", 
    "Compiler Design", "Cryptography", "Software Engineering",
    
    // Emerging Tech
    "Machine Learning", "Artificial Intelligence", "Deep Learning", "Cloud Computing", 
    "Big Data", "Blockchain", "Cyber Security", "Internet of Things", "DevOps", 
    "Docker", "Kubernetes", "AWS", "Azure", "Data Science", "Natural Language Processing",
    
    // Math & Core Eng
    "Calculus", "Linear Algebra", "Discrete Mathematics", "Probability", "Statistics", 
    "Physics", "Chemistry", "Mechanical Basics", "Civil Basics", "Electrical Basics", "Electronics"
];

const beginnerTemplates = [
    "What is the primary operational scope of ##SUBJECT##?",
    "Which statement best describes the fundamental concept behind ##SUBJECT##?",
    "What is regarded as a primary advantage of utilizing ##SUBJECT##?",
    "Where is ##SUBJECT## most commonly applied in typical workflows?",
    "Which is a fundamental unit or base characteristic of ##SUBJECT##?",
    "Which of the following is correct regarding the core rules of ##SUBJECT##?",
    "What initial setup step is closely associated with ##SUBJECT##?",
    "Why might a practitioner choose ##SUBJECT## over an alternative?",
    "In basic ##SUBJECT## usage, what behavior is generally expected?",
    "Which term fundamentally relates specifically to ##SUBJECT## basics?"
];

const intermediateTemplates = [
    "How does ##SUBJECT## manage internal processes under moderate complexity?",
    "Which technique is standard for edge-case handling in ##SUBJECT##?",
    "What architectural consideration is critical when utilizing ##SUBJECT##?",
    "How does standard multi-step processing or chaining function in ##SUBJECT##?",
    "Which component is most crucial for scaling basic ##SUBJECT## operations?",
    "What is the theoretical complexity of common procedures within ##SUBJECT##?",
    "Which structural pattern is widely recommended in intermediate ##SUBJECT## applications?",
    "How does ##SUBJECT## interface with external constraints (like memory/IO)?",
    "What typical performance bottleneck should you watch for in ##SUBJECT##?",
    "How are dependency chains optimally handled in ##SUBJECT##?"
];

const advancedTemplates = [
    "What mechanism in ##SUBJECT## guarantees strict logical consistency or concurrency?",
    "How can internal compilation or low-level parsing mechanisms be optimized in ##SUBJECT##?",
    "Which advanced tuning configuration yields the lowest footprint for ##SUBJECT## environments?",
    "How does the underlying abstract model of ##SUBJECT## resolve deeper referential cycles?",
    "What is an undocumented or highly sophisticated edge case specific to ##SUBJECT##?",
    "How do you profile or deeply analyze latency leakage in ##SUBJECT##?",
    "What characterizes the cleanup phases in advanced ##SUBJECT## architectures?",
    "Which niche approach effectively replaces conventional operations for ##SUBJECT##?",
    "How is distributed synchronization maintained across robust ##SUBJECT## tiers?",
    "Which paradigm shift fundamentally changes how ##SUBJECT## handles high-throughput?"
];

const mockTests = [];

subjects.forEach(topic => {
    
    const buildOptions = (topic, level, index) => {
        return [
            `Standard implementation mapping for ${topic}`,
            `Incorrect or deprecated approach for ${topic}`,
            `A partially correct concept not entirely applicable to ${topic}`,
            `A concept completely unrelated to ${level} ${topic}`
        ];
    };

    const generateQuestions = (level, count, templates) => {
        const qArray = [];
        for (let i = 0; i < count; i++) {
            const rawText = templates[i % templates.length];
            const qText = rawText.replace(/##SUBJECT##/g, topic);
            
            const options = buildOptions(topic, level, i);
            
            // Randomly select one index out of the 4 to be correct to simulate real MCQ
            // Using a simple pseudo-random approach that is deterministic per topic/level/i
            const correctIndex = (topic.length + level.length + i) % 4;
            
            // Add a prefix to the selected option to make it explicitly correct for dummy test purposes
            options[correctIndex] = `[Correct] ${options[correctIndex]}`;

            qArray.push({
                questionText: `Q${i + 1}: ${qText}`,
                options: options,
                correctAnswer: options[correctIndex]
            });
        }
        return qArray;
    };

    mockTests.push({
        topic,
        level: "beginner",
        questions: generateQuestions('beginner', 10, beginnerTemplates)
    });
    
    mockTests.push({
        topic,
        level: "intermediate",
        questions: generateQuestions('intermediate', 10, intermediateTemplates)
    });

    mockTests.push({
        topic,
        level: "advanced",
        questions: generateQuestions('advanced', 10, advancedTemplates)
    });
});

async function seedDB() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB for seeding");

        // Use a wildcard delete to flush ALL old mock tests so the db is perfectly clean
        await MockTest.deleteMany({});
        console.log(`Cleared all existing old mock tests`);

        // Insert new mass data
        await MockTest.insertMany(mockTests);
        console.log(`Successfully seeded ${mockTests.length} tests encompassing ${subjects.length} subjects!`);

        mongoose.connection.close();
    } catch (err) {
        console.error("Error seeding DB:", err);
        mongoose.connection.close();
    }
}

seedDB();
