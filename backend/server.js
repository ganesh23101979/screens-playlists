// server.js
import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import screensRoutes from "./routes/screens.js";
import playlistsRoutes from "./routes/playlists.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();
const app = express();

connectDB();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200
}));

app.use("/auth", authRoutes);
app.use("/screens", screensRoutes);
app.use("/playlists", playlistsRoutes);

app.get("/", (req, res) => {
  res.send("API Working 🚀");
});

app.use(errorHandler);


export default app;
