const cron = require('node-cron');
const StudySchedule = require('../models/StudySchedule');
const { sendStudyReminder } = require('./emailService');

const startReminderJob = () => {
    // Run every minute to check for upcoming study schedules
    cron.schedule('* * * * *', async () => {
        try {
            const now = new Date();
            // Check for tasks scheduled <= 5 minutes from now. 
            // Running every minute, this reliably triggers exactly 5 mins before.
            const future5Mins = new Date(now.getTime() + 5 * 60000);
            
            // Find schedules approaching closely (or mildly overdue but forgotten)
            const upcomingSchedules = await StudySchedule.find({
                scheduledTime: { $lte: future5Mins },
                completed: false,
                reminded: { $ne: true }
            }).populate('userId', 'email name');

            if (upcomingSchedules.length > 0) {
                console.log(`Found ${upcomingSchedules.length} upcoming schedules approaching deadline to remind.`);
            }

            for (const schedule of upcomingSchedules) {
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
                        // Mark as reminded to avoid duplicate emails
                        schedule.reminded = true; 
                        await schedule.save();
                    } catch (emailError) {
                        console.error(`Failed to send reminder to ${schedule.userId.email}:`, emailError);
                        // We intentionally do not set schedule.reminded = true here
                        // so it can retry on the next cron tick in case of temporary network issues.
                    }
                }
            }
        } catch (error) {
            console.error('Error in reminder job:', error);
        }
    });
    
    console.log('Reminder cron job started.');
};

module.exports = { startReminderJob };
