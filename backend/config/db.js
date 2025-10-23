import mongoose from "mongoose";
export async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/screens_playlists";
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error", err);
    process.exit(1);
  }
}
