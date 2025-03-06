import Application from "../models/Application.js";
import Freelancer from "../models/Freelancer.js";
import Project from "../models/Project.js";
import User from "../models/User.js";

/**
 * POST /make-bid
 * Place a bid (application) on a project.
 */
export const makeBid = async (req, res) => {
  const { clientId, freelancerId, projectId, proposal, bidAmount, estimatedTime } = req.body;
  try {
    const freelancer = await User.findById(freelancerId);
    const freelancerData = await Freelancer.findOne({ userId: freelancerId });
    const project = await Project.findById(projectId);
    const client = await User.findById(clientId);

    if (!freelancer || !freelancerData || !project || !client)
      return res.status(404).json({ error: "One or more resources not found" });

    // Prevent duplicate bids
    if (project.bids.includes(freelancerId))
      return res.status(400).json({ error: "You have already placed a bid on this project" });

    const newApplication = new Application({
      projectId,
      clientId,
      clientName: client.username,
      clientEmail: client.email,
      freelancerId,
      freelancerName: freelancer.username,
      freelancerEmail: freelancer.email,
      freelancerSkills: freelancerData.skills,
      title: project.title,
      description: project.description,
      budget: project.budget,
      requiredSkills: project.skills,
      proposal,
      bidAmount,
      estimatedTime,
    });

    const application = await newApplication.save();

    project.bids.push(freelancerId);
    project.bidAmounts.push(parseInt(bidAmount));

    if (application) {
      freelancerData.applications.push(application._id);
    }

    await freelancerData.save();
    await project.save();

    res.status(200).json({ message: "Bidding successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /fetch-applications
 */
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find();
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /approve-application/:id
 * Approve an application and reject all other pending ones for the same project.
 */
export const approveApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ error: "Application not found" });

    const project = await Project.findById(application.projectId);
    const freelancer = await Freelancer.findOne({ userId: application.freelancerId });
    const user = await User.findById(application.freelancerId);

    application.status = "Accepted";
    await application.save();

    // Reject all other pending applications for the same project
    const remainingApplications = await Application.find({
      projectId: application.projectId,
      status: "Pending",
    });

    for (const appli of remainingApplications) {
      appli.status = "Rejected";
      await appli.save();
    }

    project.freelancerId = freelancer.userId;
    project.freelancerName = user.username;
    project.budget = application.bidAmount;
    project.status = "Assigned";

    freelancer.currentProjects.push(project._id);

    await project.save();
    await freelancer.save();

    res.status(200).json({ message: "Application approved!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /reject-application/:id
 */
export const rejectApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ error: "Application not found" });

    application.status = "Rejected";
    await application.save();

    res.status(200).json({ message: "Application rejected!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
