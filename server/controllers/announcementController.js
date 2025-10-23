import mongoose from "mongoose";
import Announcement from "../models/Announcement.js";
import Club from "../models/Club.js";

// Admin: Create
export const createAnnouncement = async (req, res) => {
  try {
    const { clubId, title, content, images } = req.body;

    if (!mongoose.Types.ObjectId.isValid(clubId)) {
      return res.status(400).json({ message: "Invalid club id" });
    }
    const club = await Club.findById(clubId);
    if (!club) return res.status(404).json({ message: "Club not found" });

    const ann = await Announcement.create({
      club: clubId,
      title: title?.trim(),
      content: content?.trim(),
      images: Array.isArray(images) ? images : [],
      createdBy: req.user._id,
    });

    res.status(201).json({ announcement: ann });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error creating announcement" });
  }
};

// Public: List
export const getAnnouncements = async (req, res) => {
  try {
    const { q, clubId, page = 1, limit = 10, sort = "-createdAt" } = req.query;

    const filter = {};
    if (q) {
      // text search fallback with regex (works even without text index)
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
      ];
    }
    if (clubId && mongoose.Types.ObjectId.isValid(clubId)) {
      filter.club = clubId;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Announcement.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .populate("club", "name category")
        .select("-__v"),
      Announcement.countDocuments(filter),
    ]);

    res.json({
      data: items,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching announcements" });
  }
};

// Public: Detail
export const getAnnouncementById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid announcement id" });

    const ann = await Announcement.findById(id)
      .populate("club", "name category")
      .populate("createdBy", "name email");

    if (!ann) return res.status(404).json({ message: "Announcement not found" });

    res.json({ announcement: ann });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching announcement" });
  }
};

// Admin: Delete
export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid announcement id" });

    const ann = await Announcement.findById(id);
    if (!ann) return res.status(404).json({ message: "Announcement not found" });

    await ann.deleteOne();
    res.json({ message: "Announcement deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error deleting announcement" });
  }
};

// Auth: Feed for followed clubs
export const getFeed = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const followed = req.user?.followedClubs || [];
    if (!Array.isArray(followed) || followed.length === 0) {
      return res.json({ data: [], meta: { total: 0, page: Number(page), limit: Number(limit), pages: 0 } });
    }

    const skip = (Number(page) - 1) * Number(limit);
    const filter = { club: { $in: followed } };

    const [items, total] = await Promise.all([
      Announcement.find(filter)
        .sort("-createdAt")
        .skip(skip)
        .limit(Number(limit))
        .populate("club", "name category"),
      Announcement.countDocuments(filter),
    ]);

    res.json({
      data: items,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching feed" });
  }
};