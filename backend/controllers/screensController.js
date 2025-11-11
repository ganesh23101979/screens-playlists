// Import Screen model
import Screen from "../models/Screen.js";
// Import mongoose for ObjectId validation
import mongoose from "mongoose";

// 🧠 Controller to get list of screens (with pagination & search)
export async function getScreens(req, res, next) {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;
    const p = Math.max(1, parseInt(page));
    const l = Math.min(100, Math.max(1, parseInt(limit)));

    const filter = {};
    if (search) {
      // Filter by name using regex (case-insensitive)
      filter.name = { $regex: search, $options: "i" };
    }

    // Use Promise.all to fetch screens and count in parallel (faster)
    const [items, total] = await Promise.all([
      Screen.find(filter)
        .sort({ createdAt: -1 }) // newest first
        .skip((p - 1) * l)
        .limit(l),
      Screen.countDocuments(filter)
    ]);

    // Respond with list of screens
    res.json({ items, page: p, limit: l, total });
  } catch (err) {
    next(err);
  }
}

// 🧠 Controller to toggle the active/inactive status of a screen
export async function toggleScreen(req, res, next) {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: "Invalid id" });

    // Find screen by ID
    const screen = await Screen.findById(id);
    if (!screen) return res.status(404).json({ message: "Not found" });

    // Flip (toggle) the isActive boolean value
    screen.isActive = !screen.isActive;

    // Save updated screen document
    await screen.save();

    // Respond with updated status
    res.json({ _id: screen._id, isActive: screen.isActive });
  } catch (err) {
    next(err);
  }
}
