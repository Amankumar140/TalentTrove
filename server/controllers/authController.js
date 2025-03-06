import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Freelancer from "../models/Freelancer.js";

/**
 * Generate a JWT token for a user.
 * @param {Object} user - Mongoose user document
 * @returns {string} signed JWT
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, usertype: user.usertype },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/**
 * POST /register
 * Register a new user. If usertype is "freelancer", also create a Freelancer profile.
 * Returns user data + JWT token.
 */
export const register = async (req, res) => {
  try {
    const { username, email, password, usertype } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Email already registered" });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: passwordHash, usertype });
    const user = await newUser.save();

    if (usertype === "freelancer") {
      const newFreelancer = new Freelancer({ userId: user._id });
      await newFreelancer.save();
    }

    const token = generateToken(user);

    // Return user without password
    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({ user: userObj, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * POST /login
 * Authenticate a user with email + password.
 * Returns user data + JWT token.
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = generateToken(user);

    // Return user without password
    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({ user: userObj, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
