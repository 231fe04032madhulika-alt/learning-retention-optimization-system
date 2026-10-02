require('dotenv').config();
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const topic = 'Thermodynamics';
const level = 'beginner';

const prompt = `
Generate EXACTLY 10 MCQ questions specifically for the following topic and level:

Topic: ${topic}
Level: ${level}

Ensure the questions perfectly match the difficulty of the requested level.
Return ONLY strict JSON format array:
[
  {
    "questionText": "",
    "options": ["A","B","C","D"],
    "correctAnswer": ""
  }
]
`;

console.log('Testing Groq... Requesting 10 questions for', topic);

groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.5
}).then(completion => {
    let text = completion.choices[0]?.message?.content || '';
    const firstBracket = text.indexOf('[');
    const lastBracket = text.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket !== -1) {
        text = text.substring(firstBracket, lastBracket + 1);
    }
    const questions = JSON.parse(text);
    console.log('Success! Parsed JSON array with length:', questions.length);
    console.log('Sample question text:', questions[0].questionText);
    console.log('Test PASSED.');
}).catch(err => {
    console.error('Groq Error:', err.message);
});
