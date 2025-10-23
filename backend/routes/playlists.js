import express from "express";
import { getPlaylists, createPlaylist } from "../controllers/playlistsController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getPlaylists);
router.post("/", requireAuth, requireRole(["EDITOR", "ADMIN"]), createPlaylist);

export default router;
