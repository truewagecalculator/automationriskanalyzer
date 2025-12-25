const $ = (id) => document.getElementById(id);

const form = $("analyzeForm");
const jobTitleInput = $("jobTitle");
const suggestionsEl = $("suggestions");
const resultsEl = $("results");

const riskScoreEl = $("riskScore");
const bandPillEl = $("bandPill");
const resultTitleEl = $("resultTitle");
const timelineEl = $("timeline");
const timelinePhaseEl = $("timelinePhase");
const tasksEl = $("tasks");
const skillsEl = $("skills");
const modelNoteEl = $("modelNote");

const copyBtn = $("copyBtn");
const tweetBtn = $("tweetBtn");
const yearEl = $("year");

yearEl.textContent = String(new Date().getFullYear());

function setSuggestionsVisible(visible) {
  suggestionsEl.classList.toggle("show", visible);
}

function clearSuggestions() {
  suggestionsEl.innerHTML = "";
  setSuggestionsVisible(false);
}

async function fetchSuggestions(q) {
  const res = await fetch(`/api/suggest?q=${encodeURIComponent(q)}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.results || [];
}

function renderSuggestions(items) {
  if (!items.length) return clearSuggestions();

  suggestionsEl.innerHTML = items
    .map((t) => `<button type="button" role="option" data-title="${escapeHtml(t)}">${escapeHtml(t)}</button>`)
    .join("");
  setSuggestionsVisible(true);
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

let suggestTimer = null;
jobTitleInput.addEventListener("input", () => {
  const q = jobTitleInput.value.trim();
  if (suggestTimer) clearTimeout(suggestTimer);

  if (q.length < 2) return clearSuggestions();

  suggestTimer = setTimeout(async () => {
    try {
      const items = await fetchSuggestions(q);
      renderSuggestions(items);
    } catch {
      clearSuggestions();
    }
  }, 140);
});

suggestionsEl.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-title]");
  if (!btn) return;
  jobTitleInput.value = btn.dataset.title;
  clearSuggestions();
  jobTitleInput.focus();
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".search")) clearSuggestions();
});

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    jobTitleInput.value = chip.dataset.preset || "";
    clearSuggestions();
    form.requestSubmit();
  });
});

async function analyze(jobTitle) {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jobTitle })
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) {
    throw new Error(data.error || "Could not analyze that job yet.");
  }
  return data;
}

function bandToPill(band) {
  const { emoji, band: label } = band || { emoji: "—", band: "—" };
  return `${emoji} ${label}`;
}

function renderTasks(tasks) {
  tasksEl.innerHTML = "";
  for (const t of tasks || []) {
    const pct = Math.max(0, Math.min(100, Number(t.likelihood || 0)));
    const node = document.createElement("div");
    node.className = "task";
    node.innerHTML = `
      <div class="task-top">
        <div class="task-name">${escapeHtml(t.name)}</div>
        <div class="task-likelihood">${pct}%</div>
      </div>
      <div class="bar"><div style="width:${pct}%"></div></div>
    `;
    tasksEl.appendChild(node);
  }
}

function renderSkills(skills) {
  skillsEl.innerHTML = (skills || [])
    .map((s) => `<li>${escapeHtml(s)}</li>`)
    .join("");
}

function buildShareText(jobTitle, score, bandLabel, timelineLabel) {
  return `My job automation risk for "${jobTitle}" is ${score}% (${bandLabel}). Estimated disruption: ${timelineLabel}. Check yours: ${location.origin}`;
}

function setShareLinks(shareText) {
  const url = encodeURIComponent(location.origin);
  const text = encodeURIComponent(shareText);
  tweetBtn.href = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
}

copyBtn.addEventListener("click", async () => {
  const text = copyBtn.dataset.share || "";
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = "Copied ✅";
    setTimeout(() => (copyBtn.textContent = "Copy share text"), 1200);
  } catch {
    copyBtn.textContent = "Copy failed";
    setTimeout(() => (copyBtn.textContent = "Copy share text"), 1200);
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearSuggestions();

  const jobTitle = jobTitleInput.value.trim();
  if (!jobTitle) return;

  const btn = $("analyzeBtn");
  btn.disabled = true;
  btn.textContent = "Analyzing…";

  try {
    const data = await analyze(jobTitle);

    resultsEl.classList.remove("hidden");
    resultTitleEl.textContent = `Results for “${data.jobTitle}”`;
    riskScoreEl.textContent = `${data.riskScore}%`;
    bandPillEl.textContent = bandToPill(data.band);

    timelineEl.textContent = data.timeline?.label || "—";
    timelinePhaseEl.textContent = data.timeline?.phase || "—";

    renderTasks(data.tasksLikely);
    renderSkills(data.protectiveSkills);

    modelNoteEl.textContent = data.explainability?.note || "";

    const bandLabel = data.band?.band || "—";
    const shareText = buildShareText(data.jobTitle, data.riskScore, bandLabel, data.timeline?.label || "—");
    copyBtn.dataset.share = shareText;
    setShareLinks(shareText);

    resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (err) {
    resultsEl.classList.remove("hidden");
    resultTitleEl.textContent = "No match yet";
    riskScoreEl.textContent = "—";
    bandPillEl.textContent = "Try another title";
    timelineEl.textContent = "—";
    timelinePhaseEl.textContent = err?.message || "Try a broader job title.";
    tasksEl.innerHTML = "";
    skillsEl.innerHTML = "";
    modelNoteEl.textContent = "Tip: Start with broad roles like “Accountant”, “Software Engineer”, “Truck Driver”.";
    resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
  } finally {
    btn.disabled = false;
    btn.textContent = "Analyze";
  }
});
