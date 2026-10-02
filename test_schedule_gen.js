require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Syllabus = require('./models/Syllabus');
const StudySchedule = require('./models/StudySchedule');
const { generateSchedule } = require('./controllers/scheduleController');

async function testGen() {
    await mongoose.connect(process.env.MONGO_URI);
    const u = await User.findOne({email: '231fe04032.madhulika@gmail.com'});
    
    const req = { user: { id: u._id.toString() } };
    const res = {
        status: function(s) {
            console.log('Status:', s);
            return this;
        },
        json: function(d) {
            console.log('JSON:', d);
        },
        send: function(m) {
            console.log('Send:', m);
        }
    };
    
    console.log("Calling generateSchedule...");
    await generateSchedule(req, res);
    
    process.exit(0);
}
testGen();
