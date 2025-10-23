import express from "express";
import {
createClub,
getClubs,
getClubById,
updateClub,
deleteClub,
toggleFollowClub,
} from "../controllers/clubController.js";
import { authenticate, authorizeRoles } from "../middleware/auth.js";
const router = express.Router();

// Public
router.get("/", getClubs);
router.get("/:id", getClubById);

// Create (admin only). If you want any user to create their own club, replace authorizeRoles("admin") with authenticate
router.post("/", authenticate, authorizeRoles("admin"), createClub);

// Update/Delete (club manager or admin)
router.patch("/:id", authenticate,authorizeRoles("admin"), updateClub);
router.delete("/:id", authenticate,authorizeRoles("admin"), deleteClub);

// Follow/Unfollow (toggle)
router.post("/:id/follow", authenticate, toggleFollowClub);

export default router;