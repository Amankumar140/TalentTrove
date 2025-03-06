import User from "../models/User.js";

/**
 * GET /fetch-users
 * Fetch all users (excluding password field).
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // exclude password
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
