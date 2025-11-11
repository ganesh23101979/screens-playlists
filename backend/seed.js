// Load environment variables (for admin credentials, DB URI, etc.)
import dotenv from "dotenv";
dotenv.config();

// Import dependencies
import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Import DB connection and models
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Screen from "./models/Screen.js";
import Playlist from "./models/Playlist.js";

async function seed() {
  // 1️⃣ Connect to MongoDB
  await connectDB();

  // 2️⃣ Load environment variables or set defaults
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Password123!";

  console.log("🚀 Starting hybrid database seeding...");

  // ----------------------------------------------------
  // 👤 3️⃣ Seed admin user
  const existingAdmin = await User.findOne({ email: adminEmail });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    const adminUser = new User({
      email: adminEmail,
      passwordHash,
      roles: ["ADMIN", "EDITOR"]
    });

    await adminUser.save();
    console.log("✅ Created admin user:", adminEmail, "password:", adminPassword);
  } else {
    console.log("ℹ️ Admin already exists:", adminEmail);
  }

  // ----------------------------------------------------
  // 📺 4️⃣ Screens data (new + existing)
  const screens = [
    { name: "Lobby Screen", description: "Main building lobby" },
    { name: "Conference Room A", description: "Third floor conference room" },
    { name: "Canteen Display", description: "Canteen menu board", isActive: false },
    { name: "Reception TV", description: "Reception informational display" },
    { name: "Training Room Display", description: "Used for internal sessions" },
    { name: "Training Room Display", description: "Used for internal sessions" } // 🆕 new screen example
  ];

  // Count existing screens
  const screenCount = await Screen.countDocuments();

  if (screenCount === 0) {
    // 🌱 Fresh DB → insert all screens at once for speed
    await Screen.insertMany(screens);
    console.log("✅ Inserted all screens (fresh setup)");
  } else {
    // 🔁 DB already has data → safely add only missing ones using upsert
    for (const screen of screens) {
      await Screen.updateOne(
        { name: screen.name },     // Match by unique name
        { $setOnInsert: screen },  // Insert only if not found
        { upsert: true }           // Update or insert behavior
      );
    }
    console.log("✅ Upserted missing screens (no duplicates added)");
  }

  // ----------------------------------------------------
  // 🎵 5️⃣ Playlists data (new + existing)
  const playlists = [
    {
      name: "Daily Ads",
      itemUrls: ["https://example.com/ad1.mp4", "https://example.com/ad2.mp4"]
    },
    {
      name: "Company News",
      itemUrls: ["https://example.com/news1.mp4"]
    },
    {
      name: "Event Highlights",
      itemUrls: ["https://example.com/event1.mp4", "https://example.com/event2.mp4"]
    },
    {
      name: "Morning Announcements",
      itemUrls: ["https://example.com/announcement.mp4"]
    }
  ];

  // Count existing playlists
  const playlistCount = await Playlist.countDocuments();

  if (playlistCount === 0) {
    // 🌱 Fresh DB → bulk insert all playlists
    await Playlist.insertMany(playlists);
    console.log("✅ Inserted all playlists (fresh setup)");
  } else {
    // 🔁 Existing data → safely upsert new ones only
    for (const playlist of playlists) {
      await Playlist.updateOne(
        { name: playlist.name },     // Find by unique name
        { $setOnInsert: playlist },  // Insert if missing
        { upsert: true }
      );
    }
    console.log("✅ Upserted missing playlists (no duplicates added)");
  }

  // ----------------------------------------------------
  // 🔚 6️⃣ Close DB connection once done
  await mongoose.connection.close();
  console.log("🎉 Seeding complete. MongoDB connection closed.");
}

// ----------------------------------------------------
// 🧩 7️⃣ Run the seed function and handle any errors
seed().catch(err => {
  console.error("❌ Seeding error:", err);
  process.exit(1);
});
