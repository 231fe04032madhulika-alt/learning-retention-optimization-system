const mongoose = require('mongoose');

const syllabusSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
        topics: [
            {
                unit: {
                    type: String, // e.g. "UNIT-1"
                    default: "General",
                },
                name: {
                    type: String,
                    required: true,
                },
                priority: {
                    type: Number, // e.g., 1 (High), 2 (Medium), 3 (Low)
                    default: 2,
                },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Syllabus', syllabusSchema);
