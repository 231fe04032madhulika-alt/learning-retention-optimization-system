require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function checkUserProgress() {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Check the latest updated user
    const users = await User.find({ role: 'user' }).sort({ updatedAt: -1 }).limit(1);
    if (users.length === 0) {
        console.log("No users found.");
        process.exit(0);
    }
    
    const user = users[0];
    console.log(`User: ${user.email}`);
    console.log(`Topic Progress Array length: ${user.topicProgress.length}`);
    user.topicProgress.forEach((p, i) => {
        console.log(`[${i}] Topic: "${p.topic}", Level: "${p.highestUnlockedLevel}"`);
    });
    
    process.exit(0);
}

checkUserProgress();
