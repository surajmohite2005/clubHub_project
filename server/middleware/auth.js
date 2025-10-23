import jwt from "jsonwebtoken";
import User from "../models/User.js";
export const authenticate = async(req, res, next) => {
  console.log("yes in authenticate")
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("name email role followedClubs");
    req.user =user; // Attach user id to request object
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalid or expired" });
  }
};


export const authorizeRoles = (...roles) => (req, res, next) => {
  console.log("yes in autherze role")
if (!roles.includes(req.user.role)) {
return res.status(403).json({ message: "Forbidden: insufficient rights"});
}
next();
};