const mongoose = require('mongoose');
const User = require('./models/User');
const StudySchedule = require('./models/StudySchedule');
const Syllabus = require('./models/Syllabus');
const TestResult = require('./models/TestResult');
require('dotenv').config();

const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/assistant";

async function clearData() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB for cleanup.");

        // Wipe Users, Schedules, Syllabuses, TestResults
        const userCount = await User.deleteMany({});
        const scheduleCount = await StudySchedule.deleteMany({});
        const syllabusCount = await Syllabus.deleteMany({});
        const testResultCount = await TestResult.deleteMany({});

        console.log(`Deleted ${userCount.deletedCount} Users.`);
        console.log(`Deleted ${scheduleCount.deletedCount} Study Schedules.`);
        console.log(`Deleted ${syllabusCount.deletedCount} Syllabuses.`);
        console.log(`Deleted ${testResultCount.deletedCount} Test Results.`);
        
        console.log("System is now completely clean. Mock Tests were preserved.");
        mongoose.connection.close();
    } catch (err) {
        console.error("Error cleaning DB:", err);
        mongoose.connection.close();
    }
}

clearData();
