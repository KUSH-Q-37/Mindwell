const mongoose = require("mongoose");
const Resource = require("./models/Resource");
const User = require("./models/User");
const Mood = require("./models/Mood");
const Exercise = require("./models/Exercise");
const { resources, exercises } = require("./data/seedData");
require("dotenv").config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/mental-health-app"
    );
    console.log("Connected to MongoDB...");

    // Clear existing data
    await Resource.deleteMany({});
    await User.deleteMany({});
    await Mood.deleteMany({});
    await Exercise.deleteMany({});
    console.log("Cleared existing data...");

    // Insert Resources and Exercises
    await Resource.insertMany(resources);
    await Exercise.insertMany(exercises);
    console.log("Resources and Exercises inserted...");

    // Create Admin User
    const admin = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: 'password123',
      firstName: 'Admin',
      lastName: 'User'
    });
    await admin.save();
    console.log("Admin user created (admin@example.com / password123)...");

    // Create Sample Mood Data (30 days)
    const moodEntries = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        moodEntries.push({
            user: admin._id,
            mood: Math.floor(Math.random() * 6) + 4, // 4-10
            anxiety: Math.floor(Math.random() * 5) + 1,
            sleepHours: Math.floor(Math.random() * 4) + 5,
            physicalActivity: Math.floor(Math.random() * 60),
            socialInteraction: Math.floor(Math.random() * 8) + 2,
            date: date
        });
    }
    await Mood.insertMany(moodEntries);
    console.log("Sample mood history created...");

    await mongoose.disconnect();
    console.log("Database successfully seeded! 🌱");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
