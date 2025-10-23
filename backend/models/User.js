import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  roles: { type: [String], default: [] } // e.g. ["ADMIN","EDITOR"]
}, { timestamps: true });

export default mongoose.model("User", userSchema);
