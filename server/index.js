import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import { Application, Chat, Freelancer, Project, User } from "./Schema.js";
import { Server } from "socket.io";
import http from "http";
import SocketHandler from "./SocketHandler.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6001;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://talent-trove-fronted.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

// ── HTTP + Socket.IO Server ─────────────────────────────────────────────────
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://talent-trove-fronted.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  SocketHandler(io, socket); // FIX: pass io so SocketHandler can broadcast to full rooms
});

// ── Health Check ────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("TalentTrove Backend is Live!");
});

// ── Auth Routes ─────────────────────────────────────────────────────────────
app.post("/register", async (req, res) => {
  try {
    const { username, email, password, usertype } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Email already registered" });

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: passwordHash, usertype });
    const user = await newUser.save();

    if (usertype === "freelancer") {
      const newFreelancer = new Freelancer({ userId: user._id });
      await newFreelancer.save();
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Freelancer Routes ───────────────────────────────────────────────────────
app.get("/fetch-freelancer/:id", async (req, res) => {
  try {
    const freelancer = await Freelancer.findOne({ userId: req.params.id });
    res.status(200).json(freelancer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/update-freelancer", async (req, res) => {
  try {
    const { freelancerId, updateSkills, description } = req.body;

    if (!freelancerId)
      return res.status(400).json({ error: "Freelancer ID is required" });

    const freelancer = await Freelancer.findById(freelancerId);
    if (!freelancer)
      return res.status(404).json({ error: "Freelancer not found" });

    const skills = Array.isArray(updateSkills)
      ? updateSkills
      : updateSkills.split(",").map((skill) => skill.trim());

    freelancer.skills = skills;
    freelancer.description = description;

    await freelancer.save();
    res.status(200).json(freelancer);
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

// ── Project Routes ──────────────────────────────────────────────────────────
app.get("/fetch-project/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/fetch-projects", async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/new-project", async (req, res) => {
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
});

// ── Application Routes ──────────────────────────────────────────────────────
app.post("/make-bid", async (req, res) => {
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
});

app.get("/fetch-applications", async (req, res) => {
  try {
    const applications = await Application.find();
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/approve-application/:id", async (req, res) => {
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
      appli.status = "Rejected"; // FIX: was `===` (comparison) instead of `=` (assignment)
      await appli.save();
    }

    project.freelancerId = freelancer.userId;
    project.freelancerName = user.username; // FIX: was user.email
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
});

app.get("/reject-application/:id", async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ error: "Application not found" });

    application.status = "Rejected";
    await application.save();

    res.status(200).json({ message: "Application rejected!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Project Submission Routes ───────────────────────────────────────────────
app.post("/submit-project", async (req, res) => {
  const { projectId, projectLink, manualLink, submissionDescription } = req.body;
  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    project.projectLink = projectLink;
    project.manualLink = manualLink; // FIX: was manulaLink
    project.submissionDescription = submissionDescription;
    project.submission = true;

    await project.save(); // FIX: was saved twice
    res.status(200).json({ message: "Project submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/approve-submission/:id", async (req, res) => {
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
});

app.get("/reject-submission/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    project.submission = false;
    project.projectLink = "";
    project.manualLink = ""; // FIX: was manulaLink
    project.submissionDescription = "";

    await project.save();
    res.status(200).json({ message: "Submission rejected" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── User Routes ─────────────────────────────────────────────────────────────
app.get("/fetch-users", async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // exclude password
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Chat Routes ─────────────────────────────────────────────────────────────
app.get("/fetch-chats/:id", async (req, res) => {
  try {
    const chats = await Chat.findById(req.params.id);
    res.status(200).json(chats || { _id: req.params.id, messages: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Error Handling Middleware ───────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// ── Database Connection + Start Server ─────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
    server.listen(PORT, () => {
      console.log(`TalentTrove server running @ port ${PORT}`);
    });
  })
  .catch((e) => console.error(`Error in DB connection: ${e}`));
