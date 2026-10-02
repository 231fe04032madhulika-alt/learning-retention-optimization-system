const MockTest = require('../models/MockTest');
const TestResult = require('../models/TestResult');
const User = require('../models/User');

require("dotenv").config();
const Groq = require("groq-sdk");

// Level ranking
const levelRank = {
    beginner: 1,
    intermediate: 2,
    advanced: 3,
    completed: 4
};

// ===============================
// GROQ TEST GENERATION
// ===============================
const generateAndCacheTest = async (topic, level) => {
    try {
        console.log("🔥 ENTERED generateAndCacheTest");
        console.log("Topic:", topic, "Level:", level);

        // check cache
        let test = await MockTest.findOne({ topic, level });

        if (test && test.questions?.length > 0) {
            // Check if the cached test is actually the broken fallback data
            const firstQuestionText = test.questions[0].questionText || "";
            const isCorrupt = firstQuestionText.includes("AI Generation was unavailable");
            
            if (!isCorrupt) {
                console.log("📦 Returning cleanly cached test");
                if (test && test.questions?.length > 0) return test;
            } else {
                console.log(`🗑️ Ignoring corrupted cache for "${topic}", forcing Groq API regeneration...`);
            }
        }

        if (!process.env.GROQ_API_KEY) {
            throw new Error("GROQ_API_KEY missing in .env");
        }

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const prompt = `
Generate EXACTLY 10 unique MCQ questions specifically for the following topic and level:

Topic: ${topic}
Level: ${level}

Ensure the questions perfectly match the difficulty of the requested level:
- beginner: Basic fundamentals, definitions, and simple direct recall.
- intermediate: Applied concepts, moderate complexity, and deeper understanding.
- advanced: Complex edge cases, multi-step problem solving, and high-level analysis.

Make sure questions from different levels are distinct and do not repeat.
Return ONLY strict JSON format array:
[
  {
    "questionText": "",
    "options": ["A","B","C","D"],
    "correctAnswer": ""
  }
]
`;

        console.log("🚀 Calling Groq API");

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5
        });

        let text = completion.choices[0]?.message?.content || "";

        console.log("✅ Groq response received");
        console.log("📄 RAW GROQ RESPONSE:", text);

        // The Groq response may contain extra text, strip anything outside JSON
        const firstBracket = text.indexOf('[');
        const lastBracket = text.lastIndexOf(']');
        if (firstBracket !== -1 && lastBracket !== -1) {
            text = text.substring(firstBracket, lastBracket + 1);
        }

        let questions;

        try {
            questions = JSON.parse(text);
        } catch (err) {
            console.log("❌ JSON PARSE ERROR");
            console.log(text);
            throw err;
        }

        if (!Array.isArray(questions)) {
            throw new Error("Invalid format from Groq");
        }

        console.log("🎯 Questions generated:", questions.length);

        if (!test) {
            test = new MockTest({
                topic,
                level,
                questions
            });
        } else {
            test.questions = questions;
        }

        await test.save();

        return test;

    } catch (error) {
        console.log("🔥 GROQ ERROR FULL:");
        console.log(error);
        throw error;
    }
};

// ===============================
// AUTH CHECK
// ===============================
const isAuthorized = async (userId, topic, requestedLevel) => {
    const user = await User.findById(userId);
    if (!user) return false;

    const progress = user.topicProgress.find(p => p.topic === topic);
    if (!progress) return false;

    return levelRank[progress.highestUnlockedLevel] >= levelRank[requestedLevel];
};

// ===============================
// BEGINNER TEST
// ===============================
const getBeginnerTest = async (req, res) => {
    try {
        console.log("🔥 BEGINNER TEST API HIT");

        const { topic } = req.query;
        const userId = req.user.id;

        const authorized = await isAuthorized(userId, topic, 'beginner');
        if (!authorized) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const test = await generateAndCacheTest(topic, 'beginner');

        return res.json(test);

    } catch (error) {
        console.log("❌ BEGINNER ERROR:", error);
        return res.status(500).json({ error: error.message });
    }
};

// ===============================
// INTERMEDIATE TEST
// ===============================
const getIntermediateTest = async (req, res) => {
    try {
        console.log("🔥 INTERMEDIATE TEST API HIT");

        const { topic } = req.query;
        const userId = req.user.id;

        const authorized = await isAuthorized(userId, topic, 'intermediate');
        if (!authorized) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const test = await generateAndCacheTest(topic, 'intermediate');

        return res.json(test);

    } catch (error) {
        console.log("❌ INTERMEDIATE ERROR:", error);
        return res.status(500).json({ error: error.message });
    }
};

// ===============================
// ADVANCED TEST
// ===============================
const getAdvancedTest = async (req, res) => {
    try {
        console.log("🔥 ADVANCED TEST API HIT");

        const { topic } = req.query;
        const userId = req.user.id;

        const authorized = await isAuthorized(userId, topic, 'advanced');
        if (!authorized) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const test = await generateAndCacheTest(topic, 'advanced');

        return res.json(test);

    } catch (error) {
        console.log("❌ ADVANCED ERROR:", error);
        return res.status(500).json({ error: error.message });
    }
};

// ===============================
// SUBMIT TEST
// ===============================
const submitTest = async (req, res) => {
    try {
        const userId = req.user.id;
        const { topic, level, answers } = req.body;

        const test = await generateAndCacheTest(topic, level);

        let score = 0;

        test.questions.forEach((q, i) => {
            const selected = (answers[i]?.selectedOption || "").trim();
            const correct = (q.correctAnswer || "").trim();

            if (selected === correct) {
                score++;
            } else if (/^[A-D]$/i.test(correct)) {
                // Handle cases where AI returns 'A', 'B', 'C', or 'D' instead of full text
                const letterIndex = correct.toUpperCase().charCodeAt(0) - 65; // A=0, B=1...
                if (q.options[letterIndex] && selected === q.options[letterIndex].trim()) {
                    score++;
                }
            } else if (selected.toLowerCase().startsWith(correct.toLowerCase().charAt(0) + ")") || 
                       selected.toLowerCase().startsWith(correct.toLowerCase().charAt(0) + ".")) {
                // Secondary fallback if AI formatted it slightly differently
                score++;
            }
        });

        let unlockedNextLevel = false;
        const passThreshold = 0.7; // 70% thresholds
        
        if (score / test.questions.length >= passThreshold) {
            const user = await User.findById(userId);
            if (user) {
                const progressIndex = user.topicProgress.findIndex(p => p.topic === topic);
                if (progressIndex !== -1) {
                    const currentLevelRank = levelRank[user.topicProgress[progressIndex].highestUnlockedLevel];
                    const testLevelRank = levelRank[level];
                    
                    if (testLevelRank === currentLevelRank) {
                        let nextLevel = 'intermediate';
                        if (level === 'intermediate') nextLevel = 'advanced';
                        if (level === 'advanced') nextLevel = 'completed';
                        
                        user.topicProgress[progressIndex].highestUnlockedLevel = nextLevel;
                        await user.save();
                        unlockedNextLevel = true;
                    }
                }
            }
        } else {
            // User failed the test. 
            // Delete the cached test so they get a fresh set of AI questions on their next attempt!
            console.log(`🗑️ User failed ${level} test on "${topic}". Deleting cache to force regeneration on retake.`);
            await MockTest.deleteOne({ topic, level });
        }

        const result = await TestResult.create({
            userId,
            topic,
            level,
            score,
            totalQuestions: test.questions.length
        });

        return res.status(201).json({
            message: "Test submitted",
            result,
            unlockedNextLevel
        });

    } catch (error) {
        console.log("❌ SUBMIT ERROR:", error);
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getBeginnerTest,
    getIntermediateTest,
    getAdvancedTest,
    submitTest
};