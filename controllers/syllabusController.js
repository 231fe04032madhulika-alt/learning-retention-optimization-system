const Syllabus = require('../models/Syllabus');

// @desc    Upload Syllabus
// @route   POST /api/syllabus/upload
// @access  Private
const uploadSyllabus = async (req, res) => {
    try {
        const { subject, topics } = req.body;

        // Strictly clean topic names and map unit properties
        const cleanedTopics = topics.map(t => {
            if (t.name) {
                t.name = t.name.replace(/[^\x20-\x7E\n\r\t]/g, '').replace(/[\uFFFD\u0000-\u001F\u007F-\uFFFF]/g, '').trim();
            }
            if (!t.unit) {
                t.unit = "General Syllabus";
            }
            return t;
        }).filter(t => t.name && t.name.length > 0);

        // Create a new syllabus mapped to logged-in user
        const newSyllabus = new Syllabus({
            userId: req.user.id,
            subject,
            topics: cleanedTopics,
        });

        const savedSyllabus = await newSyllabus.save();

        res.status(201).json({
            message: 'Syllabus uploaded successfully',
            syllabus: savedSyllabus,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    uploadSyllabus,
};
