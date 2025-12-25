export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export function computeRiskScore(factors) {
  const {
    repetitive = 0.5,
    ruleBased = 0.5,
    dataHeavy = 0.5,
    humanJudgment = 0.5,
    emotionalLabor = 0.5
  } = factors || {};

  const score01 =
    (repetitive * 0.30) +
    (ruleBased * 0.25) +
    (dataHeavy * 0.15) +
    ((1 - humanJudgment) * 0.20) +
    ((1 - emotionalLabor) * 0.10);

  return Math.round(clamp(score01, 0, 1) * 100);
}

export function riskBand(score) {
  if (score <= 30) return { band: "Low", emoji: "🟢" };
  if (score <= 60) return { band: "Moderate", emoji: "🟡" };
  return { band: "High", emoji: "🔴" };
}

export function timelineFromScore(score) {
  if (score >= 80) return { label: "1–3 years", phase: "Fast disruption (assist → replace)" };
  if (score >= 60) return { label: "3–7 years", phase: "Partial automation & role redesign" };
  if (score >= 40) return { label: "5–10 years", phase: "Steady augmentation; slower displacement" };
  return { label: "10+ years", phase: "Low risk; mainly tool-assisted improvements" };
}
