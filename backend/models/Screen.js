import mongoose from "mongoose";

const screenSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  description: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

screenSchema.index({ name: "text" }); // text index for search

export default mongoose.model("Screen", screenSchema);
