import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BOOKS } from "../src/constants.js";
import { demoDlpPolicies, demoEnvironmentDetails, demoEnvironmentSettings, demoIdentityDirectory, demoRawItems, demoTenantSettings } from "../src/demo-data.js";
import { calculateMetrics, groupEnvironmentSettings, normaliseDlpPolicies, normaliseEnvironmentDetails, normaliseInventory } from "../src/data.js";
import { translations } from "../src/i18n.js";
import { createInventoryPdf } from "../src/pdf-export.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const output = process.argv[2] ? path.resolve(process.argv[2]) : path.join(root, "SAMPLE_REPORT.pdf");
const language = "es";

function imageDataUrl(relativeUrl) {
  const relativePath = relativeUrl.replace(/^\.\//, "");
  const filePath = path.join(root, "public", relativePath.replace(/^assets\//, "assets/"));
  const extension = path.extname(filePath).toLowerCase();
  const mime = extension === ".png" ? "image/png" : "image/jpeg";
  return `data:${mime};base64,${fs.readFileSync(filePath).toString("base64")}`;
}

const firstPass = normaliseInventory(demoRawItems, [], demoIdentityDirectory);
const environments = firstPass.filter(item => item.category === "platform");
const resources = normaliseInventory(
  demoRawItems.filter(item => !item.type?.startsWith("microsoft.powerplatform/")),
  environments,
  demoIdentityDirectory
);
const summaryCounts = calculateMetrics(firstPass).byType;
const selectedEnvironmentId = environments.find(environment => environment.isManagedEnvironment === true)?.id ?? Object.keys(demoEnvironmentDetails)[0];
const environmentSettings = {
  selectedId: selectedEnvironmentId,
  details: normaliseEnvironmentDetails(demoEnvironmentDetails[selectedEnvironmentId], selectedEnvironmentId),
  settings: demoEnvironmentSettings[selectedEnvironmentId],
  groups: groupEnvironmentSettings(demoEnvironmentSettings[selectedEnvironmentId])
};
const bookCoverData = BOOKS[language].map(book => imageDataUrl(book.cover));

const doc = createInventoryPdf(resources, {
  language,
  strings: translations[language],
  allItemsCount: firstPass.length,
  summaryCounts,
  accountName: "demo.admin@contoso.com",
  tenantId: "11111111-2222-4333-8444-555555555555",
  lastRefreshAt: new Date("2026-06-14T18:30:00Z"),
  now: new Date("2026-06-14T18:30:00Z"),
  tenantSettings: demoTenantSettings,
  governanceBaseline: "balanced",
  tenantSettingsSource: "demo",
  dlpPolicies: normaliseDlpPolicies(demoDlpPolicies),
  environmentSettings,
  bookCoverData,
  logoData: null
});

fs.writeFileSync(output, Buffer.from(doc.output("arraybuffer")));
console.log(`Sample report written to ${output}`);
