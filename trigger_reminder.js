require("dotenv").config();
const mongoose = require("mongoose");
const StudySchedule = require("./models/StudySchedule");
const User = require("./models/User");
const { sendStudyReminder } = require('./services/emailService');

async function testReminder() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const now = new Date();
        const future5Mins = new Date(now.getTime() + 5 * 60000);
        console.log("Future 5 mins:", future5Mins);

        const upcomingSchedules = await StudySchedule.find({
            scheduledTime: { $lte: future5Mins },
            completed: false,
            reminded: { $ne: true }
        }).populate('userId', 'email name');

        console.log(`Found ${upcomingSchedules.length} schedules to remind.`);

        for (const schedule of upcomingSchedules) {
            console.log(`Attempting to send email for schedule: ${schedule._id}`);
            if (schedule.userId && schedule.userId.email) {
                try {
                    await sendStudyReminder(
                        schedule.userId.email,
                        schedule.subject,
                        schedule.unit,
                        schedule.topic,
                        schedule.scheduledTime,
                        schedule._id
                    );
                    schedule.reminded = true;
                    await schedule.save();
                    console.log(`Successfully sent to ${schedule.userId.email} and marked as reminded.`);
                } catch (emailError) {
                    console.error(`Email Error for ${schedule.userId.email}:`, emailError);
                }
            } else {
                console.log(`No valid email found for userId:`, schedule.userId);
            }
        }
        process.exit(0);
    } catch (err) {
        console.error("Main Error:", err);
        process.exit(1);
    }
}
testReminder();
