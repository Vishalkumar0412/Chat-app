import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utills.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
export const signup = async (req, res) => {
  const { email, password, fullName } = req.body;
  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({
        message: "All Fields Are Required",
        success: false,
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        message: "Choose a Strong Password",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "Email Already Exist",
        success: false,
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    //gentrate Token
    await newUser.save();
    generateToken(newUser._id, res);
    return res.status(201).json({
      message: "User Created",
      success: true,
      newUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "All Fields Are Required",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Email or password Wrong",
        success: false,
      });
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(400).json({
        message: "Email or password Wrong",
        success: false,
      });
    }
    generateToken(user._id, res);

    return res.status(200).json({
      message: "Login successfull",
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({
      message: "Logout successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    if (!profilePic) {
      return res.status(400).json({
        message: "Profile Picture is not provided",
        success: false,
      });
    }
    const uploadRes = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadRes.secure_url },
      { new: true }
    );
    return res.status(200).json({});
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
export const checkAuth = async (req, res) => {
  try {
    return res
      .status(200)
      .json({ user: req.user, message: "User is authorized", success: true });
  } catch (error) {
    return res.status(500).json({
      message: "user not authorized",
      success: false,
    });
  }
};
