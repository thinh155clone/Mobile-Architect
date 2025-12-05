import express from "express";
import { getHistory, getScanById, clearHistory } from "../services/dataService.js";

const router = express.Router();

router.get("/history", (req, res) => {
  try {
    const history = getHistory();
    res.json(history);
  } catch (error) {
    console.error("History error:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

router.get("/history/:id", (req, res) => {
  try {
    const scan = getScanById(req.params.id);
    if (!scan) {
      return res.status(404).json({ error: "Scan not found" });
    }
    res.json(scan);
  } catch (error) {
    console.error("Fetch scan error:", error);
    res.status(500).json({ error: "Failed to fetch scan" });
  }
});

router.delete("/history", (req, res) => {
  try {
    clearHistory();
    res.json({ message: "History cleared" });
  } catch (error) {
    console.error("Clear history error:", error);
    res.status(500).json({ error: "Failed to clear history" });
  }
});

export default router;
