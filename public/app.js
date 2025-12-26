/* public/app.js
   Analyzer-only logic.
   Safe to include on all pages (it exits early if analyzer elements aren't present).
*/

(() => {
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
  const analyzeBtn = $("analyzeBtn");

  // If we are not on the analyzer page, do nothing.
  if (!form || !jobTitleInput) return;

  function setSuggestionsVisible(visible) {
    if (!suggestionsEl) return;
    suggestionsEl.classList.toggle("show", visible);
  }

  function clearSuggestions() {
    if (!suggestionsEl) return;
    suggestionsEl.innerHTML = "";
    setSuggestionsVisible(false);
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  async function fetchSuggestions(q) {
    const res = await fetch(`/api/suggest?q=${encodeURIComponent(q)}`);
    if (!res.ok) return [];
    const data = await res.json().catch(() => ({}));
    return data.results || [];
  }

  function renderSuggestions(items) {
    if (!suggestionsEl) return;
    if (!items.length) return clearSuggestions();

    suggestionsEl.innerHTML = items
      .map((t) => `<button type="button" role="option" data-title="${escapeHtml(t)}">${escapeHtml(t)}</button>`)
      .join("");

    setSuggestionsVisible(true);
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

  if (suggestionsEl) {
    suggestionsEl.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-title]");
      if (!btn) return;
      jobTitleInput.value = btn.dataset.title || "";
      clearSuggestions();
      jobTitleInput.focus();
    });
  }

  document.addEventListener("click", (e) => {
    if (!suggestionsEl) return;
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
      body: JSON.stringify({ jobTitle }),
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
    if (!tasksEl) return;
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
    if (!skillsEl) return;
    skillsEl.innerHTML = (skills || []).map((s) => `<li>${escapeHtml(s)}</li>`).join("");
  }

  function buildShareText(jobTitle, score, bandLabel, timelineLabel) {
    return `My job automation risk for "${jobTitle}" is ${score}% (${bandLabel}). Estimated disruption: ${timelineLabel}. Check yours: ${location.origin}`;
  }

  function setShareLinks(shareText) {
    if (!tweetBtn) return;
    const url = encodeURIComponent(location.origin);
    const text = encodeURIComponent(shareText);
    tweetBtn.href = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
  }

  if (copyBtn) {
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
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearSuggestions();

    const jobTitle = jobTitleInput.value.trim();
    if (!jobTitle) return;

    if (analyzeBtn) {
      analyzeBtn.disabled = true;
      analyzeBtn.textContent = "Analyzing…";
    }

    try {
      const data = await analyze(jobTitle);

      if (resultsEl) resultsEl.classList.remove("hidden");
      if (resultTitleEl) resultTitleEl.textContent = `Results for “${data.jobTitle}”`;
      if (riskScoreEl) riskScoreEl.textContent = `${data.riskScore}%`;
      if (bandPillEl) bandPillEl.textContent = bandToPill(data.band);

      if (timelineEl) timelineEl.textContent = data.timeline?.label || "—";
      if (timelinePhaseEl) timelinePhaseEl.textContent = data.timeline?.phase || "—";

      renderTasks(data.tasksLikely);
      renderSkills(data.protectiveSkills);

      if (modelNoteEl) modelNoteEl.textContent = data.explainability?.note || "";

      const bandLabel = data.band?.band || "—";
      const shareText = buildShareText(data.jobTitle, data.riskScore, bandLabel, data.timeline?.label || "—");

      if (copyBtn) copyBtn.dataset.share = shareText;
      setShareLinks(shareText);

      if (resultsEl) resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      if (resultsEl) resultsEl.classList.remove("hidden");
      if (resultTitleEl) resultTitleEl.textContent = "No match yet";
      if (riskScoreEl) riskScoreEl.textContent = "—";
      if (bandPillEl) bandPillEl.textContent = "Try another title";
      if (timelineEl) timelineEl.textContent = "—";
      if (timelinePhaseEl) timelinePhaseEl.textContent = err?.message || "Try a broader job title.";

      if (tasksEl) tasksEl.innerHTML = "";
      if (skillsEl) skillsEl.innerHTML = "";

      if (modelNoteEl) {
        modelNoteEl.textContent =
          "Tip: Start with broad roles like “Accountant”, “Software Engineer”, “Truck Driver”.";
      }

      if (resultsEl) resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
    } finally {
      if (analyzeBtn) {
        analyzeBtn.disabled = false;
        analyzeBtn.textContent = "Analyze";
      }
    }
  });
})();
