const libraryState = {
  resources: [],
  filtered: [],
  unavailableCollections: []
};

const controls = {
  search: document.querySelector("#library-search"),
  type: document.querySelector("#library-type"),
  topic: document.querySelector("#library-topic"),
  access: document.querySelector("#library-access"),
  sort: document.querySelector("#library-sort"),
  clear: document.querySelector("#clear-library-filters"),
  count: document.querySelector("#library-count"),
  results: document.querySelector("#library-results")
};

const sourceFiles = [
  { href: "../data/papers.json", group: "academic-paper", label: "Academic paper" },
  { href: "../data/frameworks.json", group: "framework", label: "Framework / standard" },
  { href: "../data/regulations.json", group: "regulation", label: "Regulation / law" },
  { href: "../data/white-papers.json", group: "white-paper", label: "White paper / report" }
];

async function loadLibrary() {
  const collections = await Promise.all(sourceFiles.map(loadSourceCollection));
  libraryState.resources = collections.flatMap((collection) => collection.resources);
  libraryState.unavailableCollections = collections
    .filter((collection) => collection.error)
    .map((collection) => collection.source.label);

  bindLibraryControls();
  const params = new URLSearchParams(location.search);
  const initialQuery = params.get("q");
  if (initialQuery) controls.search.value = initialQuery;

  if (!libraryState.resources.length) {
    controls.results.innerHTML = `<tr><td colspan="8">${escapeHtml(getUnavailableMessage())}</td></tr>`;
    controls.count.textContent = "Library unavailable";
    return;
  }

  applyLibraryFilters();
}

async function loadSourceCollection(source) {
  try {
    const response = await fetch(source.href, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`${source.href} returned ${response.status}`);
    }

    const items = await response.json();
    if (!Array.isArray(items)) {
      throw new Error(`${source.href} did not contain a JSON array`);
    }

    return {
      source,
      resources: items.map((item) => normalizeResource(item, source))
    };
  } catch (error) {
    console.warn(`Could not load ${source.label}`, error);
    return {
      source,
      resources: [],
      error
    };
  }
}

function getUnavailableMessage() {
  if (location.protocol === "file:") {
    return "The library data could not be loaded because browsers block JSON requests from local files. Open the site through GitHub Pages or a local web server.";
  }

  return "The library data could not be loaded. Check that the data files are published with the site.";
}

function normalizeResource(item, source) {
  const authors = item.authors || (item.organization ? [item.organization] : item.authority ? [item.authority] : []);
  const topics = item.topics || [item.topic].filter(Boolean);
  const auditDomains = item.auditDomains || [];
  const sourceName = item.source || item.publisher || item.organization || item.authority || "";
  const url = item.url || item.href || item.openAccessUrl || "";
  const access = item.access || "unknown";
  const sourceType = item.sourceType || source.group;
  const jurisdiction = item.jurisdiction || "";
  const status = item.status || "";
  const bindingLevel = item.bindingLevel || "";
  const effectiveDate = item.effectiveDate || "";
  const searchText = [
    item.title,
    item.year,
    source.label,
    sourceType,
    jurisdiction,
    item.authority,
    status,
    bindingLevel,
    effectiveDate,
    authors.join(" "),
    sourceName,
    item.publisher,
    item.doi,
    access,
    topics.join(" "),
    auditDomains.join(" "),
    item.summary,
    item.auditUse,
    item.citation
  ].filter(Boolean).join(" ").toLowerCase();

  return {
    id: `${source.group}-${item.id || slugify(item.title)}`,
    title: item.title || "Untitled",
    year: Number(item.year) || 0,
    yearLabel: item.year || "",
    group: source.group,
    typeLabel: source.label,
    sourceType,
    authors,
    peopleLabel: summarizePeople(authors),
    source: sourceName,
    jurisdiction,
    status,
    bindingLevel,
    effectiveDate,
    topics,
    auditDomains,
    broadTopics: getBroadTopics([...topics, ...auditDomains, sourceType, bindingLevel, status]),
    access,
    url,
    openAccessUrl: item.openAccessUrl || "",
    doi: item.doi || "",
    summary: item.summary || "",
    auditUse: item.auditUse || "",
    citation: item.citation || "",
    searchText
  };
}

function summarizePeople(values) {
  if (!values.length) return "";
  if (values.length <= 2) return values.join(", ");
  return `${values.slice(0, 2).join(", ")} +${values.length - 2}`;
}

function slugify(value = "") {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function getBroadTopics(values) {
  const text = values.join(" ").toLowerCase();
  const topics = new Set();
  if (text.includes("assurance") || text.includes("trustworthy")) topics.add("ai-assurance");
  if (text.includes("risk") || text.includes("safety") || text.includes("impact")) topics.add("ai-risk");
  if (text.includes("audit") || text.includes("accountability")) topics.add("ai-auditing");
  if (text.includes("governance") || text.includes("regulation") || text.includes("standard") || text.includes("compliance")) topics.add("governance");
  if (text.includes("evaluation") || text.includes("benchmark") || text.includes("testing")) topics.add("evaluation");
  if (text.includes("fairness") || text.includes("bias")) topics.add("fairness");
  if (text.includes("security") || text.includes("privacy") || text.includes("adversarial") || text.includes("threat")) topics.add("security");
  if (text.includes("documentation") || text.includes("transparency") || text.includes("datasheet") || text.includes("model-documentation")) topics.add("documentation");
  if (text.includes("language-model") || text.includes("llm") || text.includes("frontier") || text.includes("generative")) topics.add("llm-frontier");
  return Array.from(topics);
}

function bindLibraryControls() {
  [controls.search, controls.type, controls.topic, controls.access, controls.sort].forEach((control) => {
    control.addEventListener("input", applyLibraryFilters);
    control.addEventListener("change", applyLibraryFilters);
  });
  controls.clear.addEventListener("click", () => {
    controls.search.value = "";
    controls.type.value = "all";
    controls.topic.value = "all";
    controls.access.value = "all";
    controls.sort.value = "year-desc";
    applyLibraryFilters();
    controls.search.focus();
  });
}

function applyLibraryFilters() {
  const terms = controls.search.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const type = controls.type.value;
  const topic = controls.topic.value;
  const access = controls.access.value;

  libraryState.filtered = libraryState.resources.filter((resource) => {
    const matchesSearch = terms.every((term) => resource.searchText.includes(term));
    const matchesType = type === "all" || resource.group === type;
    const matchesTopic = topic === "all" || resource.broadTopics.includes(topic);
    const matchesAccess = access === "all" || resource.access === access;
    return matchesSearch && matchesType && matchesTopic && matchesAccess;
  });

  sortResources();
  renderLibrary();
}

function sortResources() {
  const sort = controls.sort.value;
  libraryState.filtered.sort((a, b) => {
    if (sort === "year-desc") return b.year - a.year || a.title.localeCompare(b.title);
    if (sort === "year-asc") return a.year - b.year || a.title.localeCompare(b.title);
    if (sort === "source") return a.source.localeCompare(b.source) || a.title.localeCompare(b.title);
    return a.title.localeCompare(b.title);
  });
}

function renderLibrary() {
  const total = libraryState.resources.length;
  const shown = libraryState.filtered.length;
  const unavailableNote = libraryState.unavailableCollections.length
    ? `; unavailable: ${libraryState.unavailableCollections.join(", ")}`
    : "";
  controls.count.textContent = `Showing ${shown} of ${total} resources${unavailableNote}`;

  if (!shown) {
    controls.results.innerHTML = `<tr><td colspan="8">No resources match the current filters.</td></tr>`;
    return;
  }

  controls.results.innerHTML = libraryState.filtered.map((resource) => `
    <tr class="resource-row">
      <td>
        <button class="row-toggle" type="button" aria-expanded="false" aria-controls="${escapeAttribute(resource.id)}-details">
          ${escapeHtml(resource.title)}
        </button>
      </td>
      <td>${escapeHtml(resource.yearLabel)}</td>
      <td>${escapeHtml(resource.typeLabel)}</td>
      <td>${escapeHtml(resource.peopleLabel)}</td>
      <td>${escapeHtml(resource.source)}</td>
      <td>${renderTopicPreview(resource.topics)}</td>
      <td><span class="access-pill access-${escapeAttribute(resource.access)}">${escapeHtml(resource.access)}</span></td>
      <td>${resource.url ? `<a class="text-link" href="${escapeAttribute(resource.url)}" target="_blank" rel="noopener">Open</a>` : ""}</td>
    </tr>
    <tr class="detail-row" id="${escapeAttribute(resource.id)}-details" hidden>
      <td colspan="8">
        <div class="detail-content">
          ${renderRegulatoryDetails(resource)}
          ${resource.summary ? `<p><strong>Summary:</strong> ${escapeHtml(resource.summary)}</p>` : ""}
          ${resource.auditUse ? `<p><strong>Audit use:</strong> ${escapeHtml(resource.auditUse)}</p>` : ""}
          ${resource.doi ? `<p><strong>DOI:</strong> ${escapeHtml(resource.doi)}</p>` : ""}
          ${resource.citation ? `<p><strong>Citation:</strong> ${escapeHtml(resource.citation)}</p>` : ""}
          ${resource.openAccessUrl && resource.openAccessUrl !== resource.url ? `<p><a class="text-link" href="${escapeAttribute(resource.openAccessUrl)}" target="_blank" rel="noopener">Open access copy</a></p>` : ""}
          ${resource.topics.length || resource.auditDomains.length ? `<div class="tag-row">${tags([...resource.topics, ...resource.auditDomains])}</div>` : ""}
        </div>
      </td>
    </tr>
  `).join("");

  controls.results.querySelectorAll(".row-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const details = document.querySelector(`#${button.getAttribute("aria-controls")}`);
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      details.hidden = expanded;
    });
  });
}

function renderTopicPreview(values) {
  const preview = values.slice(0, 3);
  const extra = values.length - preview.length;
  return `${tags(preview)}${extra > 0 ? `<span class="tag">+${extra}</span>` : ""}`;
}

function renderRegulatoryDetails(resource) {
  const details = [
    resource.jurisdiction ? `Jurisdiction: ${resource.jurisdiction}` : "",
    resource.status ? `Status: ${resource.status}` : "",
    resource.bindingLevel ? `Binding level: ${resource.bindingLevel}` : "",
    resource.effectiveDate ? `Effective date: ${resource.effectiveDate}` : ""
  ].filter(Boolean);

  if (!details.length) return "";
  return `<p><strong>Governance details:</strong> ${escapeHtml(details.join(" | "))}</p>`;
}

function tags(values = []) {
  return values.map((value) => `<span class="tag">${escapeHtml(value)}</span>`).join("");
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

loadLibrary();
