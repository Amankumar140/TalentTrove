import mongoose from "mongoose";

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

const Freelancer = mongoose.model("freelancers", freelancerSchema);
export default Freelancer;
