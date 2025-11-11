import mongoose from "mongoose";

const screenSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // unique name
  description: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Screen", screenSchema);
