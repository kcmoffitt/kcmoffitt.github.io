const items = [
  "Inventory entry exists for the AI system and all material dependencies.",
  "Business owner, technical owner, and risk owner are named.",
  "Intended use, prohibited use, and affected users are documented.",
  "Training data or vendor data sources are summarized with known limitations.",
  "Evaluation claims map to test design, results, and acceptance criteria.",
  "Bias, fairness, and accessibility risks were considered for affected groups.",
  "Security testing includes abuse cases relevant to the deployment context.",
  "Monitoring covers drift, incidents, overrides, and model changes.",
  "Exceptions and residual risk have accountable approval."
];

const checklist = document.querySelector("#checklist");
const progress = document.querySelector("#progress");
const label = document.querySelector("#progress-label");

function render() {
  checklist.innerHTML = items.map((item, index) => `
    <label class="check-row">
      <input type="checkbox" value="${index}">
      <span>${item}</span>
    </label>
  `).join("");
  checklist.addEventListener("change", update);
  update();
}

function update() {
  const checked = checklist.querySelectorAll("input:checked").length;
  const percent = Math.round((checked / items.length) * 100);
  progress.style.width = `${percent}%`;
  label.textContent = `${checked} of ${items.length} complete`;
}

render();
