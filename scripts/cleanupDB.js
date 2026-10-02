const mongoose = require('mongoose');
const Syllabus = require('../models/Syllabus');
const StudySchedule = require('../models/StudySchedule');
const User = require('../models/User');

require('dotenv').config();

const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/assistant";

async function cleanDB() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB for cleanup");

        // We want to delete corrupted topics. Binary data usually has non-printable characters or is extremely long.
        // A simple heuristic: if a topic name contains non-ascii characters or control characters, or is exceptionally long (>200 chars), we remove it.
        // Wait, just regex matching unusual binary bytes: /[^\x20-\x7E]/ (non-printable ascii, but allows regular text).
        // Actually, some binary strings are just garbage. Let's delete anything with \u0000 (\x00) or other control chars, or length > 500.

        // Clean Syllabus topics
        const syllabuses = await Syllabus.find({});
        for (const syl of syllabuses) {
            let originalCount = syl.topics.length;
            syl.topics = syl.topics.filter(t => {
                // Keep if it's short-ish and mostly readable
                // Reject if has \x00 or \ufffd (replacement char)
                if (t.name.includes('\x00') || t.name.includes('\ufffd') || t.name.length > 300 || /[^\x00-\x7F]/.test(t.name) && t.name.length > 100) {
                    return false; // remove
                }
                return true;
            });
            if (syl.topics.length !== originalCount) {
                console.log(`Cleaned syllabus ${syl._id}`);
                await syl.save();
            }
        }

        // Clean StudySchedules
        const schedules = await StudySchedule.find();
        for (const s of schedules) {
            if (s.topic.includes('\x00') || s.topic.includes('\ufffd') || s.topic.length > 300) {
                await StudySchedule.deleteOne({ _id: s._id });
                console.log(`Deleted corrupted schedule entry for topic ${s.topic.substring(0,20)}...`);
            }
        }

        // Clean User Progress
        const users = await User.find();
        for (const u of users) {
            if (u.topicProgress && u.topicProgress.length > 0) {
                let initialLen = u.topicProgress.length;
                u.topicProgress = u.topicProgress.filter(p => {
                    return !(p.topic.includes('\x00') || p.topic.includes('\ufffd') || p.topic.length > 300);
                });
                if (u.topicProgress.length !== initialLen) {
                    await User.updateOne({ _id: u._id }, { topicProgress: u.topicProgress }, { runValidators: false });
                    console.log(`Cleaned progress for user ${u._id}`);
                }
            }
        }

        console.log("Cleanup complete");
        mongoose.connection.close();
    } catch (err) {
        console.error("Cleanup error:", err);
        mongoose.connection.close();
    }
}

cleanDB();
