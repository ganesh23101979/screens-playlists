// Import required packages
import express from "express";       // 🧱 Express is the core web framework for building APIs and servers
import dotenv from "dotenv";         // 🔐 dotenv loads environment variables from a .env file
import helmet from "helmet";         // 🛡️ Helmet helps secure the app by setting various HTTP headers
import cors from "cors";             // 🌐 CORS enables cross-origin requests (frontend ↔ backend)
import rateLimit from "express-rate-limit";  // 🚦 Limits number of requests to prevent abuse (rate limiting)

// Import custom modules and routes
import { connectDB } from "./config/db.js";  // 🔗 Function that connects to MongoDB
import authRoutes from "./routes/auth.js";   // 🔑 Routes for authentication (login/register)
import screensRoutes from "./routes/screens.js"; // 🖥️ Routes to manage screens data
import playlistsRoutes from "./routes/playlists.js"; // 🎵 Routes to manage playlists
import { errorHandler } from "./middleware/errorHandler.js"; // ⚠️ Global error handler middleware

// Load environment variables (from .env file into process.env)
dotenv.config();

// Initialize the Express app
const app = express();

// Define the server port (from .env or fallback to 4000)
const PORT = process.env.PORT || 4000;

// Connect to MongoDB database
connectDB();

// Apply global middlewares
app.use(helmet());         // 🛡️ Adds security-related HTTP headers
app.use(cors());           // 🌐 Allows frontend (React/Vue etc.) to make API requests to this server
app.use(express.json());   // 📦 Parses incoming JSON request bodies (so you can read req.body)

// Apply request rate limiting middleware
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // ⏱️ Time window — 15 minutes
  max: 200                   // 🚧 Max 200 requests per IP per window
}));

// Define main API routes
app.use("/auth", authRoutes);          // 🔑 Routes for user authentication
app.use("/screens", screensRoutes);    // 🖥️ Routes for screen management (CRUD)
app.use("/playlists", playlistsRoutes); // 🎶 Routes for playlist management (CRUD)

// Attach global error handler middleware (for handling thrown errors gracefully)
app.use(errorHandler);

// Root route (default API endpoint)
app.get('/', (req, res) => {
  res.send("API Working");  // ✅ Simple response to check if API is up
});

// Start the Express server and listen on specified port
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`); // 📢 Log message in console
});
