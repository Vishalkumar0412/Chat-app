import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(400).json({
        message: "Unauthorized User access",
        success: false,
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(400).json({
        message: "Invailed token",
        success: false,
      });
    }
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "user not found ",
        success: false,
      });
    }
    req.user=user
    next()

  } catch (error) {
    return res.status(500).json({
        success:false,
        message:error.message
    })
  }
};
