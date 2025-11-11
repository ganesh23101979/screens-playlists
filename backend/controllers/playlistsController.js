// Import Playlist model (MongoDB collection)
import Playlist from "../models/Playlist.js";
// Import Joi validation schema for playlist creation
import { playlistCreateSchema } from "../validators/schemas.js";

// 🧠 Controller to get all playlists with search & pagination
export async function getPlaylists(req, res, next) {
  try {
    // Extract query params for search, pagination, limit
    const { search = "", page = 1, limit = 10 } = req.query;

    // Convert page and limit to integers, ensure within valid range
    const p = Math.max(1, parseInt(page)); // minimum 1
    const l = Math.min(100, Math.max(1, parseInt(limit))); // max 100

    // Build MongoDB filter
    const filter = {};
    if (search)
      // Search by name (case-insensitive)
      filter.name = { $regex: search, $options: "i" };

    // Find playlists matching the filter
    const items = await Playlist.find(filter)
      .sort({ createdAt: -1 }) // Sort newest first
      .skip((p - 1) * l) // Skip items for previous pages
      .limit(l) // Limit number of items returned
      .select("name itemUrls"); // Select only needed fields

    // Map playlists to include item count
    const mapped = items.map(it => ({
      _id: it._id,
      name: it.name,
      itemCount: (it.itemUrls || []).length,
      itemUrls: it.itemUrls || []
    }));

    // Count total playlists for pagination
    const total = await Playlist.countDocuments(filter);

    // Respond with paginated playlists
    res.json({ items: mapped, page: p, limit: l, total });
  } catch (err) {
    next(err);
  }
}

// 🧠 Controller to create a new playlist
export async function createPlaylist(req, res, next) {
  try {
    // Validate request body using Joi schema
    const { error, value } = playlistCreateSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    // Create a new Playlist document
    const pl = new Playlist({
      name: value.name,
      itemUrls: value.itemUrls || [] // optional array of URLs
    });

    // Save it to MongoDB
    await pl.save();

    // Respond with the created playlist
    res.status(201).json({
      _id: pl._id,
      name: pl.name,
      itemCount: pl.itemUrls.length,
      itemUrls: pl.itemUrls
    });
  } catch (err) {
    next(err);
  }
}
