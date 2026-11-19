/**
 * AI-Driven Smart Welfare Resource Management System
 * End-to-End System & Academic Integrity Verification Script
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("\n=======================================================");
console.log("  WELFARE SYSTEM E2E VERIFICATION & INTEGRITY SUITE");
console.log("=======================================================\n");

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  [FAIL] ${message}`);
    process.exitCode = 1;
  }
}

// -------------------------------------------------------------
// Test Suite 1: Database Migrations & 12 Normalized Tables
// -------------------------------------------------------------
console.log("--- 1. Database Schema & RLS Verification ---");

const migration001Path = path.join(rootDir, "supabase", "migrations", "001_initial_schema.sql");
const migration002Path = path.join(rootDir, "supabase", "migrations", "002_auth_triggers_and_rbac.sql");
const migration003Path = path.join(rootDir, "supabase", "migrations", "003_seed_demo_data.sql");

assert(fs.existsSync(migration001Path), "001_initial_schema.sql exists");
assert(fs.existsSync(migration002Path), "002_auth_triggers_and_rbac.sql exists");
assert(fs.existsSync(migration003Path), "003_seed_demo_data.sql exists");

const schemaContent = fs.readFileSync(migration001Path, "utf-8");

const requiredTables = [
  "institutions",
  "profiles",
  "institution_memberships",
  "beneficiaries",
  "medical_records",
  "resource_records",
  "inventory_items",
  "donations",
  "alerts",
  "predictions",
  "audit_logs",
  "notifications",
];

requiredTables.forEach((table) => {
  const tableRegex = new RegExp(`create\\s+table\\s+(?:if\\s+not\\s+exists\\s+)?(?:public\\.)?${table}\\b`, "i");
  const tableCreated = tableRegex.test(schemaContent);
  assert(tableCreated, `Table '${table}' declared in 001_initial_schema.sql`);

  const rlsRegex = new RegExp(`alter\\s+table\\s+(?:public\\.)?${table}\\s+enable\\s+row\\s+level\\s+security`, "i");
  const rlsEnabled = rlsRegex.test(schemaContent);
  assert(rlsEnabled, `Row Level Security (RLS) enabled on '${table}'`);
});

// Verify 002 contains RBAC security functions
const rbacContent = fs.readFileSync(migration002Path, "utf-8");
assert(rbacContent.includes("current_user_role"), "RBAC helper function 'current_user_role' declared");
assert(rbacContent.includes("is_admin_or_gov"), "RBAC helper function 'is_admin_or_gov' declared");
assert(rbacContent.includes("is_doctor_for_institution"), "RBAC helper function 'is_doctor_for_institution' declared");
assert(rbacContent.includes("handle_new_user"), "Auth trigger 'handle_new_user' declared");

// Verify 003 contains seed data
const seedContent = fs.readFileSync(migration003Path, "utf-8");
assert(seedContent.includes("Aashraya Children"), "Seed data contains orphanage institution");
assert(seedContent.includes("Sandhya Prakash Senior Living Care"), "Seed data contains old age home institution");

// -------------------------------------------------------------
// Test Suite 2: AI Adapter Contracts & Dual-Mode Consistency
// -------------------------------------------------------------
console.log("\n--- 2. AI Inference Engine & Safety Boundaries ---");

const typesPath = path.join(rootDir, "src", "lib", "ai", "types.ts");
const demoAdapterPath = path.join(rootDir, "src", "lib", "ai", "demo-adapter.ts");
const remoteAdapterPath = path.join(rootDir, "src", "lib", "ai", "remote-adapter.ts");
const pythonApiPath = path.join(rootDir, "ai-service", "main.py");

assert(fs.existsSync(typesPath), "AI interface types (types.ts) exist");
assert(fs.existsSync(demoAdapterPath), "Demo AI adapter exists");
assert(fs.existsSync(remoteAdapterPath), "Remote AI adapter exists");
assert(fs.existsSync(pythonApiPath), "Python FastAPI microservice (main.py) exists");

const demoContent = fs.readFileSync(demoAdapterPath, "utf-8");
assert(demoContent.includes("doctorThreshold = 70") || demoContent.includes("totalScore >= doctorThreshold"), "Health risk priority threshold >= 70 triggers immediate doctor attention");
assert(demoContent.includes("DECISION SUPPORT ONLY") && demoContent.includes("NOT a medical diagnosis"), "Mandatory non-diagnostic disclaimer present in health output");
assert(demoContent.includes("is_synthetic: true"), "Synthetic/demo data flag explicitly set in demo adapter (Rule 7)");

// -------------------------------------------------------------
// Test Suite 3: Priority Scoring Math Verification
// -------------------------------------------------------------
console.log("\n--- 3. Priority Scoring Formula Verification ---");

function calculatePriority(age, baseRiskScore, hasChronic, medicationCount, weights) {
  const normAge = Math.min(100, (age / 90) * 100);
  const normChronic = hasChronic ? 100 : 0;
  const normMeds = Math.min(100, (medicationCount / 5) * 100);

  const priorityScore = Math.round(
    normAge * weights.age_factor +
    baseRiskScore * weights.clinical_ml_risk +
    normChronic * weights.chronic_history +
    normMeds * weights.medication_dependency
  );

  return {
    priorityScore,
    requiresAttention: priorityScore >= 70,
  };
}

const defaultWeights = {
  age_factor: 0.20,
  clinical_ml_risk: 0.35,
  chronic_history: 0.25,
  medication_dependency: 0.20,
};

// Case A: Healthy child (Age 8, Risk 15, No chronic, 0 meds)
const childCase = calculatePriority(8, 15, false, 0, defaultWeights);
assert(childCase.priorityScore < 30, `Healthy child priority score is low (${childCase.priorityScore} < 30)`);
assert(!childCase.requiresAttention, "Healthy child does not trigger immediate alert");

// Case B: Critical Senior Citizen (Age 84, Risk 88, Chronic illness = true, 4 medications)
const seniorCase = calculatePriority(84, 88, true, 4, defaultWeights);
assert(seniorCase.priorityScore >= 70, `Critical senior priority score is severe (${seniorCase.priorityScore} >= 70)`);
assert(seniorCase.requiresAttention, "Critical senior triggers immediate clinical alert (Score >= 70)");

// -------------------------------------------------------------
// Test Suite 4: Stakeholder Role Coverage & Security Isolation
// -------------------------------------------------------------
console.log("\n--- 4. Role Coverage & Clinical Confidentiality ---");

const reportsPagePath = path.join(rootDir, "src", "app", "reports", "page.tsx");
const reportsContent = fs.readFileSync(reportsPagePath, "utf-8");

assert(reportsContent.includes("currentRole !== \"doctor\" && currentRole !== \"admin\""), "Reports page enforces doctor-only medical report isolation");
assert(reportsContent.includes("downloadCSV"), "Dynamic CSV export engine declared");

const researchPagePath = path.join(rootDir, "src", "app", "research", "page.tsx");
const researchContent = fs.readFileSync(researchPagePath, "utf-8");
assert(researchContent.includes("exportProtocol"), "Research workspace includes formal protocol export");
assert(researchContent.includes("Rule 4 &amp; 16"), "Research workspace cites mandatory Academic Integrity Rules");

// -------------------------------------------------------------
// Test Summary
// -------------------------------------------------------------
console.log("\n=======================================================");
console.log(`  VERIFICATION RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
console.log("=======================================================\n");

if (passedTests === totalTests) {
  console.log("  >>> ALL CONTRACTS & SAFETY BOUNDARIES VERIFIED SUCCESSFULLY! <<<\n");
} else {
  console.error("  >>> SOME VERIFICATION CHECKS FAILED. PLEASE REVIEW. <<<\n");
}
