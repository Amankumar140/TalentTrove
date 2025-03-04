import mongoose from "mongoose";

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

const Application = mongoose.model("applications", applicationSchema);
export default Application;
