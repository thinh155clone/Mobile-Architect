export function calculateRiskScore(findings) {
  let score = 0;
  
  score += (findings.phones?.length || 0) * 15;
  score += (findings.emails?.length || 0) * 15;
  score += (findings.faces || 0) * 5;
  score += findings.gps ? 25 : 0;
  
  return Math.min(score, 100);
}

export function getRiskLevel(score) {
  if (score >= 76) return "Critical";
  if (score >= 51) return "High";
  if (score >= 21) return "Medium";
  return "Low";
}
