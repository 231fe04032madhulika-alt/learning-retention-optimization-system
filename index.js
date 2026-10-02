require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app"); // this loads your express app
const { startReminderJob } = require("./services/reminderJob"); // Import the cron job

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  driverInfo: { name: "Mongoose", version: "9" },
})
.then(() => {
  console.log("MongoDB Local Connected");

  // Start the background job for email reminders
  startReminderJob();

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error("MongoDB Connection Error:", err);
});