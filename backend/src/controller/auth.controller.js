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
export const login = (req, res) => {
  const {email,password}=req.body
  try {
    if(!email || !password){
        return res.status(400).json({
            message: "All Fields Are Required",
            success: false,
          });
    }
    
  } catch (error) {
    
  }
};
export const logout = (req, res) => {
  res.send("logout route");
};
