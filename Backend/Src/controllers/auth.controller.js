const User = require("../models/UserModels");
const bcrypt = require("bcryptjs");
const transporter = require("../config/mail");

////////////////////// REGISTER LOGIC ////////////////////////////////////////////////////////
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
      name,
      email,
      password: hashedPassword,
      otp,
      isVerified: false
    });

    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}`
    });

    res.json({
      success: true,
      message: "OTP sent successfully"
    });
  } catch (error) {
    console.log("REGISTER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed"
    });
  }
};

//////////////////////////// VERIFY  OTP    PASS///////////////////////////////////////////////////////////////
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.otp !== otp.toString()) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    await user.save();

    res.json({
      success: true,
      message: "Account verified successfully"
    });
  } catch (error) {
    console.log("VERIFY OTP ERROR:", error);
    res.status(500).json({
      success: false,
      message: "OTP verification failed"
    });
  }
};

///////////////////////////////////// LOGIN////////////////////////////////////////////////
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }

    if (!user.isVerified) {
      return res.json({
        success: false,
        message: "Please verify OTP first"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid password"
      });
    }

   res.json({
  success: true,
  message: "Login successful",
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  }
});
  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
};