const stages = [
  {
    id: "design",
    title: "Design and Objectives",
    purpose: "Define what the model is supposed to do, where it may be used, where it must not be used, and why the use case is justified.",
    auditWhy: "Auditors need a precise approved use before they can test scope, misuse, accountability, and whether model behavior aligns with the business purpose.",
    evidence: ["Approved business case", "Model inventory entry", "Use-case approval memo", "Prohibited-use policy", "Production product-code logs"],
    redFlags: ["Purpose is vague", "Prohibited uses are missing", "No owner approved the use case", "Model is described as generally useful without scope boundaries"],
    attributes: [
      {
        name: "Purpose and Strategic Alignment",
        definition: "The business reason the model exists and how it connects to approved strategy, risk appetite, and policy.",
        example: "Supports consumer personal-loan underwriting by estimating default risk and routing applications to approve, decline, or manual review.",
        auditQuestion: "Can the business purpose be traced to an approved use case and risk committee materials?"
      },
      {
        name: "Intended Use and Misuse Guidance",
        definition: "The allowed and prohibited uses of the model.",
        example: "Approved for consumer personal loans; not approved for mortgage underwriting, collections, marketing, employment, or insurance decisions.",
        auditQuestion: "Can production logs prove the model is used only for approved products and workflows?"
      },
      {
        name: "Model Type and Architecture",
        definition: "The model family, major design choices, inputs, outputs, thresholds, and decision role.",
        example: "Gradient-boosted decision tree model producing calibrated default probability and reason codes.",
        auditQuestion: "Does the deployed model artifact match the documented architecture, feature list, and version hash?"
      },
      {
        name: "Ethical Design Considerations",
        definition: "Design constraints intended to reduce foreseeable harm, unfairness, opacity, privacy risk, or misuse.",
        example: "Protected attributes are excluded; proxy features require justification; edge cases route to human review.",
        auditQuestion: "Were fairness, privacy, explainability, and human oversight requirements defined before deployment?"
      }
    ],
    quiz: {
      question: "Which evidence best supports the claim that a loan model is used only for approved personal-loan products?",
      options: [
        { text: "Production logs showing scored product codes", correct: true, feedback: "Correct. Scope claims should be tested against actual production use." },
        { text: "A chart showing model AUC", correct: false, feedback: "AUC tests predictive performance, not whether the model is used only in approved contexts." },
        { text: "A training hyperparameter log", correct: false, feedback: "Training settings do not prove production use is within approved scope." },
        { text: "An API latency dashboard", correct: false, feedback: "Latency is operational evidence, but it does not prove intended-use compliance." }
      ]
    }
  },
  {
    id: "development",
    title: "Development and Training",
    purpose: "Document how the model was built, what data and labels were used, and what mitigations were applied during development.",
    auditWhy: "Auditors need development evidence to trace the model from source data to final artifact and understand where error, bias, or leakage could enter.",
    evidence: ["Training pipeline logs", "Data dictionary", "Data lineage diagram", "Data-quality report", "Label-generation script", "Proxy review"],
    redFlags: ["Training data date range is missing", "Labels are not traceable", "Feature exclusions are undocumented", "No challenger model or baseline comparison"],
    attributes: [
      {
        name: "Algorithm Specifics",
        definition: "The algorithm, training setup, hyperparameters, software environment, and reproducibility controls.",
        example: "Gradient-boosted tree model with regularization, maximum-depth limits, learning-rate tuning, and monotonic constraints.",
        auditQuestion: "Can the training process be re-executed and reproduce metrics within tolerance?"
      },
      {
        name: "Data Used to Train the Model",
        definition: "The sources, date ranges, exclusions, preprocessing, transformations, and limitations of training data.",
        example: "Five years of internal personal-loan applications, repayment performance, credit-bureau variables, and macroeconomic indicators.",
        auditQuestion: "Can a sample of model records be traced back to source systems?"
      },
      {
        name: "Labeling Sources and Quality",
        definition: "How the target outcome was defined, generated, reconciled, and quality checked.",
        example: "Default within 12 months generated from servicing and collections systems.",
        auditQuestion: "Are timing windows, charge-off codes, and reconciliation results documented?"
      },
      {
        name: "Fairness and Bias Mitigations",
        definition: "Steps taken during development to reduce unfairness or proxy discrimination.",
        example: "Protected-attribute exclusion, proxy review, subgroup tests, threshold sensitivity analysis, and manual review for thin-file cases.",
        auditQuestion: "Do mitigation decisions connect to measured subgroup performance and legitimate business need?"
      }
    ],
    quiz: {
      question: "A model card says, 'The model was trained on recent historical loan data.' What is the biggest audit weakness?",
      options: [
        { text: "It does not identify source systems, date range, exclusions, preprocessing, or quality results.", correct: true, feedback: "Correct. Training-data claims need traceable detail, not broad descriptions." },
        { text: "It uses the word historical.", correct: false, feedback: "Historical data can be appropriate. The issue is the lack of lineage and quality detail." },
        { text: "It does not mention API latency.", correct: false, feedback: "API latency belongs to deployment operations, not training-data documentation." },
        { text: "It does not name the audit committee.", correct: false, feedback: "Governance owners matter, but this specific weakness is missing data lineage detail." }
      ]
    }
  },
  {
    id: "evaluation",
    title: "Evaluation and Testing",
    purpose: "Show whether model claims are supported by validation, fairness, robustness, explanation, and limitation evidence.",
    auditWhy: "Evaluation is where model-card claims become testable. Auditors look for acceptance criteria, subgroup results, limitations, and evidence that the right tests were performed.",
    evidence: ["Validation report", "Holdout and out-of-time results", "Subgroup performance table", "Fairness analysis", "Robustness tests", "Reason-code fidelity sample"],
    redFlags: ["Only overall accuracy is reported", "No subgroup testing", "No acceptance threshold", "Limitations are absent or generic"],
    attributes: [
      {
        name: "Known Limitations and Biases",
        definition: "The conditions, populations, data gaps, or scenarios where model performance is weaker or less certain.",
        example: "Less reliable for thin-file applicants, unusual income patterns, recent identity changes, or regions outside the bank's footprint.",
        auditQuestion: "Are limitations reflected in user guidance, manual review rules, and monitoring?"
      },
      {
        name: "Technical Performance",
        definition: "Predictive quality, calibration, error rates, robustness, and threshold behavior.",
        example: "AUC = 0.84, KS = 0.43, calibration slope = 0.98, out-of-time AUC within 0.03 of holdout.",
        auditQuestion: "Are metrics tied to acceptance criteria and business decision thresholds?"
      },
      {
        name: "Ethical Performance",
        definition: "Fairness, explanation quality, truthfulness of reason codes, and harm-related performance measures.",
        example: "Disparate-impact ratios at or above 0.90 and reason codes match local explanations in 95% of sampled declines.",
        auditQuestion: "Do fairness and explanation results cover affected groups and high-impact decisions?"
      },
      {
        name: "Data Used to Test the Model",
        definition: "The holdout, out-of-time, shadow, or production samples used for validation.",
        example: "A separated holdout sample, recent out-of-time sample, and production shadow-test sample.",
        auditQuestion: "Is there proof that test data is separate from training data and representative of deployment?"
      }
    ],
    quiz: {
      question: "Which test best evaluates whether adverse-action reason codes are truthful?",
      options: [
        { text: "Compare reason codes to local explanation drivers for declined applications", correct: true, feedback: "Correct. Reason-code fidelity should be tested against the actual drivers of the recommendation." },
        { text: "Calculate average API response time", correct: false, feedback: "API latency does not test whether explanations are accurate." },
        { text: "Review the business case", correct: false, feedback: "The business case may justify the model, but it does not validate explanation fidelity." },
        { text: "Count the total number of approved applications", correct: false, feedback: "Volume does not show whether adverse-action reasons are truthful." }
      ]
    }
  },
  {
    id: "deployment",
    title: "Deployment",
    purpose: "Describe how the model is used in production, what systems call it, what inputs it receives, and how users interact with the output.",
    auditWhy: "A model can be well developed but poorly deployed. Auditors test whether real-world use, access, fallback, and user instructions match the approved design.",
    evidence: ["Change ticket", "User acceptance testing", "API logs", "Input schema", "Access-control review", "Underwriter guidance"],
    redFlags: ["No deployment approval", "No endpoint versioning", "Fallback process is unclear", "Users are not trained on model limitations"],
    attributes: [
      {
        name: "Real-World Input Characteristics",
        definition: "The production inputs, validation rules, missing-value handling, and input quality controls.",
        example: "Application data, income, employment status, debt obligations, credit-bureau attributes, loan amount, purpose, and derived ratios.",
        auditQuestion: "Do production inputs match the documented schema and expected ranges?"
      },
      {
        name: "Operational Context",
        definition: "Where the model sits in the workflow and how its recommendation affects decisions.",
        example: "Embedded in the loan-origination platform as an underwriting decision-support tool.",
        auditQuestion: "Can decisions be traced from application intake to score, recommendation, review, and final decision?"
      },
      {
        name: "Interface and API Constraints",
        definition: "Technical controls around system calls, endpoint versions, validation, logging, latency, and fallback.",
        example: "Secure API with authenticated calls, versioned endpoints, schema validation, response logging, and manual-review fallback.",
        auditQuestion: "Can only approved systems and service accounts call the model endpoint?"
      },
      {
        name: "User Instructions",
        definition: "Instructions for interpreting scores, handling exceptions, documenting overrides, and communicating decisions.",
        example: "Underwriters are trained on score interpretation, manual review triggers, override documentation, and reason-code communication.",
        auditQuestion: "Do active users have current training and complete override justifications?"
      }
    ],
    quiz: {
      question: "Which evidence best supports an end-to-end deployment trace?",
      options: [
        { text: "A sample linking application intake, model score, recommendation, human review status, and final decision", correct: true, feedback: "Correct. Deployment auditability depends on tracing the real production decision path." },
        { text: "A list of training features only", correct: false, feedback: "Feature lists help, but deployment traceability needs production workflow evidence." },
        { text: "A high-level AI strategy slide", correct: false, feedback: "Strategy does not prove production traceability." },
        { text: "A fairness literature review", correct: false, feedback: "Fairness literature is useful background, not deployment evidence." }
      ]
    }
  },
  {
    id: "monitoring",
    title: "Monitoring and Maintenance",
    purpose: "Define how the organization detects drift, misuse, performance degradation, incidents, and needed model changes after deployment.",
    auditWhy: "AI systems change in production because data, users, policies, and environments change. Auditors need monitoring evidence and escalation paths.",
    evidence: ["Monitoring dashboard", "PSI reports", "Alert thresholds", "Incident tickets", "Override monitoring", "Committee minutes"],
    redFlags: ["Monitoring exists but no one reviews it", "Alert thresholds are undefined", "No ticket trail for exceptions", "Out-of-scope use is not monitored"],
    attributes: [
      {
        name: "Ensuring Intended Use",
        definition: "Controls that confirm the model remains inside approved products, users, thresholds, and workflows.",
        example: "Monthly use report compares production calls against approved product codes and user groups.",
        auditQuestion: "Do out-of-scope calls trigger documented investigation?"
      },
      {
        name: "Drift Detection",
        definition: "Monitoring that compares current inputs, scores, outcomes, and calibration to validation baselines.",
        example: "Weekly PSI reports for critical features and model score; PSI >= 0.20 triggers formal investigation.",
        auditQuestion: "Are drift thresholds defined before alerts occur?"
      },
      {
        name: "Operational Responsibility",
        definition: "Named ownership for performance, validation, compliance, IT operations, incidents, and business decisions.",
        example: "Credit Risk Analytics owns performance; Model Risk Management owns validation; Compliance owns fair-lending oversight.",
        auditQuestion: "Do meeting minutes show issues, owners, due dates, and closure evidence?"
      },
      {
        name: "Preventing Misuse and Supporting Transparency",
        definition: "Access, product-scope, override, threshold-change, and explanation controls that keep the model auditable.",
        example: "Role-based access, threshold-change approvals, override monitoring, reason-code retention, and reproducible decision records.",
        auditQuestion: "Can declined applications reproduce score, reason codes, model version, and decision path?"
      }
    ],
    quiz: {
      question: "A monitoring dashboard exists, but no one reviews alerts or opens tickets. How should an auditor treat the monitoring claim?",
      options: [
        { text: "Weak, because monitoring without review and escalation is not an effective control", correct: true, feedback: "Correct. A dashboard alone is not enough; monitoring needs ownership, thresholds, review, and remediation." },
        { text: "Strong, because any dashboard proves monitoring", correct: false, feedback: "A dashboard is only evidence of data display, not control effectiveness." },
        { text: "Not relevant to model cards", correct: false, feedback: "Monitoring is a core model-card lifecycle stage." },
        { text: "Supported if the model had good AUC at launch", correct: false, feedback: "Launch performance does not replace ongoing monitoring." }
      ]
    }
  },
  {
    id: "governance",
    title: "Governance and Accountability",
    purpose: "Name accountable owners, document approvals, identify legal constraints, and show where supporting documentation lives.",
    auditWhy: "Governance turns model documentation into accountability. Auditors need named owners, current approvals, and accessible evidence.",
    evidence: ["Model registry", "RACI matrix", "Validation sign-off", "Compliance review", "Approval memo", "Documentation inventory"],
    redFlags: ["Owners are roles but not named people", "Version history is incomplete", "Legal constraints are generic", "Auditors cannot access required documentation"],
    attributes: [
      {
        name: "Version and Update History",
        definition: "The record of versions, training windows, validation dates, deployment dates, thresholds, and changes.",
        example: "Registry shows v1.0 trained January 2025, validated February 2025, and deployed March 2025.",
        auditQuestion: "Do updates include change tickets, validation reports, approvals, and deployment checksums?"
      },
      {
        name: "Responsible Teams or Contacts",
        definition: "Named business, technical, validation, compliance, IT, and executive owners.",
        example: "Business owner, model owner, validator, compliance owner, IT owner, and executive sponsor are listed in the model inventory.",
        auditQuestion: "Are owners current, active, and aware of their responsibilities?"
      },
      {
        name: "Legal and Regulatory Constraints",
        definition: "The laws, regulations, policies, and contractual constraints that shape model use and evidence needs.",
        example: "ECOA/Regulation B, FCRA, state lending laws, privacy policy, model-risk policy, and records-retention requirements.",
        auditQuestion: "Are legal constraints mapped to specific controls and tests?"
      },
      {
        name: "Documentation Availability",
        definition: "The complete set of model documents, evidence, approvals, and monitoring records needed for review.",
        example: "Model card, business case, data dictionary, feature list, training log, validation report, fairness analysis, monitoring plan, user guide, change records, and decommissioning plan.",
        auditQuestion: "Can an auditor retrieve current evidence from the registry or governance repository?"
      }
    ],
    quiz: {
      question: "Which is the strongest governance evidence?",
      options: [
        { text: "A model registry with named owners, version history, approvals, validation dates, and links to documents", correct: true, feedback: "Correct. Governance evidence should connect ownership, approvals, versioning, and documentation." },
        { text: "A statement that the data science team owns the model", correct: false, feedback: "A team-level statement is weak without named accountability and current evidence." },
        { text: "A high AUC score", correct: false, feedback: "Performance is not governance evidence." },
        { text: "A vendor marketing brochure", correct: false, feedback: "Marketing material is not a governance control record." }
      ]
    }
  },
  {
    id: "discontinuation",
    title: "Model Discontinuation",
    purpose: "Plan how the model will be retired, archived, replaced, and communicated when it is no longer appropriate for use.",
    auditWhy: "AI accountability does not end at shutdown. Auditors need evidence that historical decisions can be reproduced and that risky models can be retired safely.",
    evidence: ["Retirement criteria", "Sunset checklist", "Successor model plan", "Rollback plan", "Archive policy", "Stakeholder communication plan"],
    redFlags: ["No retirement triggers", "No archive plan", "Endpoint shutdown is not tested", "Historical decisions cannot be reproduced"],
    attributes: [
      {
        name: "Conditions for Retirement",
        definition: "The events that trigger remediation, replacement, or retirement.",
        example: "Sustained degradation, unresolved fairness concern, regulatory change, data-source change, replacement model, discontinued product, or unmitigated platform risk.",
        auditQuestion: "Are retirement triggers tied to monitoring thresholds and governance decisions?"
      },
      {
        name: "Model Sunsetting Plans",
        definition: "The controlled transition plan to retire or replace the model without unmanaged business disruption.",
        example: "Successor readiness, parallel testing, rollback plan, user training, compliance approval, and cutover evidence.",
        auditQuestion: "Can the organization keep operating safely if the model is withdrawn?"
      },
      {
        name: "Discontinuance and Archival",
        definition: "How the model is disabled and how artifacts, logs, data snapshots, and decision records are preserved.",
        example: "Final artifact, code, training snapshot, validation report, monitoring history, decision logs, and reason-code mappings are archived.",
        auditQuestion: "Can historical decisions be reproduced after model retirement?"
      },
      {
        name: "Stakeholder Communication",
        definition: "How affected internal and external stakeholders are notified about retirement or replacement.",
        example: "Underwriters, risk leadership, compliance, internal audit, technology, regulators where applicable, and affected business units receive communication.",
        auditQuestion: "Is there evidence that users acknowledged new procedures before cutover?"
      }
    ],
    quiz: {
      question: "Why does a model card need discontinuation planning?",
      options: [
        { text: "Because auditors may need to reproduce historical decisions after the model is retired", correct: true, feedback: "Correct. Retirement does not erase accountability for past automated decisions." },
        { text: "Because retired models always perform better", correct: false, feedback: "Retirement is about risk control, transition, and accountability, not better performance." },
        { text: "Because discontinuation replaces validation", correct: false, feedback: "Validation and discontinuation address different lifecycle needs." },
        { text: "Because users should never replace models", correct: false, feedback: "Models can be replaced, but the transition must be controlled and auditable." }
      ]
    }
  }
];

const state = {
  activeStage: stages[0].id,
  completedStages: new Set(),
  quizAnswers: {}
};

const els = {
  stageButtons: document.querySelector("#stage-buttons"),
  stageKicker: document.querySelector("#stage-kicker"),
  stageTitle: document.querySelector("#stage-title"),
  stagePurpose: document.querySelector("#stage-purpose"),
  auditWhy: document.querySelector("#stage-audit-why"),
  evidence: document.querySelector("#stage-evidence"),
  redFlags: document.querySelector("#stage-red-flags"),
  attributeList: document.querySelector("#attribute-list"),
  question: document.querySelector("#quick-check-question"),
  options: document.querySelector("#quick-check-options"),
  feedback: document.querySelector("#quick-check-feedback"),
  markComplete: document.querySelector("#mark-complete"),
  progressCount: document.querySelector("#progress-count"),
  progressBar: document.querySelector("#progress-bar"),
  stagesComplete: document.querySelector("#stages-complete"),
  checksCorrect: document.querySelector("#checks-correct"),
  focusArea: document.querySelector("#focus-area"),
  nextGuidance: document.querySelector("#next-guidance")
};

function activeStage() {
  return stages.find((stage) => stage.id === state.activeStage);
}

function render() {
  renderStageNav();
  renderStage();
  renderQuiz();
  renderSummary();
}

function renderStageNav() {
  els.stageButtons.innerHTML = stages.map((stage, index) => {
    const complete = state.completedStages.has(stage.id);
    const answered = state.quizAnswers[stage.id];
    const current = stage.id === state.activeStage ? ` aria-current="page"` : "";
    return `
      <button class="stage-button" type="button" data-stage="${stage.id}"${current}>
        <span class="stage-index" aria-hidden="true">${index + 1}.</span>
        <span class="stage-label">${escapeHtml(stage.title)}</span>
        <small>${complete ? "Complete" : answered ? "Check answered" : "Not started"}</small>
      </button>
    `;
  }).join("");

  els.stageButtons.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeStage = button.dataset.stage;
      render();
    });
  });
}

function renderStage() {
  const stage = activeStage();
  const index = stages.findIndex((item) => item.id === stage.id) + 1;
  els.stageKicker.textContent = `Stage ${index} of ${stages.length}`;
  els.stageTitle.textContent = stage.title;
  els.stagePurpose.textContent = stage.purpose;
  els.auditWhy.textContent = stage.auditWhy;
  els.evidence.innerHTML = listItems(stage.evidence);
  els.redFlags.innerHTML = listItems(stage.redFlags);
  els.attributeList.innerHTML = stage.attributes.map(renderAttribute).join("");
  els.markComplete.textContent = state.completedStages.has(stage.id) ? "Stage complete" : "Mark stage complete";
}

function renderAttribute(attribute) {
  return `
    <article class="attribute-card">
      <h4>${escapeHtml(attribute.name)}</h4>
      <p><strong>Definition:</strong> ${escapeHtml(attribute.definition)}</p>
      <p><strong>Loan model example:</strong> ${escapeHtml(attribute.example)}</p>
      <p><strong>Audit question:</strong> ${escapeHtml(attribute.auditQuestion)}</p>
    </article>
  `;
}

function renderQuiz() {
  const stage = activeStage();
  const answer = state.quizAnswers[stage.id];
  els.question.textContent = stage.quiz.question;
  els.options.innerHTML = stage.quiz.options.map((option, index) => {
    const selected = answer?.index === index;
    const resultClass = selected ? (option.correct ? " is-correct" : " is-incorrect") : "";
    return `
      <button class="quick-check-option${resultClass}" type="button" data-option="${index}">
        ${escapeHtml(option.text)}
      </button>
    `;
  }).join("");

  els.options.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      const optionIndex = Number(button.dataset.option);
      state.quizAnswers[stage.id] = {
        index: optionIndex,
        correct: stage.quiz.options[optionIndex].correct
      };
      renderQuiz();
      renderSummary();
      renderStageNav();
    });
  });

  if (!answer) {
    els.feedback.hidden = true;
    els.feedback.textContent = "";
    return;
  }

  const selectedOption = stage.quiz.options[answer.index];
  els.feedback.hidden = false;
  els.feedback.className = `quick-check-feedback ${selectedOption.correct ? "is-correct" : "is-incorrect"}`;
  els.feedback.textContent = selectedOption.feedback;
}

function renderSummary() {
  const complete = state.completedStages.size;
  const correct = Object.values(state.quizAnswers).filter((answer) => answer.correct).length;
  const percent = Math.round((complete / stages.length) * 100);
  els.progressCount.textContent = `${complete} of ${stages.length} stages`;
  els.progressBar.style.width = `${percent}%`;
  els.stagesComplete.textContent = String(complete);
  els.checksCorrect.textContent = String(correct);
  els.focusArea.textContent = activeStage().title.split(" ")[0];
  els.nextGuidance.textContent = getNextGuidance(complete, correct);
}

function getNextGuidance(complete, correct) {
  if (complete === stages.length && correct === stages.length) {
    return "You have completed the learning path. Next, practice applying these principles in the AI Audit Lab.";
  }
  if (complete === stages.length) {
    return "All stages are marked complete. Revisit any missed quick checks to strengthen your audit judgment.";
  }
  return "Work through each stage, inspect the attributes, answer the quick check, and mark the stage complete when the concepts are clear.";
}

function markComplete() {
  state.completedStages.add(state.activeStage);
  render();
}

function listItems(items) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

els.markComplete.addEventListener("click", markComplete);
render();
