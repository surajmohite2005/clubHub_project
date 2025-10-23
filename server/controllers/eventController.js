import mongoose from "mongoose";
import Event from "../models/Event.js";
import Club from "../models/Club.js";
// Google Calendar link helper (UTC)
const pad = (n) => String(n).padStart(2, "0");

const toGCalDate = (d) => {
  const x = new Date(d);
  return (
    x.getUTCFullYear().toString() +
    pad(x.getUTCMonth() + 1) +
    pad(x.getUTCDate()) +
    "T" +
    pad(x.getUTCHours()) +
    pad(x.getUTCMinutes()) +
    "00Z"
  );
};

const getGoogleCalendarUrl = (event) => {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title || "",
    details: event.description || "",
    location: event.isOnline ? "" : event.location || "",
    dates: `${toGCalDate(event.startAt)}/${toGCalDate(event.endAt)}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};


// Admin: Create Event
export const createEvent = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const {
      clubId,
      title,
      description,
      category,
      tags,
      location,
      isOnline,
      startAt,
      endAt,
      bannerUrl,
      capacity,
      status = "draft",
    } = req.body;

    // Validate club ID
    if (!mongoose.Types.ObjectId.isValid(clubId)) {
      return res.status(400).json({ message: "Invalid club ID" });
    }

    // Check if club exists
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // Validate event time
    const start = new Date(startAt);
    const end = new Date(endAt);
    if (isNaN(start) || isNaN(end) || start >= end) {
      return res.status(400).json({ message: "Invalid start/end times" });
    }

    // Create event
    const event = await Event.create({
      club: clubId,
      title,
      description,
      category,
      tags,
      location,
      isOnline,
      startAt: start,
      endAt: end,
      bannerUrl,
      capacity,
      status,
      createdBy: req.user._id,
    });

    // Respond success
    res.status(201).json({ event });
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ message: "Server error creating event" });
  }
};


// Public: List Events with Filters
export const getEvents = async (req, res) => {
  try {
    const {
      q,
      clubId,
      category,
      tags,      // comma-separated
      upcoming,  // "true"
      past,      // "true"
      page = 1,
      limit = 12,
      sort = "startAt",
    } = req.query;

    // -------------------
    // Build filter object
    // -------------------
    const filter = {};

    // Search by keyword in title or description
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    // Filter by club ID (validate ObjectId)
    if (clubId && mongoose.Types.ObjectId.isValid(clubId)) {
      filter.club = clubId;
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by tags (comma-separated values)
    if (tags) {
      filter.tags = { $in: tags.split(",").map((t) => t.trim()) };
    }

    // -------------------
    // Date filters
    // -------------------
    const now = new Date();

    // Upcoming events: startAt >= now
    if (upcoming === "true") {
      filter.startAt = { ...(filter.startAt || {}), $gte: now };
    }

    // Past events: endAt < now
    if (past === "true") {
      filter.endAt = { ...(filter.endAt || {}), $lt: now };
    }

    // -------------------
    // Pagination & Sorting
    // -------------------
    const skip = (Number(page) - 1) * Number(limit);

    // Query events
    const events = await Event.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate("club", "name category")
      .select("-__v");

    // Total count for pagination
    const total = await Event.countDocuments(filter);

    // -------------------
    // Response
    // -------------------
    res.json({
      data: events.map((e) => ({
        ...e.toObject(),
        attendeesCount: e.attendees?.length || 0,
      })),
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ message: "Server error fetching events" });
  }
};



// Public: Get Event Details by ID
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    // Fetch event and populate club info
    const event = await Event.findById(id).populate("club", "name category");

    // If event not found
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Respond with event details
    res.json({
      event,
      attendeesCount: event.attendees?.length || 0,
      googleCalendarUrl: getGoogleCalendarUrl(event),
    });
  } catch (err) {
    console.error("Error fetching event by ID:", err);
    res.status(500).json({ message: "Server error fetching event" });
  }
};


// Public: Get Event Details by Slug
export const getEventBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // Find event by slug and populate club info
    const event = await Event.findOne({ slug }).populate("club", "name category");

    // If no event found
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Respond with event data
    res.json({
      event,
      attendeesCount: event.attendees?.length || 0,
      googleCalendarUrl: getGoogleCalendarUrl(event),
    });

  } catch (err) {
    console.error("Error fetching event by slug:", err);
    res.status(500).json({ message: "Server error fetching event" });
  }
};


// Admin: Update Event (slug stays locked if already published)
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate event ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    // Find event by ID
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Define which fields can be updated
    const allowed = [
      "title",
      "description",
      "category",
      "tags",
      "location",
      "isOnline",
      "startAt",
      "endAt",
      "bannerUrl",
      "capacity",
      "status",
    ];

    // Update only allowed fields
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    });

    // Validate start/end times
    if (event.startAt && event.endAt && new Date(event.startAt) >= new Date(event.endAt)) {
      return res.status(400).json({ message: "startAt must be before endAt" });
    }

    // Prevent slug changes if event already published
    if (event.status === "published" && req.body.slug && req.body.slug !== event.slug) {
      return res.status(400).json({ message: "Slug cannot be changed after publishing" });
    }

    // Track who updated it
    event.updatedBy = req.user._id;

    // Save updates
    await event.save();

    res.json({ event });
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ message: "Server error updating event" });
  }
};


// Admin: Delete Event
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate event ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    // Find event
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Delete event
    await event.deleteOne();

    res.json({ message: "Event deleted" });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ message: "Server error deleting event" });
  }
};

// Auth: RSVP toggle with capacity and status/time checks
export const toggleRSVP = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate event ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    // Find event and select necessary fields
    const event = await Event.findById(id).select("status endAt capacity attendees");
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check event status and end time
    if (event.status !== "published") {
      return res.status(400).json({ message: "Event is not published" });
    }
    if (new Date(event.endAt) <= new Date()) {
      return res.status(400).json({ message: "Event already ended" });
    }

    const userId = req.user._id.toString();
    const isGoing = event.attendees.some((u) => u.toString() === userId);

    if (isGoing) {
      // Remove user from attendees
      event.attendees = event.attendees.filter((u) => u.toString() !== userId);
      await event.save();
      return res.json({ going: false, attendeesCount: event.attendees.length });
    } else {
      // Add user to attendees if capacity allows
      if (event.capacity && event.attendees.length >= event.capacity) {
        return res.status(400).json({ message: "Event is full" });
      }
      event.attendees.push(req.user._id);
      await event.save();
      return res.json({ going: true, attendeesCount: event.attendees.length });
    }
  } catch (err) {
    console.error("Error updating RSVP:", err);
    res.status(500).json({ message: "Server error updating RSVP" });
  }
};
