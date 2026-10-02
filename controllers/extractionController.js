const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const xlsx = require('xlsx');
const fs = require('fs');

// Configure multer storage (store in memory temporarily)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// @desc    Extract text from uploaded Syllabus File
// @route   POST /api/extract
// @access  Public (or Private depending on needs, sticking to simpler logic here)
const extractText = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        const file = req.file;
        const mimeType = file.mimetype;
        const extension = file.originalname.split('.').pop().toLowerCase();
        let extractedText = '';

        if (extension === 'pdf' || mimeType === 'application/pdf') {
            // PDF parsing
            const data = await pdfParse(file.buffer);
            extractedText = data.text;
        } else if (extension === 'docx' || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            // DOCX parsing
            const result = await mammoth.extractRawText({ buffer: file.buffer });
            extractedText = result.value;
        } else if (extension === 'xlsx' || mimeType.includes('spreadsheetml')) {
            // XLSX parsing
            const workbook = xlsx.read(file.buffer, { type: 'buffer' });
            extractedText = '';
            workbook.SheetNames.forEach(sheetName => {
                const sheet = workbook.Sheets[sheetName];
                const jsonSheet = xlsx.utils.sheet_to_json(sheet, { header: 1 });
                // Flatten row arrays and join by comma
                jsonSheet.forEach(row => {
                    extractedText += row.join(', ') + '\n';
                });
            });
        } else if (extension === 'txt' || extension === 'csv' || mimeType.includes('text/')) {
            // Direct text parsing
            extractedText = file.buffer.toString('utf-8');
        } else {
            return res.status(400).json({ message: 'Unsupported file format. Please upload .txt, .csv, .pdf, .docx, or .xlsx' });
        }

        // Strictly clean extracted text: Remove all non-ASCII characters and control chars (except newlines/tabs)
        // This removes binary garbage like \ufffd, replacement characters, etc.
        extractedText = extractedText.replace(/[^\x20-\x7E\n\r\t]/g, '');
        // Furthermore, remove sequences of weird characters or replace multiple spaces
        extractedText = extractedText.replace(/[\uFFFD\u0000-\u001F\u007F-\uFFFF]/g, '');
        // Compact multiple newlines and spaces to prevent huge gaps
        extractedText = extractedText.replace(/\n\s*\n/g, '\n').replace(/ {2,}/g, ' ');

        res.status(200).json({
            message: 'Text extracted successfully',
            text: extractedText.trim()
        });
    } catch (error) {
        console.error('Extraction Error:', error.message);
        res.status(500).json({ message: 'Failed to extract text from file.' });
    }
};

module.exports = {
    upload,
    extractText
};
