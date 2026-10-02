const mongoose = require('mongoose');

const studyScheduleSchema = new mongoose.Schema(
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
        unit: {
            type: String,
            default: "General",
        },
        topic: {
            type: String,
            required: true,
        },
        scheduledTime: {
            type: Date,
            required: true,
        },
        completed: {
            type: Boolean,
            default: false,
        },
        reminded: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('StudySchedule', studyScheduleSchema);
