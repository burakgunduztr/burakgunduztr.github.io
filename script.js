/**
 * script.js
 *
 * Reads the `files` array from data.js, groups entries by category,
 * sorts each group newest-first, and renders the result into #app.
 *
 * Also powers the lightweight search bar that filters titles,
 * descriptions, and categories in real time.
 */

(function () {
  "use strict";

  /* ── Helpers ────────────────────────────────────────────────────────────── */

  /** Parse "YYYY-MM-DD" into a sortable number (larger = newer). */
  function dateValue(str) {
    return new Date(str).getTime();
  }

  /** Format "YYYY-MM-DD" → "Feb 20, 2026" for display. */
  function formatDate(str) {
    const d = new Date(str + "T00:00:00"); // avoid UTC offset shifting the day
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  }

  /** Escape HTML special characters to prevent XSS. */
  function escHtml(s) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ── Data processing ────────────────────────────────────────────────────── */

  /**
   * Group an array of file objects by their `category` field.
   * Returns a Map<string, FileObject[]> preserving insertion order
   * (which we control by sorting the category names alphabetically).
   */
  function groupByCategory(fileList) {
    const map = new Map();

    fileList.forEach((f) => {
      if (!map.has(f.category)) map.set(f.category, []);
      map.get(f.category).push(f);
    });

    // Sort entries within each category: newest first
    map.forEach((entries) => {
      entries.sort((a, b) => dateValue(b.updated) - dateValue(a.updated));
    });

    // Sort category keys alphabetically for a predictable order
    return new Map([...map.entries()].sort((a, b) => a[0].localeCompare(b[0])));
  }

  /* ── Rendering ──────────────────────────────────────────────────────────── */

  /** Render a single file card as an HTML string. */
  function renderCard(f) {
    return `
      <a
        class="card"
        href="${escHtml(f.file)}"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open ${escHtml(f.title)}"
      >
        <div class="card-body">
          <p class="card-title">${escHtml(f.title)}</p>
          <p class="card-desc">${escHtml(f.description)}</p>
        </div>
        <time class="card-date" datetime="${escHtml(f.updated)}">
          ${formatDate(f.updated)}
        </time>
      </a>`;
  }

  /** Render a full category section (heading + cards) as an HTML string. */
  function renderCategory(categoryName, entries) {
    const cards = entries.map(renderCard).join("\n");
    return `
      <section class="category" aria-labelledby="cat-${escHtml(categoryName)}">
        <h2 class="category-title" id="cat-${escHtml(categoryName)}">${escHtml(categoryName)}</h2>
        <div class="card-list">
          ${cards}
        </div>
      </section>`;
  }

  /** Write all categories + cards into the #app container. */
  function renderAll(fileList) {
    const app = document.getElementById("app");
    const grouped = groupByCategory(fileList);

    if (grouped.size === 0) {
      app.innerHTML = `<p class="empty-state">No documents found.</p>`;
      return;
    }

    let html = "";
    grouped.forEach((entries, name) => {
      html += renderCategory(name, entries);
    });

    app.innerHTML = html;

    // Stagger-animate each card on initial paint
    requestAnimationFrame(() => {
      const cards = app.querySelectorAll(".card");
      cards.forEach((card, i) => {
        card.style.animationDelay = `${i * 40}ms`;
        card.classList.add("card--visible");
      });
    });
  }

  /* ── Search ─────────────────────────────────────────────────────────────── */

  /**
   * Filter `files` against a lowercase query string.
   * Matches against title, description, and category.
   */
  function filterFiles(query) {
    if (!query) return files;
    const q = query.toLowerCase();
    return files.filter(
      (f) =>
        f.title.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q)
    );
  }

  /** Attach the search input listener. */
  function initSearch() {
    const input = document.getElementById("search");
    if (!input) return;

    let debounceTimer;

    input.addEventListener("input", () => {
      clearTimeout(debounceTimer);
      // Debounce to avoid re-rendering on every keystroke
      debounceTimer = setTimeout(() => {
        const filtered = filterFiles(input.value.trim());
        renderAll(filtered);
      }, 150);
    });
  }

  /* ── Bootstrap ──────────────────────────────────────────────────────────── */

  function init() {
    renderAll(files);
    initSearch();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
