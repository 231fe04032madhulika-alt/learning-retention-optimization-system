require('dotenv').config();
const mongoose = require('mongoose');

const User = require('./models/User');
const StudySchedule = require('./models/StudySchedule');
const Syllabus = require('./models/Syllabus');
const TestResult = require('./models/TestResult');

const uri = process.env.MONGO_URI;

async function clearUserData() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB for clearing user data.");

        await User.deleteMany({});
        console.log("Cleared Users");

        await StudySchedule.deleteMany({});
        console.log("Cleared StudySchedules");

        await Syllabus.deleteMany({});
        console.log("Cleared Syllabuses");

        await TestResult.deleteMany({});
        console.log("Cleared TestResults");

        console.log("All user data cleared successfully.");
        process.exit(0);
    } catch (err) {
        console.error("Error clearing user data:", err);
        process.exit(1);
    }
}

clearUserData();
