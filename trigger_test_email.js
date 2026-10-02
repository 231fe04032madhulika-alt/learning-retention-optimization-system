require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const StudySchedule = require('./models/StudySchedule');

const TARGET_EMAIL = 'voleti1704@gmail.com'; 

async function triggerTestEmail() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });

        const user = await User.findOne({ email: TARGET_EMAIL });

        if (!user) {
            console.log(`❌ User with email "${TARGET_EMAIL}" not found in the database.`);
            console.log(`Please make sure you have registered an account with this email!`);
            process.exit(0);
        }

        // Schedule a mock topic exactly 2 minutes from right now
        // The cron job runs every minute, so it will pick this up when it reaches 5 mins before.
        // Wait, if we want the 5 MINUTE reminder to trigger NOW, the scheduled time MUST BE exactly 5 minutes from now!
        const now = new Date();
        const testTime = new Date(now.getTime() + 5 * 60000); 

        const testSchedule = new StudySchedule({
            userId: user._id,
            subject: 'Viva Testing Subject',
            unit: 'Unit 1',
            topic: 'System Architecture Testing',
            scheduledTime: testTime,
            completed: false,
            reminded: false
        });

        await testSchedule.save();

        console.log(`✅ Test Topic Scheduled for ${TARGET_EMAIL}!`);
        console.log(`Topic Time: ${testTime.toLocaleString()}`);
        console.log(`\nWait 1 minute. Your backend server should automatically pick this up and send you the email!`);

    } catch (error) {
        console.error("Error:", error);
    } finally {
        setTimeout(() => process.exit(0), 1000);
    }
}

triggerTestEmail();
