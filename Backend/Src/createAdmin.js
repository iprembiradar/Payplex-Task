require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/UserModels");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const existingAdmin = await User.findOne({ email: "admin@gmail.com" });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const admin = new User({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      isVerified: true,
      role: "admin"
    });

    await admin.save();

    console.log("Admin created successfully");
    console.log("Email: admin@gmail.com");
    console.log("Password: Admin@123");
    process.exit();
  } catch (error) {
    console.log("CREATE ADMIN ERROR:", error);
    process.exit(1);
  }
};

createAdmin();