require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const StudySchedule = require('./models/StudySchedule');

async function debug() {
    await mongoose.connect(process.env.MONGO_URI);
    
    const user = await User.findOne({ email: 'voleti1704@gmail.com' });
    if (!user) { console.log("User not found"); process.exit(); }
    
    const schedules = await StudySchedule.find({ userId: user._id });
    console.log(`Total schedules: ${schedules.length}`);
    const completed = schedules.filter(s => s.completed);
    console.log(`Completed schedules: ${completed.length}`);
    if (completed.length > 0) {
        console.log("Topics completed:");
        completed.forEach(s => console.log(s.topic));
    }
    
    console.log("User topic progress length:", user.topicProgress.length);
    process.exit(0);
}
debug();
