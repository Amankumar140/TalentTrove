import mongoose from "mongoose";

// ── User Schema ─────────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    usertype: { type: String, required: true, enum: ["freelancer", "client", "admin"] },
  },
  { timestamps: true }
);

// ── Freelancer Schema ───────────────────────────────────────────────────────
const freelancerSchema = new mongoose.Schema(
  {
    userId:            { type: String, required: true },
    skills:            { type: Array,  default: [] },
    description:       { type: String, default: "" },
    currentProjects:   { type: Array,  default: [] },
    completedProjects: { type: Array,  default: [] },
    applications:      { type: Array,  default: [] },
    funds:             { type: Number, default: 0 },
    // Portfolio Management feature
    portfolioItems: {
      type: Array,
      default: [],
      // Each item: { title, description, link, imageUrl }
    },
    // Reputation & Reviews feature
    ratings: {
      type: Array,
      default: [],
      // Each item: { clientId, rating (1-5), comment, projectId, createdAt }
    },
    averageRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ── Project Schema ──────────────────────────────────────────────────────────
const projectSchema = new mongoose.Schema(
  {
    clientId:              { type: String, required: true },
    clientName:            { type: String, required: true },
    clientEmail:           { type: String, required: true },
    title:                 { type: String, required: true },
    description:           { type: String, required: true },
    budget:                { type: Number, required: true },
    skills:                { type: Array,  default: [] },
    bids:                  { type: Array,  default: [] },
    bidAmounts:            { type: Array,  default: [] },
    postedDate:            { type: Date,   default: Date.now },
    deadline:              { type: String, default: "" },
    status: {
      type: String,
      default: "Available",
      enum: ["Available", "Assigned", "Completed"],
    },
    freelancerId:           { type: String, default: "" },
    freelancerName:         { type: String, default: "" },
    submission:             { type: Boolean, default: false },
    submissionAccepted:     { type: Boolean, default: false },
    projectLink:            { type: String,  default: "" },
    manualLink:             { type: String,  default: "" }, // FIX: was manulaLink
    submissionDescription:  { type: String,  default: "" },
  },
  { timestamps: true }
);

// ── Application Schema ──────────────────────────────────────────────────────
const applicationSchema = new mongoose.Schema(
  {
    projectId:       { type: String, required: true },
    clientId:        { type: String, required: true },
    clientName:      { type: String, required: true },
    clientEmail:     { type: String, required: true },
    freelancerId:    { type: String, required: true },
    freelancerName:  { type: String, required: true },
    freelancerEmail: { type: String, required: true },
    freelancerSkills: { type: Array, default: [] },
    title:           { type: String, required: true },
    description:     { type: String, default: "" },
    budget:          { type: Number, required: true },
    requiredSkills:  { type: Array,  default: [] },
    proposal:        { type: String, required: true },
    bidAmount:       { type: Number, required: true },
    estimatedTime:   { type: Number, required: true },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Accepted", "Rejected"],
    },
  },
  { timestamps: true }
);

// ── Chat Schema ─────────────────────────────────────────────────────────────
const chatSchema = new mongoose.Schema(
  {
    _id:      { type: String, required: true },
    messages: { type: Array,  default: [] },
  },
  { timestamps: true }
);

// ── Exports ─────────────────────────────────────────────────────────────────
export const User        = mongoose.model("users",        userSchema);
export const Freelancer  = mongoose.model("freelancers",  freelancerSchema);
export const Project     = mongoose.model("projects",     projectSchema);
export const Application = mongoose.model("applications", applicationSchema);
export const Chat        = mongoose.model("chats",        chatSchema);