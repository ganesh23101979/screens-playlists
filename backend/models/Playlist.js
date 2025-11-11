import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, index: true }, // unique name prevents duplicates
  itemUrls: { type: [String], default: [] }
}, { timestamps: true });

export default mongoose.model("Playlist", playlistSchema);
