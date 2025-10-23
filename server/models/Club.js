import mongoose from "mongoose";
const clubSchema = new mongoose.Schema(
{
name: { type: String, required: true, trim: true, unique: true },
description: { type: String, required: true, trim: true },
category: {
type: String,
enum: ["Technical", "Cultural", "Sports", "Arts", "Music", "Literary", "Other"],
default: "Other",
},
tags: [{ type: String, trim: true }],
logoUrl: { type: String },
coverImageUrl: { type: String },
socials: {
    website: String,
    instagram: String,
    linkedin: String,
    email: String,
},
createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // club admins
followerCount: { type: Number, default: 0 },
},
{ timestamps: true }
);

// Basic text search on name/description
clubSchema.index({ name: "text", description: "text" });

export default mongoose.model("Club", clubSchema);