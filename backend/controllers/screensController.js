import Screen from "../models/Screen.js";
import mongoose from "mongoose";

export async function getScreens(req, res, next) {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;
    const p = Math.max(1, parseInt(page));
    const l = Math.min(100, Math.max(1, parseInt(limit)));

    const filter = {};
    if (search) {
      // case-insensitive partial match on name
      filter.name = { $regex: search, $options: "i" };
    }

    const [items, total] = await Promise.all([
      Screen.find(filter).sort({ createdAt: -1 }).skip((p - 1) * l).limit(l),
      Screen.countDocuments(filter)
    ]);

    res.json({ items, page: p, limit: l, total });
  } catch (err) {
    next(err);
  }
}

export async function toggleScreen(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });

    const screen = await Screen.findById(id);
    if (!screen) return res.status(404).json({ message: "Not found" });

    screen.isActive = !screen.isActive;
    await screen.save();
    res.json({ _id: screen._id, isActive: screen.isActive });
  } catch (err) {
    next(err);
  }
}
