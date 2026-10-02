const StudySchedule = require('../models/StudySchedule');
const Syllabus = require('../models/Syllabus');
const User = require('../models/User');

// Helper function to get the next valid slot for a topic
function getNextSlot(date, prefHour, prefMin, isFirstSlot, endDate) {
    let d = new Date(date);
    if (!isFirstSlot) {
        if (d.getDay() === 0 && d.getHours() === 10) {
            // Already scheduled Sunday morning, so use Sunday evening
            d.setHours(17, 0, 0, 0);
        } else {
            d.setDate(d.getDate() + 1);
            // Set time based on day
            if (d.getDay() === 0) {
                d.setHours(10, 0, 0, 0);
            } else {
                d.setHours(prefHour, prefMin, 0, 0);
            }
        }
    } else {
        // Initialization for the very first generated slot
        if (d.getDay() === 0) {
            d.setHours(10, 0, 0, 0);
        } else {
            d.setHours(prefHour, prefMin, 0, 0);
        }
    }
    
    // Validate bounds
    let endBound = new Date(endDate);
    endBound.setHours(23, 59, 59, 999);
    if (d > endBound) {
        return null;
    }

    return d;
}

// @desc    Generate Study Plan
// @route   POST /api/schedule/generate
// @access  Private
const generateSchedule = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(401).json({ message: 'User not found.' });
        }

        // Fallback defaults for legacy accounts
        let prefHour = 17, prefMin = 0;
        if (user.preferredStudyTimeRange && user.preferredStudyTimeRange.start) {
            [prefHour, prefMin] = user.preferredStudyTimeRange.start.split(':').map(Number);
        }

        let semesterStart = user.semesterStartDate ? new Date(user.semesterStartDate) : new Date();
        let semesterEnd = user.semesterEndDate ? new Date(user.semesterEndDate) : new Date(new Date().setMonth(new Date().getMonth() + 4));

        const syllabuses = await Syllabus.find({ userId });

        if (!syllabuses || syllabuses.length === 0) {
            return res.status(400).json({ message: 'No syllabus found to generate schedule. Please upload a syllabus first.' });
        }

        const schedules = [];
        // Ensure starting point is not in the past relative to today if the semester already started
        const startTimestamp = Math.max(semesterStart.getTime(), new Date().getTime());
        let currentDate = new Date(startTimestamp);
        let isFirst = true;

        for (const syllabus of syllabuses) {
            for (const topic of syllabus.topics) {
                let nextSlot = getNextSlot(currentDate, prefHour, prefMin, isFirst, semesterEnd);
                if (!nextSlot) {
                    console.log('Reached semester end limit during scheduling.');
                    break;
                }
                currentDate = nextSlot;
                isFirst = false;

                const newSchedule = new StudySchedule({
                    userId,
                    subject: syllabus.subject,
                    unit: topic.unit || "General Syllabus",
                    topic: topic.name,
                    scheduledTime: new Date(currentDate),
                });

                schedules.push(newSchedule);
            }
        }

        // Revision Cycle
        let rSlotCheck = getNextSlot(currentDate, prefHour, prefMin, isFirst, semesterEnd);
        if (rSlotCheck) {
            let revisionTopics = [];
            for (const syllabus of syllabuses) {
                for (const topic of syllabus.topics) {
                     revisionTopics.push({ subject: syllabus.subject, name: topic.name + ' (Revision)' });
                }
            }
            
            for (const revTopic of revisionTopics) {
                let rSlot = getNextSlot(currentDate, prefHour, prefMin, isFirst, semesterEnd);
                if (!rSlot) break;
                currentDate = rSlot;
                
                schedules.push(new StudySchedule({
                    userId,
                    subject: revTopic.subject,
                    topic: revTopic.name,
                    scheduledTime: new Date(currentDate),
                }));
            }
        }

        await StudySchedule.deleteMany({ userId, completed: false });
        await StudySchedule.insertMany(schedules);

        res.status(201).json({
            message: 'Study schedule generated successfully',
            schedules,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// Helper: Reschedule missed topics to next available future dates within bounds (Domino shift forwards)
const rescheduleMissedTopics = async (userId) => {
    const user = await User.findById(userId);
    if (!user) return;
    
    let prefHour = 17, prefMin = 0;
    if (user.preferredStudyTimeRange && user.preferredStudyTimeRange.start) {
        [prefHour, prefMin] = user.preferredStudyTimeRange.start.split(':').map(Number);
    }
    
    let semesterEnd = user.semesterEndDate ? new Date(user.semesterEndDate) : new Date();
    const minEnd = new Date(new Date().setMonth(new Date().getMonth() + 4));
    if (semesterEnd < minEnd) {
        semesterEnd = minEnd; // pad out the end date so rollovers are never abruptly cancelled
    }

    const startOfTodayForOverdue = new Date();
    startOfTodayForOverdue.setHours(0, 0, 0, 0);

    const overdueCount = await StudySchedule.countDocuments({
        userId,
        completed: false,
        scheduledTime: { $lt: startOfTodayForOverdue }
    });

    // If there's nothing overdue, no need to shift schedules
    if (overdueCount === 0) return;

    // Domino effect: take ALL uncompleted schedules, sort chronologically, and re-assign from today onwards
    const allUncompleted = await StudySchedule.find({
        userId,
        completed: false
    }).sort({ scheduledTime: 1 });

    let currentDate = new Date();
    let isFirst = true;

    for (const schedule of allUncompleted) {
        let nextSlot = getNextSlot(currentDate, prefHour, prefMin, isFirst, semesterEnd);
        if (!nextSlot) break; 
        
        currentDate = nextSlot;
        isFirst = false;
        
        // Add Carry Forward safely to topics dynamically shifting forward
        if (!schedule.topic.startsWith('Carry Forward: ') && !schedule.topic.includes('(Revision)')) {
            schedule.topic = `Carry Forward: ${schedule.topic}`;
        }
        
        schedule.scheduledTime = new Date(currentDate);
        schedule.reminded = false; // Reset reminder for the new time
        await schedule.save();
    }
};

// @desc    Get today's topics
// @route   GET /api/schedule/today
// @access  Private
const getTodaySchedule = async (req, res) => {
    try {
        const userId = req.user.id;

        // Auto-complete schedules for topics that have reached 100% mastery via mock tests
        const user = await User.findById(userId);
        if (user) {
            const completedTopics = user.topicProgress
                .filter(p => p.highestUnlockedLevel === 'completed')
                .map(p => p.topic);

            if (completedTopics.length > 0) {
                const uncompletedSchedules = await StudySchedule.find({ userId, completed: false });
                for (const schedule of uncompletedSchedules) {
                    let cleanTopicName = schedule.topic.replace('Carry Forward: ', '');
                    if (completedTopics.includes(cleanTopicName)) {
                        schedule.completed = true;
                        await schedule.save();
                    }
                }
            }
        }

        await rescheduleMissedTopics(userId);

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const todaySchedules = await StudySchedule.find({
            userId,
            scheduledTime: { $gte: startOfToday, $lte: endOfToday }
        });

        res.json(todaySchedules);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Mark topic done
// @route   POST /api/schedule/done
// @access  Private
const markTopicDone = async (req, res) => {
    try {
        const userId = req.user.id;
        const { scheduleId } = req.body;

        const schedule = await StudySchedule.findOne({ _id: scheduleId, userId });

        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        schedule.completed = true;
        await schedule.save();

        const user = await User.findById(userId);
        if (user) {
            const topicProgression = user.topicProgress.find(p => p.topic === schedule.topic);
            if (!topicProgression) {
                await User.updateOne(
                    { _id: userId },
                    { $push: { topicProgress: { topic: schedule.topic, highestUnlockedLevel: 'beginner' } } }
                );
            }
        }

        res.json({ message: 'Topic marked as completed', schedule });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    generateSchedule,
    getTodaySchedule,
    markTopicDone
};
