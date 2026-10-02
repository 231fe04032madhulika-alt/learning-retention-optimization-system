require("dotenv").config();
const mongoose = require("mongoose");
const StudySchedule = require("./models/StudySchedule");
const User = require("./models/User");

async function checkSchedules() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const now = new Date();
        const future5Mins = new Date(now.getTime() + 5 * 60000);
        console.log("Current time:", now);
        console.log("Future 5 mins:", future5Mins);

        const allSchedules = await StudySchedule.find({ completed: false }).populate("userId", "email name");
        console.log(`Total uncompleted schedules: ${allSchedules.length}`);

        for (const schedule of allSchedules) {
            console.log(`- ID: ${schedule._id}`);
            console.log(`  User Email: ${schedule.userId?.email}`);
            console.log(`  Topic: ${schedule.topic}`);
            console.log(`  Scheduled Time: ${schedule.scheduledTime}`);
            console.log(`  Reminded: ${schedule.reminded}`);
            console.log(`  <= future5Mins? : ${schedule.scheduledTime <= future5Mins}`);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
checkSchedules();
