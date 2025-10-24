import Playlist from "../models/Playlist.js";
import { playlistCreateSchema } from "../validators/schemas.js";

export async function getPlaylists(req, res, next) {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;
    const p = Math.max(1, parseInt(page));
    const l = Math.min(100, Math.max(1, parseInt(limit)));

    const filter = {};
    if (search) filter.name = { $regex: search, $options: "i" };

    const items = await Playlist.find(filter)
      .sort({ createdAt: -1 })
      .skip((p - 1) * l)
      .limit(l)
      .select("name itemUrls");

    // ✅ Include itemUrls here
    const mapped = items.map(it => ({
      _id: it._id,
      name: it.name,
      itemCount: (it.itemUrls || []).length,
      itemUrls: it.itemUrls || []
    }));

    const total = await Playlist.countDocuments(filter);
    res.json({ items: mapped, page: p, limit: l, total });
  } catch (err) {
    next(err);
  }
}


export async function createPlaylist(req, res, next) {
  try {
    const { error, value } = playlistCreateSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    // Create and save a new playlist
    const pl = new Playlist({
      name: value.name,
      itemUrls: value.itemUrls || []
    });

    await pl.save();

    // Respond with created playlist details
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
