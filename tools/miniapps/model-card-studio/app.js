const initialModelCard = {
  title: "AI Loan Approval Model Card",
  subtitle: "Seven-stage lifecycle revision for audit, governance, and oversight",
  purpose: "This model card summarizes the most important information about an AI-enabled loan approval model in a consistent lifecycle format. It is designed to help audit, risk, compliance, and governance stakeholders understand model purpose, development evidence, testing results, deployment controls, monitoring procedures, accountability structure, and discontinuation planning.",
  stages: [
    {
      id: "design",
      title: "Design and Objectives",
      summary: "Purpose, strategic alignment, intended use, model type, and ethical design considerations.",
      guidance: "A strong design section makes the approved use precise enough that auditors can test whether the model is being used as intended.",
      fields: [
        {
          label: "Purpose and Strategic Alignment",
          description: "Supports consistent consumer personal-loan underwriting by estimating default risk and routing applications to approve, decline, or manual review workflows.",
          outcomes: "Approved business case links model purpose to credit-risk objectives and fair-lending policy. Usage logs show the model is applied only to approved personal-loan products."
        },
        {
          label: "Intended Use and Misuse Guidance",
          description: "Intended to assist trained underwriters and automated credit-decision workflows for consumer personal loans. It is not approved for mortgage underwriting, small-business lending, collections, marketing, employment, or insurance decisions.",
          outcomes: "Policy states allowed and prohibited uses. Production samples show no use outside approved product codes. Exceptions and overrides route to manual review with underwriter notes."
        },
        {
          label: "Model Type and Architecture",
          description: "Supervised credit-risk classification model using gradient-boosted decision trees. The model produces a calibrated probability of default and standardized reason codes.",
          outcomes: "Model inventory identifies architecture, version, owner, inputs, outputs, and decision thresholds. Validator confirms the artifact matches the documented algorithm and feature list."
        },
        {
          label: "Ethical Considerations at Design",
          description: "Design excludes protected attributes and prohibits features likely to operate as direct proxies without documented justification. Requirements include explainability, adverse-action support, human review, fair-lending testing, privacy safeguards, and auditability.",
          outcomes: "Feature review confirms protected attributes are not used as inputs. Compliance sign-off documents fair-lending design review before deployment."
        }
      ]
    },
    {
      id: "development",
      title: "Development and Training",
      summary: "Algorithm details, training data, label quality, and bias mitigations used during development.",
      guidance: "A strong development section lets an auditor trace data, labels, code, and model artifacts back to controlled sources.",
      fields: [
        {
          label: "Algorithm Specifics",
          description: "Gradient-boosted tree model trained with regularization, maximum-depth limits, learning-rate tuning, and monotonic constraints for selected credit-risk variables where appropriate.",
          outcomes: "Training logs contain hyperparameters, feature transformations, training date, software environment, and random seed. Re-execution reproduces metrics within tolerance."
        },
        {
          label: "Data Used to Train the Model",
          description: "Five years of internal personal-loan applications, repayment performance, application attributes, credit-bureau variables, and selected macroeconomic indicators.",
          outcomes: "Data lineage documentation identifies source systems, date ranges, refresh date, exclusions, and preprocessing steps. Data-quality reports document missingness and remediation."
        },
        {
          label: "Labeling Sources and Quality",
          description: "Primary label is observed loan performance, such as default within 12 months or serious delinquency within the performance window.",
          outcomes: "Label-generation script and reconciliation report are available. A sample of labels can be traced from model dataset back to servicing records."
        },
        {
          label: "Fairness and Bias Mitigations",
          description: "Mitigations include protected-attribute exclusion, proxy review, subgroup performance testing, threshold sensitivity analysis, and manual review for low-confidence or thin-file cases.",
          outcomes: "Fair-lending memo documents tested groups, proxy analysis, subgroup results, and selected mitigations. Disparate-impact ratios meet internal review thresholds or include documented remediation."
        }
      ]
    },
    {
      id: "evaluation",
      title: "Evaluation and Testing",
      summary: "Known limitations, technical and ethical performance, and test data used to validate the model.",
      guidance: "A strong evaluation section ties claims to test design, test data, acceptance criteria, and interpretable results.",
      fields: [
        {
          label: "Known Limitations and Biases",
          description: "The model is less reliable for applicants with limited credit history, unusual income patterns, recent identity changes, or data outside the bank's historical footprint.",
          outcomes: "Limitations are listed in validation report and user guidance. Thin-file cases are flagged for manual review. Subgroup sample-size limits are documented."
        },
        {
          label: "Technical Performance",
          description: "Performance is evaluated using AUC, KS statistic, calibration, precision/recall, false-positive and false-negative rates, and threshold-specific accuracy.",
          outcomes: "Holdout AUC = 0.84; KS = 0.43; Brier score = 0.079; calibration slope = 0.98. Out-of-time AUC remains within 0.03 of holdout result."
        },
        {
          label: "Ethical Performance",
          description: "The model is evaluated for fairness of outcomes and explanation quality. Reason codes should accurately reflect variables that materially contributed to the recommendation.",
          outcomes: "Disparate-impact ratios by protected-group proxy are at or above 0.90. Equal-opportunity difference remains within 5 percentage points. Reason-code audit matches local explanation results in at least 95% of sampled declined cases."
        },
        {
          label: "Data Used to Test the Model",
          description: "Testing uses a holdout sample, an out-of-time sample from the most recent quarter before deployment, and a production shadow-test sample.",
          outcomes: "Evaluator confirms no overlap between training and holdout sets. Fairness test data contains sufficient subgroup counts or documents limitations."
        }
      ]
    },
    {
      id: "deployment",
      title: "Deployment",
      summary: "Real-world inputs, operational context, API/interface constraints, and user instructions.",
      guidance: "A strong deployment section makes the production decision path traceable from input to score to final action.",
      fields: [
        {
          label: "Real-World Input Characteristics",
          description: "Production inputs include application data, income, employment status, debt obligations, credit-bureau attributes, requested loan amount, loan purpose, and selected derived ratios.",
          outcomes: "Production data profile matches documented schema. Input validation logs show rejected or corrected records. Data-quality dashboards report missingness and source-system errors."
        },
        {
          label: "Operational Context",
          description: "The model is embedded in the loan-origination platform as an underwriting decision-support tool.",
          outcomes: "Change-management ticket documents deployment approval, user acceptance testing, and go-live date. Decision samples can be traced from intake to model score and final decision."
        },
        {
          label: "Interface and API Constraints",
          description: "The model runs through a secure API with authenticated calls, versioned endpoints, input-schema validation, response logging, latency requirements, and fallback routing.",
          outcomes: "API logs identify model version, timestamp, input validation result, score, reason codes, and response status. Access-control testing confirms only approved systems can call the endpoint."
        },
        {
          label: "User Instructions",
          description: "Underwriters receive instructions on score interpretation, manual review triggers, override documentation, and adverse-action reason communication.",
          outcomes: "Training records show active users completed model-use training before access. Override tests show required justification fields are complete."
        }
      ]
    },
    {
      id: "monitoring",
      title: "Model Monitoring and Maintenance",
      summary: "Controls for intended use, drift detection, operational responsibility, misuse prevention, and transparency.",
      guidance: "A strong monitoring section defines thresholds, owners, review cadence, and escalation evidence.",
      fields: [
        {
          label: "Ensuring Intended Use",
          description: "Ongoing controls compare production use against approved product scope, user roles, decision thresholds, and override policies.",
          outcomes: "Monthly use report shows zero unapproved product codes or unauthorized user groups. Out-of-scope calls trigger incident tickets."
        },
        {
          label: "Drift Detection",
          description: "Monitoring compares production input distributions, score distributions, approval rates, and early performance indicators to training and validation baselines.",
          outcomes: "Weekly PSI reports are generated for critical features and model score. PSI >= 0.10 triggers review; PSI >= 0.20 triggers formal investigation."
        },
        {
          label: "Operational Responsibility",
          description: "Credit Risk Analytics owns performance; Model Risk Management owns validation; Compliance owns fair-lending oversight; IT owns availability, access control, logging, and incident response.",
          outcomes: "RACI matrix lists named owners and backups. Monitoring reports are reviewed on schedule and meeting minutes show issue ownership and closure evidence."
        },
        {
          label: "Preventing Misuse and Supporting Transparency",
          description: "Misuse prevention includes role-based access, prohibited-use policy, API restrictions, threshold-change approvals, override monitoring, and retained reason codes.",
          outcomes: "Access reviews confirm least privilege. Product-scope testing blocks unapproved scoring. Declined-application samples reproduce score, reason codes, model version, and decision path."
        }
      ]
    },
    {
      id: "governance",
      title: "Governance and Accountability",
      summary: "Version history, responsible teams, legal constraints, and documentation availability.",
      guidance: "A strong governance section names accountable owners and proves approvals, constraints, and records are current.",
      fields: [
        {
          label: "Version and Update History",
          description: "The model registry records model versions, training dates, data windows, validation dates, approval dates, deployment dates, thresholds, and changes.",
          outcomes: "Current registry entry includes training, validation, approval, and deployment dates. Any threshold update includes a change ticket, validation report, approval memo, and checksum."
        },
        {
          label: "Responsible Teams or Contacts",
          description: "Named contacts include business owner, model owner, model validator, compliance owner, IT system owner, and executive sponsor.",
          outcomes: "Model inventory contains current named contacts and escalation paths. Annual ownership certification confirms owners are active and assigned."
        },
        {
          label: "Legal and Regulatory Constraints",
          description: "The model is governed by fair-lending, adverse-action, credit-reporting, privacy, model-risk, records-retention, and consumer-protection requirements.",
          outcomes: "Compliance review documents legal constraints and required controls. Adverse-action sample testing confirms specific, accurate, documented reasons are provided."
        },
        {
          label: "Documentation Availability",
          description: "Available documentation includes the model card, business case, data dictionary, feature list, training log, validation report, fairness analysis, monitoring plan, user guide, change-management records, and decommissioning plan.",
          outcomes: "Document inventory is complete and current. Auditor can access all required documents through the model registry or governance repository."
        }
      ]
    },
    {
      id: "discontinuation",
      title: "Model Discontinuation",
      summary: "Retirement conditions, sunsetting plan, archival procedures, and stakeholder communications.",
      guidance: "A strong discontinuation section proves the organization can retire a model without losing accountability for historical decisions.",
      fields: [
        {
          label: "Conditions for Retirement",
          description: "Retirement is triggered by sustained performance degradation, unresolved fairness concern, regulatory change, major data-source change, replacement by a validated model, discontinued product line, or unmitigated platform risk.",
          outcomes: "Retirement criteria are listed in lifecycle plan. Monitoring reports map trigger thresholds to actions. Committee minutes document decisions to continue, remediate, replace, or retire."
        },
        {
          label: "Model Sunsetting Plans",
          description: "A sunsetting plan defines successor model development, parallel testing, user communication, fallback underwriting procedures, approval steps, and transition timing.",
          outcomes: "Sunset checklist includes successor readiness, parallel-run results, rollback plan, user training, compliance approval, and production cutover evidence."
        },
        {
          label: "Model Discontinuance and Archival",
          description: "When retired, the model is removed from production, access is disabled, and final artifacts, code, training snapshot, validation report, monitoring history, decision logs, and reason-code mappings are archived.",
          outcomes: "Registry marks model status as retired with date, reason, and approving body. Archived artifacts can reproduce historical decisions for a sample period."
        },
        {
          label: "Communication to Stakeholders",
          description: "Stakeholders include underwriters, credit-risk leadership, compliance, internal audit, technology, regulators when applicable, and affected business units.",
          outcomes: "Communication plan and completion evidence are retained. Users acknowledge new procedures before cutover. Customer-impact review is completed if retirement relates to fairness or error."
        }
      ]
    }
  ]
};

const reviewDimensions = [
  { id: "completeness", label: "Completeness" },
  { id: "evidence", label: "Evidence quality" },
  { id: "auditability", label: "Auditability" },
  { id: "risk", label: "Risk concerns" }
];

const ratingOptions = [
  { value: "0", label: "Unreviewed", score: 0 },
  { value: "4", label: "Strong", score: 4 },
  { value: "3", label: "Adequate", score: 3 },
  { value: "2", label: "Weak", score: 2 },
  { value: "1", label: "Missing", score: 1 }
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

let modelCard = clone(initialModelCard);
let activeStage = modelCard.stages[0].id;
let reviewState = Object.fromEntries(modelCard.stages.map((stage) => [
  stage.id,
  Object.fromEntries(reviewDimensions.map((dimension) => [dimension.id, "0"]))
]));

const els = {
  purpose: document.querySelector("#studio-purpose"),
  scoreValue: document.querySelector("#score-value"),
  scoreBar: document.querySelector("#score-bar"),
  stageButtons: document.querySelector("#stage-buttons"),
  stageKicker: document.querySelector("#stage-kicker"),
  stageTitle: document.querySelector("#stage-title"),
  stageSummary: document.querySelector("#stage-summary"),
  stageFields: document.querySelector("#stage-fields"),
  reviewControls: document.querySelector("#review-controls"),
  gapList: document.querySelector("#gap-list"),
  resetStage: document.querySelector("#reset-stage"),
  clearReview: document.querySelector("#clear-review"),
  exportMarkdown: document.querySelector("#export-markdown"),
  exportJson: document.querySelector("#export-json")
};

function getActiveStage() {
  return modelCard.stages.find((stage) => stage.id === activeStage);
}

function render() {
  els.purpose.textContent = modelCard.purpose;
  renderStageButtons();
  renderStage();
  renderReviewControls();
  updateScore();
}

function renderStageButtons() {
  els.stageButtons.innerHTML = modelCard.stages.map((stage, index) => {
    const reviewed = Object.values(reviewState[stage.id]).filter((value) => value !== "0").length;
    const current = stage.id === activeStage ? ` aria-current="page"` : "";
    return `
      <button class="stage-button" type="button" data-stage="${stage.id}"${current}>
        <span>${index + 1}. ${escapeHtml(stage.title)}</span>
        <small>${reviewed}/${reviewDimensions.length} reviewed</small>
      </button>
    `;
  }).join("");

  els.stageButtons.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      activeStage = button.dataset.stage;
      render();
    });
  });
}

function renderStage() {
  const stage = getActiveStage();
  const stageIndex = modelCard.stages.findIndex((item) => item.id === stage.id) + 1;
  els.stageKicker.textContent = `Stage ${stageIndex}`;
  els.stageTitle.textContent = stage.title;
  els.stageSummary.textContent = stage.summary;

  els.stageFields.innerHTML = `
    <div class="guidance-panel">
      <strong>Audit lens</strong>
      <p>${escapeHtml(stage.guidance)}</p>
    </div>
    ${stage.fields.map((field, index) => renderField(field, index)).join("")}
  `;

  els.stageFields.querySelectorAll("textarea").forEach((textarea) => {
    textarea.addEventListener("input", () => {
      const field = stage.fields[Number(textarea.dataset.field)];
      field[textarea.dataset.key] = textarea.value;
    });
  });
}

function renderField(field, index) {
  return `
    <article class="model-card-field">
      <h3>${escapeHtml(field.label)}</h3>
      <label>
        <span>Description / example</span>
        <textarea data-field="${index}" data-key="description">${escapeHtml(field.description)}</textarea>
      </label>
      <label>
        <span>Testable outcomes / audit evidence</span>
        <textarea data-field="${index}" data-key="outcomes">${escapeHtml(field.outcomes)}</textarea>
      </label>
    </article>
  `;
}

function renderReviewControls() {
  const stage = getActiveStage();
  els.reviewControls.innerHTML = reviewDimensions.map((dimension) => `
    <label>
      <span>${escapeHtml(dimension.label)}</span>
      <select data-dimension="${dimension.id}">
        ${ratingOptions.map((option) => `
          <option value="${option.value}" ${reviewState[stage.id][dimension.id] === option.value ? "selected" : ""}>${option.label}</option>
        `).join("")}
      </select>
    </label>
  `).join("");

  els.reviewControls.querySelectorAll("select").forEach((select) => {
    select.addEventListener("change", () => {
      reviewState[stage.id][select.dataset.dimension] = select.value;
      renderStageButtons();
      updateScore();
    });
  });
}

function updateScore() {
  const scores = modelCard.stages.flatMap((stage) => (
    reviewDimensions.map((dimension) => Number(reviewState[stage.id][dimension.id]))
  ));
  const maxScore = scores.length * 4;
  const currentScore = scores.reduce((sum, value) => sum + value, 0);
  const percent = Math.round((currentScore / maxScore) * 100);
  els.scoreValue.textContent = `${percent}%`;
  els.scoreBar.style.width = `${percent}%`;
  renderGaps();
}

function renderGaps() {
  const gaps = [];
  modelCard.stages.forEach((stage) => {
    reviewDimensions.forEach((dimension) => {
      const rating = Number(reviewState[stage.id][dimension.id]);
      if (rating === 0) {
        gaps.push(`${stage.title}: ${dimension.label} has not been reviewed.`);
      } else if (rating <= 2) {
        gaps.push(`${stage.title}: ${dimension.label} is rated ${getRatingLabel(rating).toLowerCase()}.`);
      }
    });
  });

  if (!gaps.length) {
    els.gapList.innerHTML = `<li>No review gaps flagged yet.</li>`;
    return;
  }

  els.gapList.innerHTML = gaps.slice(0, 12).map((gap) => `<li>${escapeHtml(gap)}</li>`).join("");
}

function getRatingLabel(value) {
  return ratingOptions.find((option) => Number(option.value) === value)?.label || "Unreviewed";
}

function resetActiveStage() {
  const originalStage = initialModelCard.stages.find((stage) => stage.id === activeStage);
  const stageIndex = modelCard.stages.findIndex((stage) => stage.id === activeStage);
  modelCard.stages[stageIndex] = clone(originalStage);
  renderStage();
}

function clearReview() {
  reviewState = Object.fromEntries(modelCard.stages.map((stage) => [
    stage.id,
    Object.fromEntries(reviewDimensions.map((dimension) => [dimension.id, "0"]))
  ]));
  render();
}

function exportJson() {
  const payload = {
    modelCard,
    review: reviewState,
    exportedAt: new Date().toISOString()
  };
  download("model-card-review.json", JSON.stringify(payload, null, 2), "application/json");
}

function exportMarkdown() {
  const lines = [
    `# ${modelCard.title}`,
    "",
    modelCard.subtitle,
    "",
    "## Purpose",
    modelCard.purpose,
    "",
    "## Review Summary",
    `Auditability score: ${els.scoreValue.textContent}`,
    "",
    ...modelCard.stages.flatMap((stage, index) => stageToMarkdown(stage, index))
  ];
  download("model-card-review.md", lines.join("\n"), "text/markdown");
}

function stageToMarkdown(stage, index) {
  return [
    `## ${index + 1}. ${stage.title}`,
    "",
    stage.summary,
    "",
    `Audit lens: ${stage.guidance}`,
    "",
    "### Review ratings",
    ...reviewDimensions.map((dimension) => `- ${dimension.label}: ${getRatingLabel(Number(reviewState[stage.id][dimension.id]))}`),
    "",
    ...stage.fields.flatMap((field) => [
      `### ${field.label}`,
      "",
      "Description / example:",
      field.description,
      "",
      "Testable outcomes / audit evidence:",
      field.outcomes,
      ""
    ])
  ];
}

function download(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

els.resetStage.addEventListener("click", resetActiveStage);
els.clearReview.addEventListener("click", clearReview);
els.exportMarkdown.addEventListener("click", exportMarkdown);
els.exportJson.addEventListener("click", exportJson);

render();
