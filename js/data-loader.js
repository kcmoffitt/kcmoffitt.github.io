const cardTemplates = {
  "learning-paths": (item) => `
    <article class="card">
      <div class="tag-row">${tags(item.tags)}</div>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.summary)}</p>
      <a class="text-link" href="${escapeAttribute(item.href)}">Open path</a>
    </article>
  `,
  papers: (item, block) => resourceCard(item, "Read paper", block),
  videos: (item, block) => resourceCard(item, "Watch video", block),
  tools: (item, block) => resourceCard(item, "Open tool", block)
};

function tags(values = []) {
  return values.map((value) => `<span class="tag">${escapeHtml(value)}</span>`).join("");
}

function resourceCard(item, actionLabel, block) {
  const prefix = block?.dataset.prefix || "";
  const href = item.href?.startsWith("http") ? item.href : `${prefix}${item.href}`;
  return `
    <article class="card" data-title="${escapeAttribute(item.title)}" data-topic="${escapeAttribute(item.topic || "all")}" data-level="${escapeAttribute(item.level || "all")}">
      <div class="card-meta">${tags([item.topic, item.level, item.year].filter(Boolean))}</div>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.summary)}</p>
      <a class="text-link" href="${escapeAttribute(href)}" target="${externalTarget(href)}" rel="noopener">${actionLabel}</a>
    </article>
  `;
}

function externalTarget(href = "") {
  return href.startsWith("http") ? "_blank" : "_self";
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value = "") {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

async function renderDataBlocks() {
  const blocks = document.querySelectorAll("[data-render]");
  await Promise.all(Array.from(blocks).map(async (block) => {
    const type = block.dataset.render;
    const source = block.dataset.src;
    const limit = Number(block.dataset.limit || 0);
    const template = cardTemplates[type];
    if (!source || !template) return;

    try {
      const response = await fetch(source);
      const data = await response.json();
      const items = limit ? data.slice(0, limit) : data;
      block.innerHTML = items.map((item) => template(item, block)).join("");
      setupDirectory(block);
    } catch (error) {
      block.innerHTML = `<p class="empty-state">Resources could not be loaded from ${escapeHtml(source)}.</p>`;
    }
  }));
}

function setupDirectory(container) {
  const directory = container.closest("[data-directory]");
  if (!directory) return;

  const search = directory.querySelector("[data-filter-search]");
  const topic = directory.querySelector("[data-filter-topic]");
  const level = directory.querySelector("[data-filter-level]");
  const cards = Array.from(container.querySelectorAll(".card"));
  const params = new URLSearchParams(location.search);
  const initialQuery = params.get("q");
  if (initialQuery && search) search.value = initialQuery;

  const applyFilters = () => {
    const query = (search?.value || "").toLowerCase().trim();
    const selectedTopic = topic?.value || "all";
    const selectedLevel = level?.value || "all";
    let visible = 0;

    cards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      const matchesQuery = !query || text.includes(query);
      const matchesTopic = selectedTopic === "all" || card.dataset.topic === selectedTopic;
      const matchesLevel = selectedLevel === "all" || card.dataset.level === selectedLevel;
      const show = matchesQuery && matchesTopic && matchesLevel;
      card.hidden = !show;
      if (show) visible += 1;
    });

    let empty = directory.querySelector(".empty-state");
    if (!empty) {
      empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "No matching resources yet.";
      container.after(empty);
    }
    empty.hidden = visible !== 0;
  };

  [search, topic, level].filter(Boolean).forEach((control) => {
    control.addEventListener("input", applyFilters);
    control.addEventListener("change", applyFilters);
  });
  applyFilters();
}

renderDataBlocks();
