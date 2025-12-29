import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectedRoutes = async (req, res, next) => {
  try {
    const token = req.cookies?.authToken;

    if (!token) {
      return res.status(401).json({
        message: "Authentication token not provided"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select(
      "_id fullname email role status"
    )
    if(!user) return res.status(401).json({message: "Unauthorized: User not found"})
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized: Invalid or expired authentication token"
    });
  }
};