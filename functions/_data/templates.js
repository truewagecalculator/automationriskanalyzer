export const TEMPLATES = {
  "clerical_admin": {
    label: "Clerical & Admin",
    tasks: [
      { name: "Data entry, form filling, record updates", likelihood: 88 },
      { name: "Scheduling, inbox triage, simple coordination", likelihood: 72 },
      { name: "Document formatting, template-based writing", likelihood: 76 },
      { name: "Basic reporting and summaries", likelihood: 70 },
      { name: "Invoice/receipt matching and filing", likelihood: 84 }
    ],
    protectiveSkills: [
      "Cross-team coordination & prioritization",
      "Exception handling & judgment calls",
      "Process improvement & workflow design",
      "Stakeholder communication",
      "Tooling oversight (automation QA)"
    ],
    factors: {
      repetitive: 0.80,
      ruleBased: 0.75,
      dataHeavy: 0.70,
      humanJudgment: 0.35,
      emotionalLabor: 0.35
    }
  },

  "customer_support": {
    label: "Customer Support",
    tasks: [
      { name: "FAQ responses and first-line troubleshooting", likelihood: 82 },
      { name: "Ticket classification and routing", likelihood: 86 },
      { name: "Refund policy checks and standard resolutions", likelihood: 70 },
      { name: "Chat/email response drafting", likelihood: 78 },
      { name: "Knowledge base search & suggestions", likelihood: 80 }
    ],
    protectiveSkills: [
      "De-escalation & empathy under stress",
      "Complex case investigation",
      "Account-level relationship management",
      "Product expertise & root-cause analysis",
      "Process design for support operations"
    ],
    factors: {
      repetitive: 0.70,
      ruleBased: 0.65,
      dataHeavy: 0.55,
      humanJudgment: 0.55,
      emotionalLabor: 0.75
    }
  },

  "sales_marketing": {
    label: "Sales & Marketing",
    tasks: [
      { name: "Lead scoring and outbound personalization drafts", likelihood: 75 },
      { name: "Ad copy variations and creative iteration", likelihood: 70 },
      { name: "CRM updates and pipeline hygiene", likelihood: 80 },
      { name: "Basic competitor and keyword research", likelihood: 72 },
      { name: "Proposal/slide first drafts", likelihood: 68 }
    ],
    protectiveSkills: [
      "Negotiation and relationship building",
      "Account strategy & enterprise selling",
      "Creative direction & brand judgment",
      "Market positioning decisions",
      "Cross-functional leadership"
    ],
    factors: {
      repetitive: 0.55,
      ruleBased: 0.50,
      dataHeavy: 0.55,
      humanJudgment: 0.70,
      emotionalLabor: 0.60
    }
  },

  "software_engineering": {
    label: "Software Engineering",
    tasks: [
      { name: "Boilerplate code generation", likelihood: 70 },
      { name: "Unit tests and simple refactors", likelihood: 65 },
      { name: "Documentation and comments", likelihood: 78 },
      { name: "Bug triage & straightforward fixes", likelihood: 55 },
      { name: "Code review suggestions", likelihood: 60 }
    ],
    protectiveSkills: [
      "System design & architecture",
      "Security engineering & threat modeling",
      "Debugging complex distributed systems",
      "Product judgment & tradeoffs",
      "Team leadership & alignment"
    ],
    factors: {
      repetitive: 0.45,
      ruleBased: 0.40,
      dataHeavy: 0.50,
      humanJudgment: 0.75,
      emotionalLabor: 0.35
    }
  },

  "it_ops": {
    label: "IT & Operations",
    tasks: [
      { name: "Log analysis and alert triage", likelihood: 68 },
      { name: "Runbook-driven incident response steps", likelihood: 60 },
      { name: "Asset inventory updates & ticketing", likelihood: 80 },
      { name: "Patch compliance reporting", likelihood: 70 },
      { name: "Standard access provisioning", likelihood: 72 }
    ],
    protectiveSkills: [
      "Incident command & stakeholder comms",
      "Deep troubleshooting across systems",
      "Security response & risk decisions",
      "Automation design & guardrails",
      "Architecture & resilience planning"
    ],
    factors: {
      repetitive: 0.55,
      ruleBased: 0.55,
      dataHeavy: 0.60,
      humanJudgment: 0.70,
      emotionalLabor: 0.45
    }
  },

  "finance_accounting": {
    label: "Finance & Accounting",
    tasks: [
      { name: "Expense reconciliation & categorization", likelihood: 85 },
      { name: "Invoice processing and matching", likelihood: 88 },
      { name: "Routine reporting & dashboards", likelihood: 75 },
      { name: "Basic tax preparation steps", likelihood: 65 },
      { name: "Transaction monitoring rules", likelihood: 70 }
    ],
    protectiveSkills: [
      "Regulatory interpretation & compliance judgment",
      "Audit strategy & risk management",
      "Advisory & planning",
      "Cross-functional communication",
      "Controls design & AI oversight"
    ],
    factors: {
      repetitive: 0.75,
      ruleBased: 0.70,
      dataHeavy: 0.80,
      humanJudgment: 0.45,
      emotionalLabor: 0.25
    }
  },

  "healthcare_clinical": {
    label: "Healthcare (Clinical)",
    tasks: [
      { name: "Documentation drafts & coding suggestions", likelihood: 55 },
      { name: "Decision support prompts (assistive)", likelihood: 45 },
      { name: "Scheduling and patient reminders", likelihood: 70 },
      { name: "Triage support (non-final)", likelihood: 40 },
      { name: "Medical scribing assistance", likelihood: 60 }
    ],
    protectiveSkills: [
      "Clinical judgment & accountability",
      "Patient communication & empathy",
      "Complex case synthesis",
      "Ethics & safety decision-making",
      "Hands-on procedures"
    ],
    factors: {
      repetitive: 0.35,
      ruleBased: 0.35,
      dataHeavy: 0.50,
      humanJudgment: 0.85,
      emotionalLabor: 0.85
    }
  },

  "education": {
    label: "Education",
    tasks: [
      { name: "Lesson plan drafts and worksheets", likelihood: 75 },
      { name: "Grading assistance for objective work", likelihood: 70 },
      { name: "Content summarization & quiz generation", likelihood: 78 },
      { name: "Parent/student email drafts", likelihood: 72 },
      { name: "Administrative reporting", likelihood: 65 }
    ],
    protectiveSkills: [
      "Classroom leadership & motivation",
      "Social/emotional learning support",
      "Student-specific adaptation",
      "Mentoring & behavior management",
      "Curriculum judgment"
    ],
    factors: {
      repetitive: 0.45,
      ruleBased: 0.45,
      dataHeavy: 0.50,
      humanJudgment: 0.80,
      emotionalLabor: 0.85
    }
  },

  "creative_media": {
    label: "Creative & Media",
    tasks: [
      { name: "First-draft copy and ideation", likelihood: 78 },
      { name: "Basic image/video edits & variations", likelihood: 65 },
      { name: "Thumbnail/ad creative variations", likelihood: 70 },
      { name: "SEO outlines and scripting support", likelihood: 75 },
      { name: "Asset tagging and organization", likelihood: 72 }
    ],
    protectiveSkills: [
      "Creative direction & taste",
      "Brand consistency judgment",
      "Narrative structure & audience insight",
      "Client management",
      "High-level concepting"
    ],
    factors: {
      repetitive: 0.50,
      ruleBased: 0.40,
      dataHeavy: 0.55,
      humanJudgment: 0.75,
      emotionalLabor: 0.45
    }
  },

  "skilled_trades": {
    label: "Skilled Trades",
    tasks: [
      { name: "Estimating and scheduling assistance", likelihood: 55 },
      { name: "Procurement and inventory suggestions", likelihood: 60 },
      { name: "Inspection checklist guidance", likelihood: 50 },
      { name: "Documentation and compliance logs", likelihood: 65 },
      { name: "Predictive maintenance recommendations", likelihood: 55 }
    ],
    protectiveSkills: [
      "Hands-on work in varied environments",
      "Safety judgment in real time",
      "Complex troubleshooting",
      "Client communication onsite",
      "Certification & code expertise"
    ],
    factors: {
      repetitive: 0.35,
      ruleBased: 0.45,
      dataHeavy: 0.35,
      humanJudgment: 0.80,
      emotionalLabor: 0.35
    }
  },

  "logistics_transport": {
    label: "Logistics & Transport",
    tasks: [
      { name: "Route optimization & dispatching", likelihood: 80 },
      { name: "Proof-of-delivery capture & reporting", likelihood: 85 },
      { name: "Predictable-route driving assistance", likelihood: 75 },
      { name: "Fleet monitoring & telematics review", likelihood: 70 },
      { name: "Scheduling and capacity planning", likelihood: 72 }
    ],
    protectiveSkills: [
      "Exception handling & last-mile complexity",
      "Safety judgment under uncertainty",
      "Customer interaction & problem solving",
      "Special certifications (hazmat, etc.)",
      "Vehicle/ops troubleshooting"
    ],
    factors: {
      repetitive: 0.65,
      ruleBased: 0.55,
      dataHeavy: 0.45,
      humanJudgment: 0.60,
      emotionalLabor: 0.30
    }
  }
};
