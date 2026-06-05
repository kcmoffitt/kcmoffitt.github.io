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
  tools: (item, block) => resourceCard(item, "Open tool", block),
  frameworks: (item, block) => resourceCard(item, "Open resource", block),
  "white-papers": (item, block) => resourceCard(item, "Open report", block)
};

function tags(values = []) {
  return values.map((value) => `<span class="tag">${escapeHtml(value)}</span>`).join("");
}

function resourceCard(item, actionLabel, block) {
  const prefix = block?.dataset.prefix || "";
  const rawHref = item.href || item.url || item.openAccessUrl || "";
  const href = rawHref.startsWith("http") ? rawHref : `${prefix}${rawHref}`;
  const authors = item.authors || (item.organization ? [item.organization] : []);
  const topics = item.topics || [item.topic].filter(Boolean);
  const auditDomains = item.auditDomains || [];
  const source = item.source || item.publisher || item.organization || "";
  const year = item.year || "";
  const meta = [
    item.sourceType,
    source,
    year,
    item.access ? `Access: ${item.access}` : ""
  ].filter(Boolean);

  return `
    <article class="card"
      data-title="${escapeAttribute(item.title)}"
      data-topics="${escapeAttribute(topics.join(" "))}"
      data-author="${escapeAttribute(authors.join(" "))}"
      data-source="${escapeAttribute(source)}"
      data-year="${escapeAttribute(year)}">
      <div class="card-meta">${tags(meta)}</div>
      <h3>${escapeHtml(item.title)}</h3>
      ${authors.length ? `<p><strong>${escapeHtml(authors.join(", "))}</strong></p>` : ""}
      <p>${escapeHtml(item.summary)}</p>
      ${item.auditUse ? `<p>${escapeHtml(item.auditUse)}</p>` : ""}
      ${topics.length || auditDomains.length ? `<div class="tag-row">${tags([...topics, ...auditDomains])}</div>` : ""}
      <a class="text-link" href="${escapeAttribute(href)}" target="${externalTarget(href)}" rel="noopener">${actionLabel}</a>
      ${item.openAccessUrl && item.openAccessUrl !== rawHref ? `<a class="text-link" href="${escapeAttribute(item.openAccessUrl)}" target="_blank" rel="noopener">Open access copy</a>` : ""}
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
  const author = directory.querySelector("[data-filter-author]");
  const source = directory.querySelector("[data-filter-source]");
  const sort = directory.querySelector("[data-sort]");
  const cards = Array.from(container.querySelectorAll(".card"));
  const params = new URLSearchParams(location.search);
  const initialQuery = params.get("q");
  if (initialQuery && search) search.value = initialQuery;

  const applyFilters = () => {
    const query = (search?.value || "").toLowerCase().trim();
    const selectedTopic = topic?.value || "all";
    const authorQuery = (author?.value || "").toLowerCase().trim();
    const sourceQuery = (source?.value || "").toLowerCase().trim();
    let visible = 0;

    cards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      const topics = (card.dataset.topics || "").toLowerCase();
      const authorText = (card.dataset.author || "").toLowerCase();
      const sourceText = (card.dataset.source || "").toLowerCase();
      const matchesQuery = !query || text.includes(query);
      const matchesTopic = selectedTopic === "all" || topics.includes(selectedTopic);
      const matchesAuthor = !authorQuery || authorText.includes(authorQuery);
      const matchesSource = !sourceQuery || sourceText.includes(sourceQuery);
      const show = matchesQuery && matchesTopic && matchesAuthor && matchesSource;
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

  const applySort = () => {
    if (!sort) return;
    const cardsBySort = Array.from(container.querySelectorAll(".card"));
    const value = sort.value;
    cardsBySort.sort((a, b) => {
      if (value === "year-desc") return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
      if (value === "year-asc") return Number(a.dataset.year || 0) - Number(b.dataset.year || 0);
      if (value === "author") return (a.dataset.author || "").localeCompare(b.dataset.author || "");
      if (value === "source") return (a.dataset.source || "").localeCompare(b.dataset.source || "");
      if (value === "topic") return (a.dataset.topics || "").localeCompare(b.dataset.topics || "");
      return (a.dataset.title || "").localeCompare(b.dataset.title || "");
    });
    cardsBySort.forEach((card) => container.append(card));
  };

  [search, topic, author, source].filter(Boolean).forEach((control) => {
    control.addEventListener("input", applyFilters);
    control.addEventListener("change", applyFilters);
  });
  if (sort) sort.addEventListener("change", () => {
    applySort();
    applyFilters();
  });
  applySort();
  applyFilters();
}

renderDataBlocks();
