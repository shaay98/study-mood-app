import express from "express";
import Mood from "../models/mood.js";

const router = express.Router();

// ✅ GET all moods
router.get("/", async (req, res) => {
  res.json([]);
});

export default router;