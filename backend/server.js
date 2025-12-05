import express from "express";
import cors from "cors";
import analysisRoutes from "./routes/analysisRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

const app = express();
const PORT = process.env.BACKEND_PORT || 5001;

app.use(cors());
app.use(express.json());

app.use("/api", analysisRoutes);
app.use("/api", historyRoutes);
app.use("/api", reportRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend server running on port ${PORT}`);
});

export default app;
