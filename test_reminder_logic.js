require('dotenv').config();
const mongoose = require('mongoose');
const StudySchedule = require('./models/StudySchedule');

async function testReminder() {
    await mongoose.connect(process.env.MONGO_URI);
    
    const now = new Date();
    const future5Mins = new Date(now.getTime() + 5 * 60000);
    
    console.log("Current Time (now):", now.toISOString(), "Local:", now.toLocaleString());
    console.log("Future 5 Mins (future5Mins):", future5Mins.toISOString(), "Local:", future5Mins.toLocaleString());

    const allUnreminded = await StudySchedule.find({
        completed: false,
        reminded: { $ne: true }
    });
    
    console.log(`\nFound ${allUnreminded.length} total uncompleted & unreminded schedules.`);
    
    allUnreminded.forEach(s => {
        console.log(`- ID: ${s._id}, Topic: ${s.topic}`);
        console.log(`  Scheduled Time: ${s.scheduledTime.toISOString()} (Local: ${s.scheduledTime.toLocaleString()})`);
        console.log(`  Is it <= future5Mins? ${s.scheduledTime <= future5Mins}`);
        console.log(`  Is it >= now? ${s.scheduledTime >= now}`);
    });

    const queryResults = await StudySchedule.find({
        scheduledTime: { $lte: future5Mins },
        completed: false,
        reminded: { $ne: true }
    });

    console.log(`\nQuery results (what the cron job sees): ${queryResults.length}`);

    process.exit(0);
}

testReminder();
