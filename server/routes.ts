import type { Express } from "express";
import { createServer, type Server } from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import PDFDocument from "pdfkit";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HISTORY_FILE = path.join(__dirname, "../backend/data/history.json");

const PHONE_REGEX = /(0|\+84)[0-9]{8,10}|\+1[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}|\(\d{3}\)\s?\d{3}-\d{4}/g;
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

const CITIES = [
  "San Francisco, CA (37.7749° N, 122.4194° W)",
  "New York, NY (40.7128° N, 74.0060° W)",
  "Los Angeles, CA (34.0522° N, 118.2437° W)",
  "Chicago, IL (41.8781° N, 87.6298° W)",
  "Miami, FL (25.7617° N, 80.1918° W)",
  null, null, null
];

const AVATAR_URLS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop"
];

function ensureDataFile() {
  const dataDir = path.dirname(HISTORY_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(HISTORY_FILE)) {
    fs.writeFileSync(HISTORY_FILE, "[]", "utf-8");
  }
}

function getHistory() {
  ensureDataFile();
  try {
    const data = fs.readFileSync(HISTORY_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveScan(scan: any) {
  ensureDataFile();
  const history = getHistory();
  const scanWithId = {
    id: Date.now().toString(36) + Math.random().toString(36).substring(2, 9),
    ...scan,
    scannedAt: new Date().toISOString()
  };
  history.unshift(scanWithId);
  if (history.length > 100) history.pop();
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), "utf-8");
  return scanWithId;
}

function getScanById(id: string) {
  return getHistory().find((scan: any) => scan.id === id);
}

function calculateRiskScore(findings: any) {
  let score = 0;
  score += (findings.phones?.length || 0) * 15;
  score += (findings.emails?.length || 0) * 15;
  score += (findings.faces || 0) * 5;
  score += findings.gps ? 25 : 0;
  return Math.min(score, 100);
}

function getRiskLevel(score: number) {
  if (score >= 76) return "Critical";
  if (score >= 51) return "High";
  if (score >= 21) return "Medium";
  return "Low";
}

function analyzeProfile(url: string, platform: string) {
  const username = url.split("/").pop() || "unknown_user";
  
  const simulatedBio = `Contact me at john.doe@email.com or call +1 (555) 012-3456. Based in San Francisco.`;
  const simulatedCaptions = `Check out my new home! Email: backup@gmail.com Phone: 0901234567`;
  const fullText = simulatedBio + " " + simulatedCaptions;
  
  const phones = fullText.match(PHONE_REGEX) || [];
  const emails = fullText.match(EMAIL_REGEX) || [];
  const faces = Math.floor(Math.random() * 5);
  const gps = CITIES[Math.floor(Math.random() * CITIES.length)];
  
  const findings = { phones, emails, faces, gps };
  const riskScore = calculateRiskScore(findings);
  const riskLevel = getRiskLevel(riskScore);
  
  const leaks: string[] = [];
  if (phones.length > 0) leaks.push(`${phones.length} phone number(s) exposed`);
  if (emails.length > 0) leaks.push(`${emails.length} email address(es) exposed`);
  if (faces > 0) leaks.push(`${faces} face(s) detected in photos`);
  if (gps) leaks.push(`Location data exposed: ${gps}`);
  
  const recommendations: string[] = [];
  if (phones.length > 0) {
    recommendations.push("Remove phone numbers from public bio and posts immediately.");
    recommendations.push("Use a business phone or virtual number for public contact.");
  }
  if (emails.length > 0) {
    recommendations.push("Hide email addresses from public view.");
    recommendations.push("Create a separate public email for social media contacts.");
  }
  if (faces > 0) {
    recommendations.push("Review photos for identifiable faces, especially of minors.");
    recommendations.push("Consider blurring faces in public posts.");
  }
  if (gps) {
    recommendations.push("Disable location services for your camera app.");
    recommendations.push("Remove EXIF metadata before posting photos.");
    recommendations.push("Avoid posting photos that reveal your home location.");
  }
  if (recommendations.length === 0) {
    recommendations.push("Your profile looks secure. Keep monitoring regularly.");
  }
  
  return {
    platform,
    username,
    profileUrl: url,
    avatarUrl: AVATAR_URLS[Math.floor(Math.random() * AVATAR_URLS.length)],
    riskScore,
    riskLevel,
    stats: {
      posts: Math.floor(Math.random() * 500),
      followers: Math.floor(Math.random() * 5000),
      following: Math.floor(Math.random() * 1000)
    },
    leaks,
    findings,
    recommendations
  };
}

function generatePDFReport(scan: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];
      
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);
      
      doc.fontSize(24).fillColor("#1a1a2e").text("Social Media Exposure Report", { align: "center" });
      doc.moveDown();
      
      doc.fontSize(12).fillColor("#666").text(`Generated: ${new Date().toLocaleString()}`, { align: "center" });
      doc.moveDown(2);
      
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke("#ddd");
      doc.moveDown();
      
      doc.fontSize(16).fillColor("#1a1a2e").text("Profile Information");
      doc.moveDown(0.5);
      doc.fontSize(11).fillColor("#333");
      doc.text(`Platform: ${scan.platform}`);
      doc.text(`Username: @${scan.username}`);
      doc.text(`Profile URL: ${scan.profileUrl}`);
      doc.moveDown();
      
      const riskColor = scan.riskLevel === "Critical" ? "#dc2626" : 
                       scan.riskLevel === "High" ? "#ea580c" :
                       scan.riskLevel === "Medium" ? "#ca8a04" : "#16a34a";
      
      doc.fontSize(16).fillColor("#1a1a2e").text("Risk Assessment");
      doc.moveDown(0.5);
      doc.fontSize(32).fillColor(riskColor).text(`${scan.riskScore}/100`, { continued: true });
      doc.fontSize(14).text(`  (${scan.riskLevel} Risk)`);
      doc.moveDown();
      
      doc.fontSize(16).fillColor("#1a1a2e").text("Findings Summary");
      doc.moveDown(0.5);
      doc.fontSize(11).fillColor("#333");
      
      if (scan.findings.phones?.length > 0) {
        doc.text(`Phone Numbers Exposed: ${scan.findings.phones.length}`);
        scan.findings.phones.forEach((phone: string) => {
          doc.text(`  • ${phone}`, { indent: 20 });
        });
      }
      
      if (scan.findings.emails?.length > 0) {
        doc.text(`Email Addresses Exposed: ${scan.findings.emails.length}`);
        scan.findings.emails.forEach((email: string) => {
          doc.text(`  • ${email}`, { indent: 20 });
        });
      }
      
      doc.text(`Faces Detected: ${scan.findings.faces || 0}`);
      doc.text(`Location Data: ${scan.findings.gps || "None detected"}`);
      doc.moveDown();
      
      doc.fontSize(16).fillColor("#1a1a2e").text("Recommendations");
      doc.moveDown(0.5);
      doc.fontSize(11).fillColor("#333");
      
      scan.recommendations?.forEach((rec: string, i: number) => {
        doc.text(`${i + 1}. ${rec}`);
      });
      
      doc.moveDown(2);
      doc.fontSize(9).fillColor("#999").text("This report was generated by Social Media Exposure Analyzer.", { align: "center" });
      
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Analyze profile
  app.post("/api/analyze", async (req, res) => {
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

  // Get history
  app.get("/api/history", (req, res) => {
    try {
      const history = getHistory();
      res.json(history);
    } catch (error) {
      console.error("History error:", error);
      res.status(500).json({ error: "Failed to fetch history" });
    }
  });

  // Get specific scan
  app.get("/api/history/:id", (req, res) => {
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

  // Clear history
  app.delete("/api/history", (req, res) => {
    try {
      ensureDataFile();
      fs.writeFileSync(HISTORY_FILE, "[]", "utf-8");
      res.json({ message: "History cleared" });
    } catch (error) {
      console.error("Clear history error:", error);
      res.status(500).json({ error: "Failed to clear history" });
    }
  });

  // Generate PDF report
  app.get("/api/report/:id", async (req, res) => {
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

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  return httpServer;
}
