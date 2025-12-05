import express from "express";
import { analyzeProfile } from "../services/analysisService.js";
import { saveScan } from "../services/dataService.js";

const router = express.Router();

router.post("/analyze", async (req, res) => {
  try {
    const { url, platform = "instagram" } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }
    
    const analysisResult = analyzeProfile(url, platform);
    const savedScan = saveScan(analysisResult);
    
    res.json(savedScan);
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({ error: "Failed to analyze profile" });
  }
});

export default router;
