import express from "express";
import { registerUser, loginUser, logoutUser,getCurrentUser } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authenticate, logoutUser); // optional protection
router.get("/isAuthenticate", authenticate, getCurrentUser);
export default router;
