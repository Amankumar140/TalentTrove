import mongoose from "mongoose";

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
    manualLink:             { type: String,  default: "" },
    submissionDescription:  { type: String,  default: "" },
  },
  { timestamps: true }
);

const Project = mongoose.model("projects", projectSchema);
export default Project;
