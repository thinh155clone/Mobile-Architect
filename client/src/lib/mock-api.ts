import { z } from "zod";

export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export interface Finding {
  id: string;
  type: "phone" | "email" | "address" | "face" | "location" | "sensitive_word";
  value: string;
  location: string; // e.g., "Bio", "Post #3", "Image 5"
  severity: RiskLevel;
}

export interface AnalysisResult {
  id: string;
  platform: "facebook" | "instagram" | "tiktok";
  username: string;
  profileUrl: string;
  avatarUrl: string;
  riskScore: number;
  riskLevel: RiskLevel;
  scannedAt: string;
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
  findings: Finding[];
  recommendations: string[];
}

const MOCK_AVATARS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop"
];

export const analyzeProfile = async (url: string, platform: string): Promise<AnalysisResult> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 3500));

  const riskScore = Math.floor(Math.random() * (95 - 45) + 45); // Random score between 45 and 95
  
  let riskLevel: RiskLevel = "Low";
  if (riskScore > 20) riskLevel = "Medium";
  if (riskScore > 50) riskLevel = "High";
  if (riskScore > 75) riskLevel = "Critical";

  return {
    id: Math.random().toString(36).substring(7),
    platform: platform as any,
    username: url.split("/").pop() || "unknown_user",
    profileUrl: url,
    avatarUrl: MOCK_AVATARS[Math.floor(Math.random() * MOCK_AVATARS.length)],
    riskScore,
    riskLevel,
    scannedAt: new Date().toISOString(),
    stats: {
      posts: Math.floor(Math.random() * 500),
      followers: Math.floor(Math.random() * 5000),
      following: Math.floor(Math.random() * 1000),
    },
    findings: [
      {
        id: "1",
        type: "phone",
        value: "+1 (555) 012-3456",
        location: "Bio Description",
        severity: "Critical"
      },
      {
        id: "2",
        type: "location",
        value: "GPS: 37.7749° N, 122.4194° W",
        location: "Post #5 Metadata",
        severity: "High"
      },
      {
        id: "3",
        type: "face",
        value: "3 Faces Detected (Minors)",
        location: "Recent Photos",
        severity: "Medium"
      },
      {
        id: "4",
        type: "sensitive_word",
        value: "Keyword 'Home'",
        location: "Caption #2",
        severity: "Medium"
      }
    ],
    recommendations: [
      "Remove phone number from public bio immediately.",
      "Turn off location services for camera app.",
      "Review visibility settings for past posts.",
      "Avoid posting photos with clearly visible street signs near home."
    ]
  };
};

export const getHistory = (): AnalysisResult[] => {
  return [
    {
      id: "h1",
      platform: "instagram",
      username: "sarah.j",
      profileUrl: "instagram.com/sarah.j",
      avatarUrl: MOCK_AVATARS[1],
      riskScore: 82,
      riskLevel: "Critical",
      scannedAt: new Date(Date.now() - 86400000).toISOString(),
      stats: { posts: 120, followers: 800, following: 400 },
      findings: [],
      recommendations: []
    },
    {
      id: "h2",
      platform: "facebook",
      username: "mike_runner",
      profileUrl: "facebook.com/mike.runner",
      avatarUrl: MOCK_AVATARS[0],
      riskScore: 35,
      riskLevel: "Medium",
      scannedAt: new Date(Date.now() - 172800000).toISOString(),
      stats: { posts: 45, followers: 200, following: 150 },
      findings: [],
      recommendations: []
    }
  ];
};
