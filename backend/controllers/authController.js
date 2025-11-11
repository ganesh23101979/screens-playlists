// Import bcrypt for password hashing & comparison
import bcrypt from "bcrypt";
// Import jsonwebtoken to generate JWT tokens
import jwt from "jsonwebtoken";
// Import User model (MongoDB collection)
import User from "../models/User.js";
// Import Joi validation schema for login
import { loginSchema } from "../validators/schemas.js";

// 🧠 Controller function to handle user login
export async function login(req, res, next) {
  try {
    // Validate incoming request body using Joi schema
    const { error, value } = loginSchema.validate(req.body);
    // If validation fails → respond with 400 (Bad Request)
    if (error) return res.status(400).json({ message: error.message });

    // Extract validated email & password
    const { email, password } = value;

    // Find user in MongoDB by email
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // Compare entered password with hashed password in DB
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    // Create JWT payload (data to include in token)
    const payload = { id: user._id, email: user.email, roles: user.roles };

    // Sign JWT token with secret key, expires in 8 hours
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "8h" });

    // Respond with the generated token and user info
    res.json({ token, user: payload });
  } catch (err) {
    // Pass any errors to Express error handler
    next(err);
  }
}
