const likelihood = document.querySelector("#likelihood");
const impact = document.querySelector("#impact");
const score = document.querySelector("#risk-score");
const guidance = document.querySelector("#risk-guidance");
const matrix = document.querySelector("#matrix");

function riskClass(value) {
  if (value >= 16) return "risk-high";
  if (value >= 7) return "risk-med";
  return "risk-low";
}

function riskText(value) {
  if (value >= 16) return "High priority. Require documented controls, independent validation, and executive risk acceptance.";
  if (value >= 7) return "Moderate priority. Confirm test evidence, monitoring, owner review, and change triggers.";
  return "Low priority. Confirm ownership and baseline monitoring.";
}

function drawMatrix() {
  const active = Number(likelihood.value) * Number(impact.value);
  matrix.innerHTML = "";
  for (let i = 5; i >= 1; i -= 1) {
    for (let l = 1; l <= 5; l += 1) {
      const value = i * l;
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = `matrix-cell ${riskClass(value)}`;
      cell.textContent = value;
      cell.setAttribute("aria-label", `Likelihood ${l}, impact ${i}, score ${value}`);
      if (value === active) cell.style.outline = "3px solid #17201c";
      cell.addEventListener("click", () => {
        likelihood.value = String(l);
        impact.value = String(i);
        update();
      });
      matrix.append(cell);
    }
  }
}

function update() {
  const value = Number(likelihood.value) * Number(impact.value);
  score.textContent = `Score: ${value}`;
  guidance.textContent = riskText(value);
  drawMatrix();
}

likelihood.addEventListener("change", update);
impact.addEventListener("change", update);
update();
