require("dotenv").config();
const mongoose = require("mongoose");
const StudySchedule = require("./models/StudySchedule");

async function updateScheduleForTest() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const now = new Date();
        // Set to 3 minutes from now, so the cron job will pick it up on the next minute
        // Since the cron job runs every minute and checks if scheduledTime <= now + 5 mins
        const testTime = new Date(now.getTime() + 3 * 60000);
        
        const schedule = await StudySchedule.findOne({ completed: false, reminded: false }).sort({ scheduledTime: 1 });
        if (schedule) {
            schedule.scheduledTime = testTime;
            await schedule.save();
            console.log(`Updated schedule ${schedule._id} to ${testTime} to trigger reminder email.`);
        } else {
            console.log("No unreminded, uncompleted schedules found.");
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
updateScheduleForTest();
