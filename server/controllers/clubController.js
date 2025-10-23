import mongoose from "mongoose";
import Club from "../models/Club.js";
import User from "../models/User.js";




// Create a club (admin only by default)
export const createClub = async (req, res) => {
try {
const { name, description, category, tags, logoUrl, coverImageUrl, socials } = req.body;



const exists = await Club.findOne({ name: new RegExp(`^${name}$`, "i") });
if (exists) return res.status(400).json({ message: "Club with this name already exists" });

const club = await Club.create({
  name,
  description,
  category,
  tags,
  logoUrl,
  coverImageUrl,
  socials,
  createdBy: req.user._id,
  admins: [req.user._id],
});

res.status(201).json({ club });
} catch (err) {
console.error(err);
res.status(500).json({ message: "Server error creating club" });
}
};

// List clubs with search/filter/pagination/sort
export const getClubs = async (req, res) => {
try {
const { q, category, tags, page = 1, limit = 12, sort = "-createdAt" } = req.query;



const filters = {};
if (q) {
  filters.$or = [
    { name: { $regex: q, $options: "i" } },
    { description: { $regex: q, $options: "i" } },
  ];
}
if (category) filters.category = category;
if (tags) filters.tags = { $in: tags.split(",").map(t => t.trim()) };

const skip = (Number(page) - 1) * Number(limit);

const [clubs, total] = await Promise.all([
  Club.find(filters).sort(sort).skip(skip).limit(Number(limit)).select("-__v"),
  Club.countDocuments(filters),
]);

res.json({
  data: clubs,
  meta: {
    total,
    page: Number(page),
    limit: Number(limit),
    pages: Math.ceil(total / Number(limit)),
  },
});
} catch (err) {
console.error(err);
res.status(500).json({ message: "Server error fetching clubs" });
}
};

// Get single club
export const getClubById = async (req, res) => {
try {
const { id } = req.params;
if (!mongoose.Types.ObjectId.isValid(id))
return res.status(400).json({ message: "Invalid club id" });


const club = await Club.findById(id).populate("admins", "name email").populate("createdBy", "name email");
if (!club) return res.status(404).json({ message: "Club not found" });

res.json({ club });
} catch (err) {
console.error(err);
res.status(500).json({ message: "Server error fetching club" });
}
};

// Update club (owner/admin)
export const updateClub = async (req, res) => {
try {
const { id } = req.params;
if (!mongoose.Types.ObjectId.isValid(id))
return res.status(400).json({ message: "Invalid club id" });



const club = await Club.findById(id);
if (!club) return res.status(404).json({ message: "Club not found" });

const isManager =
  club.admins.some(a => a.toString() === req.user._id.toString()) ||
  req.user.role === "admin";
if (!isManager) return res.status(403).json({ message: "Not allowed to update this club" });

const allowed = ["name", "description", "category", "tags", "logoUrl", "coverImageUrl", "socials", "admins"];
allowed.forEach(field => {
  if (req.body[field] !== undefined) club[field] = req.body[field];
});

await club.save();
res.json({ club });
} catch (err) {
console.error(err);
res.status(500).json({ message: "Server error updating club" });
}
};

// Delete club (owner/admin)
export const deleteClub = async (req, res) => {
try {
const { id } = req.params;
if (!mongoose.Types.ObjectId.isValid(id))
return res.status(400).json({ message: "Invalid club id" });



const club = await Club.findById(id);
if (!club) return res.status(404).json({ message: "Club not found" });

const isManager =
  club.admins.some(a => a.toString() === req.user._id.toString()) ||
  req.user.role === "admin";
if (!isManager) return res.status(403).json({ message: "Not allowed to delete this club" });

await club.deleteOne();
res.json({ message: "Club deleted" });
} catch (err) {
console.error(err);
res.status(500).json({ message: "Server error deleting club" });
}
};

// Follow/Unfollow (toggle)
export const toggleFollowClub = async (req, res) => {
try {
const { id: clubId } = req.params;
if (!mongoose.Types.ObjectId.isValid(clubId))
return res.status(400).json({ message: "Invalid club id" });


const club = await Club.findById(clubId);
if (!club) return res.status(404).json({ message: "Club not found" });

const user = await User.findById(req.user._id);
const isFollowing = user.followedClubs.some(c => c.toString() === clubId);

if (isFollowing) {
  user.followedClubs = user.followedClubs.filter(c => c.toString() !== clubId);
  club.followerCount = Math.max(0, club.followerCount - 1);
  await Promise.all([user.save(), club.save()]);
  return res.json({ followed: false, followerCount: club.followerCount });
} else {
  user.followedClubs.push(clubId);
  club.followerCount += 1;
  await Promise.all([user.save(), club.save()]);
  return res.json({ followed: true, followerCount: club.followerCount });
}
} catch (err) {
console.error(err);
res.status(500).json({ message: "Server error updating follow" });
}
};