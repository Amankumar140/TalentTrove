import Project from "../models/Project.js";
import Freelancer from "../models/Freelancer.js";

/**
 * GET /fetch-project/:id
 */
export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /fetch-projects
 */
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * POST /new-project
 */
export const createProject = async (req, res) => {
  const { title, description, budget, skills, clientId, clientName, clientEmail } = req.body;
  try {
    const projectSkills = typeof skills === "string" ? skills.split(",").map(s => s.trim()) : skills;
    const newProject = new Project({
      title,
      description,
      budget,
      skills: projectSkills,
      clientId,
      clientName,
      clientEmail,
      postedDate: new Date(),
    });
    await newProject.save();
    res.status(200).json({ message: "Project added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * POST /submit-project
 */
export const submitProject = async (req, res) => {
  const { projectId, projectLink, manualLink, submissionDescription } = req.body;
  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    project.projectLink = projectLink;
    project.manualLink = manualLink;
    project.submissionDescription = submissionDescription;
    project.submission = true;

    await project.save();
    res.status(200).json({ message: "Project submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /approve-submission/:id
 */
export const approveSubmission = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    const freelancer = await Freelancer.findOne({ userId: project.freelancerId });
    if (!freelancer) return res.status(404).json({ error: "Freelancer not found" });

    project.submissionAccepted = true;
    project.status = "Completed";

    // Move project from currentProjects to completedProjects
    freelancer.currentProjects = freelancer.currentProjects.filter(
      (pid) => pid.toString() !== project._id.toString()
    );
    freelancer.completedProjects.push(project._id);
    freelancer.funds = parseInt(freelancer.funds) + parseInt(project.budget);

    await project.save();
    await freelancer.save();

    res.status(200).json({ message: "Submission approved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /reject-submission/:id
 */
export const rejectSubmission = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    project.submission = false;
    project.projectLink = "";
    project.manualLink = "";
    project.submissionDescription = "";

    await project.save();
    res.status(200).json({ message: "Submission rejected" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
