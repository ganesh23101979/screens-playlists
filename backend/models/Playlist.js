import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  itemUrls: { type: [String], default: [] }
}, { timestamps: true });

export default mongoose.model("Playlist", playlistSchema);
