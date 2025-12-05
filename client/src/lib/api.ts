export interface Finding {
  phones: string[];
  emails: string[];
  faces: number;
  gps: string | null;
}

export interface Scan {
  id: string;
  platform: string;
  username: string;
  profileUrl: string;
  avatarUrl: string;
  riskScore: number;
  riskLevel: string;
  scannedAt: string;
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
  leaks: string[];
  findings: Finding;
  recommendations: string[];
}

export async function analyzeProfile(url: string, platform: string): Promise<Scan> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, platform }),
  });
  
  if (!response.ok) {
    throw new Error("Failed to analyze profile");
  }
  
  return response.json();
}

export async function getHistory(): Promise<Scan[]> {
  const response = await fetch("/api/history");
  
  if (!response.ok) {
    throw new Error("Failed to fetch history");
  }
  
  return response.json();
}

export async function getScan(id: string): Promise<Scan> {
  const response = await fetch(`/api/history/${id}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch scan");
  }
  
  return response.json();
}

export async function clearHistory(): Promise<void> {
  const response = await fetch("/api/history", {
    method: "DELETE",
  });
  
  if (!response.ok) {
    throw new Error("Failed to clear history");
  }
}

export function getReportUrl(id: string): string {
  return `/api/report/${id}`;
}
