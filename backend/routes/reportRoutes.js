import express from "express";
import { getScanById } from "../services/dataService.js";
import { generatePDFReport } from "../services/reportService.js";

const router = express.Router();

router.get("/report/:id", async (req, res) => {
  try {
    const scan = getScanById(req.params.id);
    
    if (!scan) {
      return res.status(404).json({ error: "Scan not found" });
    }
    
    const pdfBuffer = await generatePDFReport(scan);
    
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=exposure-report-${scan.id}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Report generation error:", error);
    res.status(500).json({ error: "Failed to generate report" });
  }
});

export default router;
