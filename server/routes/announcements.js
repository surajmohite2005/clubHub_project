import express from "express";
import {
  createAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  deleteAnnouncement,
  getFeed,
} from "../controllers/announcementController.js";
import { authenticate, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Feed must come before :id to avoid route conflicts
router.get("/feed/me", authenticate, getFeed);

// Public
router.get("/", getAnnouncements);
router.get("/:id", getAnnouncementById);

// Admin-only
router.post("/", authenticate, authorizeRoles("admin"), createAnnouncement);
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteAnnouncement);

export default router;