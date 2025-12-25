import { JOB_INDEX, JOB_ALIASES } from "../_data/jobsIndex.js";

function norm(s) {
  return (s || "").trim().toLowerCase();
}

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const q = norm(url.searchParams.get("q") || "");

  if (!q) {
    return new Response(JSON.stringify({ results: [] }), {
      headers: { "content-type": "application/json; charset=utf-8" }
    });
  }

  const directAlias = JOB_ALIASES[q];
  const results = [];

  if (directAlias) results.push(directAlias);

  for (const job of JOB_INDEX) {
    const t = norm(job.title);
    if (t.includes(q)) results.push(job.title);
    if (results.length >= 8) break;
  }

  // de-dupe
  const unique = [...new Set(results)].slice(0, 8);

  return new Response(JSON.stringify({ results: unique }), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=300"
    }
  });
}
