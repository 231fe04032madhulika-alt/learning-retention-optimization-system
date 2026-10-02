require('dotenv').config();
const mongoose = require('mongoose');
const MockTest = require('./models/MockTest');

mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
.then(async () => {
    const test = await MockTest.findOne().sort({ createdAt: -1 });
    if(test) {
        console.log(JSON.stringify(test.questions[0], null, 2));
    } else {
        console.log("No tests found");
    }
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
