import type { Scan, InsertScan } from "@shared/schema";

export async function createScan(scan: InsertScan): Promise<Scan> {
  const response = await fetch("/api/scans", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(scan),
  });
  
  if (!response.ok) {
    throw new Error("Failed to create scan");
  }
  
  return response.json();
}

export async function getAllScans(): Promise<Scan[]> {
  const response = await fetch("/api/scans");
  
  if (!response.ok) {
    throw new Error("Failed to fetch scans");
  }
  
  return response.json();
}

export async function getScan(id: string): Promise<Scan> {
  const response = await fetch(`/api/scans/${id}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch scan");
  }
  
  return response.json();
}
