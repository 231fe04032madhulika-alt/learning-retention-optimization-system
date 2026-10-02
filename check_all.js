require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const StudySchedule = require('./models/StudySchedule');

async function checkAll() {
    await mongoose.connect(process.env.MONGO_URI);
    
    const users = await User.find();
    console.log(`Total users in DB: ${users.length}`);
    for (const u of users) {
        const schedCount = await StudySchedule.countDocuments({ userId: u._id });
        const progCount = u.topicProgress.length;
        console.log(`- ${u.email} | Role: ${u.role} | Schedules: ${schedCount} | Progress Items: ${progCount}`);
        
        if (progCount > 0) {
            u.topicProgress.forEach(p => {
                console.log(`  -> ${p.topic} (${p.highestUnlockedLevel})`);
            });
        }
    }
    
    process.exit(0);
}
checkAll();
