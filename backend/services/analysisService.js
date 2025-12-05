import { calculateRiskScore, getRiskLevel } from "./riskEngine.js";

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

export function analyzeProfile(url, platform) {
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
  
  const leaks = [];
  if (phones.length > 0) leaks.push(`${phones.length} phone number(s) exposed`);
  if (emails.length > 0) leaks.push(`${emails.length} email address(es) exposed`);
  if (faces > 0) leaks.push(`${faces} face(s) detected in photos`);
  if (gps) leaks.push(`Location data exposed: ${gps}`);
  
  const recommendations = generateRecommendations(findings);
  
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
    findings: {
      phones,
      emails,
      faces,
      gps
    },
    recommendations
  };
}

function generateRecommendations(findings) {
  const recommendations = [];
  
  if (findings.phones.length > 0) {
    recommendations.push("Remove phone numbers from public bio and posts immediately.");
    recommendations.push("Use a business phone or virtual number for public contact.");
  }
  
  if (findings.emails.length > 0) {
    recommendations.push("Hide email addresses from public view.");
    recommendations.push("Create a separate public email for social media contacts.");
  }
  
  if (findings.faces > 0) {
    recommendations.push("Review photos for identifiable faces, especially of minors.");
    recommendations.push("Consider blurring faces in public posts.");
  }
  
  if (findings.gps) {
    recommendations.push("Disable location services for your camera app.");
    recommendations.push("Remove EXIF metadata before posting photos.");
    recommendations.push("Avoid posting photos that reveal your home location.");
  }
  
  if (recommendations.length === 0) {
    recommendations.push("Your profile looks secure. Keep monitoring regularly.");
  }
  
  return recommendations;
}
