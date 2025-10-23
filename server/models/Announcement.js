import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true },
    title: { type: String, required: true, trim: true, maxlength: 180 },
    content: { type: String, required: true, trim: true, maxlength: 5000 },
    images: [{ type: String }], // optional
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// Useful indexes
announcementSchema.index({ club: 1, createdAt: -1 });
announcementSchema.index({ title: "text", content: "text" });

export default mongoose.model("Announcement", announcementSchema);