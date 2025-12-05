import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HISTORY_FILE = path.join(__dirname, "../data/history.json");

function ensureDataFile() {
  const dataDir = path.dirname(HISTORY_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(HISTORY_FILE)) {
    fs.writeFileSync(HISTORY_FILE, "[]", "utf-8");
  }
}

export function getHistory() {
  ensureDataFile();
  try {
    const data = fs.readFileSync(HISTORY_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading history:", error);
    return [];
  }
}

export function saveScan(scan) {
  ensureDataFile();
  const history = getHistory();
  const scanWithId = {
    id: generateId(),
    ...scan,
    scannedAt: new Date().toISOString()
  };
  history.unshift(scanWithId);
  
  if (history.length > 100) {
    history.pop();
  }
  
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), "utf-8");
  return scanWithId;
}

export function getScanById(id) {
  const history = getHistory();
  return history.find((scan) => scan.id === id);
}

export function clearHistory() {
  ensureDataFile();
  fs.writeFileSync(HISTORY_FILE, "[]", "utf-8");
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}
