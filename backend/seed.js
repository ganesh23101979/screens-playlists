import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Screen from "./models/Screen.js";
import Playlist from "./models/Playlist.js";

async function seed() {
  await connectDB();
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Password123!";
  const uri = process.env.MONGO_URI;

  console.log("Seeding DB...");

  const existing = await User.findOne({ email: adminEmail });
  if (!existing) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    const user = new User({
      email: adminEmail,
      passwordHash,
      roles: ["ADMIN", "EDITOR"]
    });
    await user.save();
    console.log("Created admin:", adminEmail, "password:", adminPassword);
  } else {
    console.log("Admin already exists:", adminEmail);
  }

  // seed screens
  const screensCount = await Screen.countDocuments();
  if (screensCount === 0) {
    const screens = [
      { name: "Lobby Screen", description: "Main building lobby" },
      { name: "Conference Room A", description: "Third floor conf room" },
      { name: "Canteen Display", description: "Canteen menu board", isActive: false },
      { name: "Reception TV", description: "Receptionational info" }
    ];
    await Screen.insertMany(screens);
    console.log("Seeded screens");
  } else {
    console.log("Screens already seeded");
  }

  // seed playlists
  const playlistsCount = await Playlist.countDocuments();
  if (playlistsCount === 0) {
    const playlists = [
      { name: "Daily Ads", itemUrls: ["https://example.com/ad1.mp4", "https://example.com/ad2.mp4"] },
      { name: "Company News", itemUrls: ["https://example.com/news1.mp4"] }
    ];
    await Playlist.insertMany(playlists);
    console.log("Seeded playlists");
  } else {
    console.log("Playlists already seeded");
  }

  mongoose.connection.close();
  console.log("Done.");
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
