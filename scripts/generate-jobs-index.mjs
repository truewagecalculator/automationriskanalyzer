import fs from "node:fs";
import path from "node:path";

const OUT_PATH = path.join(process.cwd(), "functions", "_data", "jobsIndex.js");

// Archetypes must match keys in functions/_data/templates.js
const ARCHETYPES = {
  clerical_admin: {
    base: [
      "Administrative Assistant","Executive Assistant","Receptionist","Office Manager","Office Administrator",
      "Operations Coordinator","Administrative Coordinator","Program Coordinator","Scheduling Coordinator",
      "Data Entry Clerk","Records Clerk","Clerical Assistant","Office Clerk","Document Control Specialist",
      "Front Desk Coordinator","Personal Assistant","Mailroom Clerk","File Clerk","Administrative Specialist",
      "Project Coordinator","Business Coordinator","Facilities Coordinator","Executive Coordinator"
    ],
    variants: ["","Senior ","Lead ","Assistant ","Associate "]
  },

  customer_support: {
    base: [
      "Customer Service Representative","Customer Support Specialist","Client Support Specialist","Support Specialist",
      "Technical Support Specialist","Help Desk Representative","Call Center Agent","Customer Success Associate",
      "Customer Success Specialist","Customer Success Manager","Service Desk Analyst","Support Analyst",
      "IT Help Desk Technician","Product Support Specialist","Client Services Representative","Client Relations Specialist",
      "Customer Experience Specialist","Customer Care Specialist","Account Support Specialist"
    ],
    variants: ["","Senior ","Lead ","Tier 1 ","Tier 2 ","Tier 3 "]
  },

  sales_marketing: {
    base: [
      "Sales Representative","Inside Sales Representative","Outside Sales Representative","Account Executive",
      "Account Manager","Sales Development Representative","Business Development Representative",
      "Marketing Specialist","Digital Marketing Specialist","Marketing Coordinator","Marketing Manager",
      "Social Media Manager","SEO Specialist","PPC Specialist","Email Marketing Specialist",
      "Content Marketing Specialist","Content Marketing Manager","Brand Manager","Growth Marketer",
      "Demand Generation Manager","Partnerships Manager","Sales Operations Analyst","Revenue Operations Analyst"
    ],
    variants: ["","Senior ","Lead ","Associate ","Manager ","Director of "]
  },

  software_engineering: {
    base: [
      "Software Engineer","Frontend Developer","Backend Developer","Full Stack Developer","Mobile Developer",
      "iOS Developer","Android Developer","Web Developer","QA Engineer","Test Engineer","Automation Engineer",
      "Data Engineer","Platform Engineer","DevSecOps Engineer","Machine Learning Engineer",
      "Game Developer","Unity Developer","Unreal Engine Developer","API Engineer","Integration Engineer"
    ],
    variants: ["","Junior ","Senior ","Lead ","Principal ","Staff "]
  },

  it_ops: {
    base: [
      "Systems Administrator","Network Administrator","IT Support Specialist","IT Technician","IT Analyst",
      "DevOps Engineer","Site Reliability Engineer","Cloud Engineer","Infrastructure Engineer",
      "Security Analyst","SOC Analyst","Incident Response Analyst","Identity and Access Management Specialist",
      "Network Engineer","Systems Engineer","Database Administrator","IT Operations Manager",
      "Systems Operations Analyst","Endpoint Administrator","Help Desk Technician"
    ],
    variants: ["","Senior ","Lead ","Junior ","Manager ","Director of "]
  },

  finance_accounting: {
    base: [
      "Accountant","Staff Accountant","Senior Accountant","Bookkeeper","Accounting Specialist",
      "Accounts Payable Specialist","Accounts Receivable Specialist","Payroll Specialist",
      "Financial Analyst","Senior Financial Analyst","FP&A Analyst","Finance Manager",
      "Billing Specialist","Revenue Accountant","Cost Accountant","Tax Associate","Tax Analyst",
      "Audit Associate","Internal Auditor","Controller","Treasury Analyst","Budget Analyst"
    ],
    variants: ["","Senior ","Lead ","Associate ","Manager ","Director of "]
  },

  healthcare_clinical: {
    base: [
      "Registered Nurse","Licensed Practical Nurse","Nurse Practitioner","Physician Assistant",
      "Medical Assistant","Clinical Assistant","Physical Therapist","Occupational Therapist",
      "Respiratory Therapist","Radiology Technologist","Ultrasound Technologist",
      "Pharmacy Technician","Clinical Laboratory Technician","Paramedic","EMT",
      "Dental Hygienist","Speech Language Pathologist","Behavioral Health Technician"
    ],
    variants: ["","Senior ","Lead ","Charge ","Clinical "]
  },

  education: {
    base: [
      "Teacher","Elementary School Teacher","Middle School Teacher","High School Teacher",
      "Special Education Teacher","Substitute Teacher","College Professor","Adjunct Professor",
      "Teaching Assistant","Instructional Designer","Academic Advisor","School Counselor",
      "Curriculum Specialist","Learning and Development Specialist","Corporate Trainer"
    ],
    variants: ["","Senior ","Lead ","Assistant ","Associate ","Director of "]
  },

  creative_media: {
    base: [
      "Graphic Designer","UI Designer","UX Designer","Product Designer","Motion Designer",
      "Video Editor","Content Creator","Copywriter","Content Writer","Technical Writer",
      "Social Media Producer","Creative Strategist","Art Director","Brand Designer",
      "Photographer","Videographer","Animator","Sound Designer"
    ],
    variants: ["","Senior ","Lead ","Assistant ","Associate ","Director of "]
  },

  skilled_trades: {
    base: [
      "Electrician","Plumber","HVAC Technician","Welder","Carpenter","Machinist",
      "Maintenance Technician","Industrial Maintenance Technician","Field Service Technician",
      "Automotive Technician","Diesel Mechanic","CNC Operator","Tool and Die Maker",
      "Millwright","Instrumentation Technician","Boilermaker","Painter","Roofer"
    ],
    variants: ["","Senior ","Lead ","Apprentice ","Journeyman "]
  },

  logistics_transport: {
    base: [
      "Truck Driver","Delivery Driver","Courier","Dispatcher","Logistics Coordinator",
      "Supply Chain Coordinator","Warehouse Associate","Warehouse Supervisor","Forklift Operator",
      "Inventory Specialist","Shipping and Receiving Clerk","Transportation Coordinator",
      "Fleet Manager","Route Planner","Operations Supervisor","Distribution Associate"
    ],
    variants: ["","Senior ","Lead ","Assistant ","Associate ","Manager "]
  }
};

// Some realistic “role family expansions” that increase SEO surface area
const EXTRA_COMPOUND_ROLES = [
  // Admin/ops
  ["clerical_admin", "Facilities Manager"],
  ["clerical_admin", "Procurement Coordinator"],
  ["clerical_admin", "Compliance Coordinator"],
  ["clerical_admin", "Contract Administrator"],
  ["clerical_admin", "Executive Operations Coordinator"],

  // Support
  ["customer_support", "Customer Onboarding Specialist"],
  ["customer_support", "Implementation Support Specialist"],
  ["customer_support", "Customer Support Team Lead"],
  ["customer_support", "Customer Experience Manager"],

  // Sales/marketing
  ["sales_marketing", "Performance Marketing Manager"],
  ["sales_marketing", "Lifecycle Marketing Manager"],
  ["sales_marketing", "Product Marketing Manager"],
  ["sales_marketing", "Partner Marketing Manager"],
  ["sales_marketing", "Sales Enablement Manager"],

  // Software/tech
  ["software_engineering", "Solutions Engineer"],
  ["software_engineering", "Sales Engineer"],
  ["software_engineering", "Developer Advocate"],
  ["software_engineering", "Software Architect"],
  ["software_engineering", "Technical Program Manager"],

  // IT/Ops
  ["it_ops", "Cloud Security Engineer"],
  ["it_ops", "Network Security Engineer"],
  ["it_ops", "IT Project Manager"],
  ["it_ops", "IT Service Manager"],

  // Finance
  ["finance_accounting", "Risk Analyst"],
  ["finance_accounting", "Compliance Analyst"],
  ["finance_accounting", "Financial Controller"],
  ["finance_accounting", "Accounting Manager"],

  // Healthcare
  ["healthcare_clinical", "Clinic Manager"],
  ["healthcare_clinical", "Care Coordinator"],
  ["healthcare_clinical", "Clinical Documentation Specialist"],

  // Education
  ["education", "Instructional Coach"],
  ["education", "School Principal"],
  ["education", "Assistant Principal"],

  // Creative
  ["creative_media", "Content Strategist"],
  ["creative_media", "Creative Producer"],

  // Trades
  ["skilled_trades", "Maintenance Supervisor"],
  ["skilled_trades", "Plant Maintenance Manager"],

  // Logistics
  ["logistics_transport", "Supply Chain Analyst"],
  ["logistics_transport", "Supply Chain Manager"]
];

// Normalize and uniqueness helpers
function clean(s) {
  return s.replace(/\s+/g, " ").trim();
}
function key(s) {
  return clean(s).toLowerCase();
}
function addJob(list, seen, title, template) {
  const t = clean(title);
  const k = key(t);
  if (!t || seen.has(k)) return false;
  list.push({ title: t, template });
  seen.add(k);
  return true;
}

// Generate
const jobs = [];
const seen = new Set();

// 1) add all base titles (as-is)
for (const [template, cfg] of Object.entries(ARCHETYPES)) {
  for (const title of cfg.base) addJob(jobs, seen, title, template);
}

// 2) add variants for each base title
for (const [template, cfg] of Object.entries(ARCHETYPES)) {
  for (const base of cfg.base) {
    for (const prefix of cfg.variants) {
      if (!prefix) continue;
      // Avoid weird doubles like "Assistant Administrative Assistant"
      const candidate = `${prefix}${base}`;
      addJob(jobs, seen, candidate, template);
    }
  }
}

// 3) add compound roles
for (const [template, title] of EXTRA_COMPOUND_ROLES) {
  addJob(jobs, seen, title, template);
}

// 4) If still not enough, generate realistic “Specialist/Coordinator/Analyst” expansions per archetype
const GENERIC_SUFFIXES = {
  clerical_admin: ["Coordinator","Specialist","Administrator","Assistant","Clerk"],
  customer_support: ["Specialist","Representative","Analyst","Team Lead","Manager"],
  sales_marketing: ["Specialist","Coordinator","Manager","Analyst","Strategist"],
  software_engineering: ["Engineer","Developer","Architect","Specialist"],
  it_ops: ["Engineer","Administrator","Analyst","Manager","Specialist"],
  finance_accounting: ["Analyst","Specialist","Manager","Associate"],
  healthcare_clinical: ["Technician","Specialist","Coordinator","Manager"],
  education: ["Coordinator","Specialist","Director","Advisor"],
  creative_media: ["Designer","Editor","Producer","Strategist"],
  skilled_trades: ["Technician","Mechanic","Operator","Supervisor"],
  logistics_transport: ["Coordinator","Planner","Supervisor","Manager","Specialist"]
};

const GENERIC_PREFIXES = ["Senior","Lead","Assistant","Associate","Principal","Junior"];

for (const [template, cfg] of Object.entries(ARCHETYPES)) {
  const roots = cfg.base
    .map(t => t.split(" ")[0]) // simple root from first word
    .filter(Boolean);

  for (const root of roots) {
    for (const suf of (GENERIC_SUFFIXES[template] || [])) {
      addJob(jobs, seen, `${root} ${suf}`, template);
      for (const pre of GENERIC_PREFIXES) {
        addJob(jobs, seen, `${pre} ${root} ${suf}`, template);
      }
      if (jobs.length >= 650) break;
    }
    if (jobs.length >= 650) break;
  }
}

// Now enforce EXACTLY 500 jobs
// Prefer variety across archetypes: interleave by template
const byTemplate = new Map();
for (const j of jobs) {
  if (!byTemplate.has(j.template)) byTemplate.set(j.template, []);
  byTemplate.get(j.template).push(j);
}

// round-robin pick
const templates = Object.keys(ARCHETYPES);
const final = [];
const finalSeen = new Set();
let i = 0;

while (final.length < 500) {
  const tpl = templates[i % templates.length];
  const arr = byTemplate.get(tpl) || [];
  const next = arr.shift();
  if (next) {
    const k = key(next.title);
    if (!finalSeen.has(k)) {
      final.push(next);
      finalSeen.add(k);
    }
  }
  i++;
  // Safety: if we somehow run out (shouldn't), break.
  if (i > 200000) break;
}

if (final.length < 500) {
  console.error(`Only generated ${final.length} unique jobs. Increase seeds/variants.`);
  process.exit(1);
}

// Optional aliases (keep small)
const JOB_ALIASES = {
  "developer": "Software Engineer",
  "programmer": "Software Engineer",
  "helpdesk": "IT Support Specialist",
  "call centre agent": "Call Center Agent",
  "truckdriver": "Truck Driver",
  "book keeper": "Bookkeeper",
  "social media": "Social Media Manager",
  "ux": "UX Designer"
};

const output = `// AUTO-GENERATED by scripts/generate-jobs-index.mjs
// Total jobs: ${final.length}

export const JOB_INDEX = ${JSON.stringify(final, null, 2)};

export const JOB_ALIASES = ${JSON.stringify(JOB_ALIASES, null, 2)};
`;

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, output, "utf8");

console.log(`✅ Wrote ${final.length} jobs to ${OUT_PATH}`);
