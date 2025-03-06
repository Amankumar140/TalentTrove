import Freelancer from "../models/Freelancer.js";

/**
 * GET /fetch-freelancer/:id
 * Fetch a single freelancer profile by userId.
 */
export const getFreelancer = async (req, res) => {
  try {
    const freelancer = await Freelancer.findOne({ userId: req.params.id });
    res.status(200).json(freelancer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * POST /update-freelancer
 * Update a freelancer's skills and description.
 */
export const updateFreelancer = async (req, res) => {
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
};
