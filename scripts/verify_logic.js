const mongoose = require('mongoose');
require('dotenv').config();

const MockTest = require('../models/MockTest');

const findTestWithFallback = async (requestedTopic, level) => {
    let test = await MockTest.findOne({ topic: { $regex: new RegExp(`^${requestedTopic}$`, 'i') }, level });
    if (!test) {
        const allTopics = await MockTest.distinct('topic');
        const matchedTopic = allTopics.find(t => {
            const reqWords = requestedTopic.toLowerCase().split(/[\s,.-]+/);
            const tWords = t.toLowerCase().split(/[\s,.-]+/);
            return reqWords.some(w => tWords.includes(w));
        });
        if (matchedTopic) {
            test = await MockTest.findOne({ topic: matchedTopic, level });
        }
    }
    return test;
};

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/assistant");
        console.log("Connected to MongoDB for verification");
        
        // 1. Verify Fallback Match
        const t1 = await findTestWithFallback("Python Basics", "beginner");
        console.log("Python Basics matched to:", t1 ? t1.topic : "Not Found");
        
        const t2 = await findTestWithFallback("Advanced Data Structures", "advanced");
        console.log("Advanced Data Structures matched to:", t2 ? t2.topic : "Not Found");
        
        // 2. Verify Scheduling logic isolated
        const syllabus = {
            subject: "Computer Science",
            topics: [
                { name: "Binary Trees" }, // 2 words - 1 day
                { name: "Machine Learning Fundamentals" }, // 3 words - 2 days
                { name: "Short" } // 1 word - 1 day
            ]
        };
        
        let currentDate = new Date();
        let semesterEnd = new Date(currentDate.getTime() + 10 * 24*60*60*1000); // 10 days from now
        
        let isFirst = true;

        const getNextSlot = (date, prefHour, prefMin, isFirstSlot, endDate) => {
            let d = new Date(date);
            if (!isFirstSlot) {
                if (d.getDay() === 0 && d.getHours() === 10) d.setHours(17, 0, 0, 0);
                else {
                    d.setDate(d.getDate() + 1);
                    if (d.getDay() === 0) d.setHours(10, 0, 0, 0);
                    else d.setHours(prefHour, prefMin, 0, 0);
                }
            } else {
                if (d.getDay() === 0) d.setHours(10, 0, 0, 0);
                else d.setHours(prefHour, prefMin, 0, 0);
            }
            let endBound = new Date(endDate);
            endBound.setHours(23, 59, 59, 999);
            if (d > endBound) return null;
            return d;
        };

        const schedules = [];
        let syllabuses = [syllabus];

        for (const syll of syllabuses) {
            for (const topic of syll.topics) {
                let nextSlot = getNextSlot(currentDate, 17, 0, isFirst, semesterEnd);
                if (!nextSlot) break;
                currentDate = nextSlot;
                isFirst = false;

                schedules.push({ topic: topic.name, date: new Date(currentDate) });

                const words = topic.name.split(' ').length;
                if (words >= 3 || topic.name.length > 20) {
                    let extraSlot = getNextSlot(currentDate, 17, 0, isFirst, semesterEnd);
                    if (extraSlot) {
                        currentDate = extraSlot;
                        schedules.push({ topic: topic.name + ' (Part 2)', date: new Date(currentDate) });
                    }
                }
            }
        }

        let rSlotCheck = getNextSlot(currentDate, 17, 0, isFirst, semesterEnd);
        if (rSlotCheck) {
            let revisionTopics = [];
            for (const syll of syllabuses) {
                for (const topic of syll.topics) {
                     revisionTopics.push({ name: topic.name + ' (Revision)' });
                }
            }
            
            for (const revTopic of revisionTopics) {
                let rSlot = getNextSlot(currentDate, 17, 0, isFirst, semesterEnd);
                if (!rSlot) break;
                currentDate = rSlot;
                schedules.push({ topic: revTopic.name, date: new Date(currentDate) });
            }
        }

        console.log("\nGenerated Schedule:");
        schedules.forEach((s, i) => {
            console.log(`Day ${i+1}: ${s.topic} at ${s.date.toISOString()}`);
        });

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await mongoose.connection.close();
        console.log("Verification finished.");
    }
}
run();
