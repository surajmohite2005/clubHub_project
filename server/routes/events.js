import express from "express";
import { authenticate, authorizeRoles } from "../middleware/auth.js";
import {
  createEvent,
  getEvents,
  getEventById,
  getEventBySlug,
  updateEvent,
  deleteEvent,
  toggleRSVP,
} from "../controllers/eventController.js";

const router = express.Router();

// -------------------
// Public Routes
// -------------------
router.get("/", getEvents);              // List events with filters
router.get("/slug/:slug", getEventBySlug); // Get event by slug
router.get("/:id", getEventById);       // Get event by ID

// -------------------
// Admin-only Routes
// -------------------
router.post("/", authenticate, authorizeRoles("admin"), createEvent);      // Create event
router.patch("/:id", authenticate, authorizeRoles("admin"), updateEvent); // Update event
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteEvent); // Delete event

// -------------------
// Authenticated User Routes
// -------------------
router.post("/:id/rsvp", authenticate, toggleRSVP); // RSVP toggle

export default router;
