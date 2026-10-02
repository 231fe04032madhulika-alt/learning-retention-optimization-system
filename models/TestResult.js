const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        topic: {
            type: String,
            required: true,
        },
        level: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced'],
            required: true,
        },
        score: {
            type: Number,
            required: true,
        },
        totalQuestions: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('TestResult', testResultSchema);
