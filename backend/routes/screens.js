import express from "express";
import { getScreens, toggleScreen } from "../controllers/screensController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getScreens);
router.put("/:id", requireAuth, requireRole(["EDITOR", "ADMIN"]), toggleScreen);

export default router;
