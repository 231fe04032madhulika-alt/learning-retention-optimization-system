const mongoose = require('mongoose');

const mockTestSchema = new mongoose.Schema(
    {
        topic: {
            type: String,
            required: true,
        },
        educationLevel: {
            type: String,
            required: true,
            default: 'General'
        },
        course: {
            type: String,
            default: 'General'
        },
        branch: {
            type: String,
            default: 'General'
        },
        level: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced'],
            required: true,
        },
        questions: [
            {
                questionText: {
                    type: String,
                    required: true,
                },
                options: [
                    {
                        type: String,
                        required: true,
                    },
                ],
                correctAnswer: {
                    type: String,
                    required: true,
                },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('MockTest', mockTestSchema);
