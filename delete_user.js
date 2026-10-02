require('dotenv').config();
const mongoose = require('mongoose');

// Models
const User = require('./models/User');
const StudySchedule = require('./models/StudySchedule');
const Syllabus = require('./models/Syllabus');
const TestResult = require('./models/TestResult');

// !! CHANGE THIS EMAIL TO THE USER YOU WANT TO DELETE !!
const TARGET_EMAIL = 'tejatej6457@gmail.com'; 

async function deleteSingleUser() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("Connected to MongoDB");

        const user = await User.findOne({ email: TARGET_EMAIL });

        if (!user) {
            console.log(`❌ User with email "${TARGET_EMAIL}" not found.`);
            process.exit(0);
        }

        const userId = user._id;
        console.log(`Found user: ${user.name} (${user.email}) [ID: ${userId}]`);
        
        // Delete associated data
        const scheduleRes = await StudySchedule.deleteMany({ userId });
        console.log(`- Deleted ${scheduleRes.deletedCount} study schedules`);

        const syllabusRes = await Syllabus.deleteMany({ userId });
        console.log(`- Deleted ${syllabusRes.deletedCount} syllabuses`);

        const testRes = await TestResult.deleteMany({ userId });
        console.log(`- Deleted ${testRes.deletedCount} test results`);

        // Finally, delete the user
        await User.deleteOne({ _id: userId });
        console.log(`✅ Successfully deleted user: ${user.email}`);

        process.exit(0);
    } catch (error) {
        console.error("Error deleting user:", error);
        process.exit(1);
    }
}

deleteSingleUser();
