import { JOB_INDEX, JOB_ALIASES } from "../_data/jobsIndex.js";
import { TEMPLATES } from "../_data/templates.js";
import { computeRiskScore, riskBand, timelineFromScore } from "../_data/riskModel.js";

function norm(s) {
  return (s || "").trim().toLowerCase();
}

function findJob(input) {
  const q = norm(input);
  if (!q) return null;

  // alias -> canonical title
  const aliasHit = JOB_ALIASES[q];
  const queryTitle = aliasHit ? aliasHit : input;

  // exact match
  const exact = JOB_INDEX.find(j => norm(j.title) === norm(queryTitle));
  if (exact) return exact;

  // contains match
  const contains = JOB_INDEX.find(j => norm(j.title).includes(q));
  return contains || null;
}

export async function onRequestPost({ request }) {
  let body = {};
  try { body = await request.json(); } catch {}

  const jobTitleRaw = (body.jobTitle || "").trim();
  const job = findJob(jobTitleRaw);

  if (!job) {
    return new Response(JSON.stringify({
      ok: false,
      error: "Job not found yet. Try a broader title or a common equivalent (e.g., “Accountant”, “Teacher”, “Sales Representative”)."
    }), {
      status: 404,
      headers: { "content-type": "application/json; charset=utf-8" }
    });
  }

  const template = TEMPLATES[job.template];
  if (!template) {
    return new Response(JSON.stringify({
      ok: false,
      error: "Template mapping error (missing template)."
    }), {
      status: 500,
      headers: { "content-type": "application/json; charset=utf-8" }
    });
  }

  // Allow per-job overrides later if you add them
  const tasks = job.overrides?.tasks || template.tasks;
  const protectiveSkills = job.overrides?.protectiveSkills || template.protectiveSkills;
  const factors = { ...template.factors, ...(job.overrides?.factors || {}) };

  const riskScore = computeRiskScore(factors);
  const band = riskBand(riskScore);
  const timeline = timelineFromScore(riskScore);

  const tasksLikely = [...tasks].sort((a, b) => b.likelihood - a.likelihood).slice(0, 6);

  return new Response(JSON.stringify({
    ok: true,
    jobTitle: job.title,
    template: { key: job.template, label: template.label },
    riskScore,
    band,
    timeline,
    tasksLikely,
    protectiveSkills,
    explainability: {
      model: "template-archetype-v1",
      note: "This estimate is based on common task patterns for this role family. Real outcomes vary by company, industry, and seniority."
    }
  }), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}
