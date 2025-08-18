import { genrateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
 const { fullName, email, password, bio } = req.body;
 try {
 if (!fullName || !email || !password || !bio) {
 return res.status(400).json({ success: false, message: "Missing Details" });
 }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Account Already Exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });

    const token = genrateToken(newUser._id);

    res.status(201).json({
      success: true,
      userData: newUser,
      token,
      message: "Account Created Successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userData = await User.findOne({ email });
    if (!userData) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = genrateToken(userData._id);

    res.json({ success: true, userData, token, message: "Login Successful." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;
    let updatedUser;

    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(userId, { bio, fullName }, { new: true });
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: upload.secure_url, bio, fullName },
        { new: true }
      );
    }

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};