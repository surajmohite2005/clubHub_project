import mongoose from "mongoose";
import slugify from "slugify";
const eventSchema = new mongoose.Schema(
{
    club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, unique: true, index: true },
    description: { type: String, trim: true, maxlength: 5000 },
    category: {
    type: String,
    enum: ["Talk", "Workshop", "Competition", "Meetup", "Other"],
    default: "Other",
    },
    tags: [{ type: String, trim: true }],
    location: { type: String, trim: true },
    isOnline: { type: Boolean, default: false },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    bannerUrl: { type: String },
    capacity: { type: Number, min: 1 },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: {
    type: String,
    enum: ["draft", "published", "cancelled"],
    default: "draft",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

eventSchema.index({ startAt: 1 });
eventSchema.index({ club: 1, startAt: 1 });

// Slug policy: generate; if title changes and status !== "published", update slug.
// Once published, slug remains locked even if title changes.


eventSchema.pre("save", async function (next) {
  try {
    // If there's no slug, or the title was modified, regenerate the slug.
    if (!this.slug || this.isModified("title")) {
      // fallback uses template literal; ensure backticks are used
      const base =
        slugify(this.title || "", { lower: true, strict: true }) ||
        `event-${Date.now()}`;

      let candidate = base;
      let i = 1;

      // keep trying until we find a slug that doesn't exist
      while (await this.constructor.exists({ slug: candidate })) {
        candidate = `${base}-${i++}`;
      }

      this.slug = candidate;
    }

    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model("Event", eventSchema);