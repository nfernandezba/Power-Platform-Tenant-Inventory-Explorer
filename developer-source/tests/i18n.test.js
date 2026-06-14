import { describe, expect, it } from "vitest";
import { translations } from "../src/i18n.js";

describe("interface translations", () => {
  it("keeps Spanish and English key coverage aligned", () => {
    expect(Object.keys(translations.es).sort()).toEqual(Object.keys(translations.en).sort());
  });

  it("uses translated Spanish workspace navigation", () => {
    expect(translations.es.overview).toBe("Resumen");
    expect(translations.es.environmentsTab).toBe("Entornos");
    expect(translations.es.resources).toBe("Recursos");
    expect(translations.es.dlpPolicies).toBe("Políticas DLP");
  });

  it("keeps the owner filter meaning equivalent in both languages", () => {
    expect(translations.es.ownerContains).toContain("Nombre, UPN o ID");
    expect(translations.en.ownerContains).toBe("Owner name, UPN, or ID contains");
  });

  it("does not retain the diagnosed generic English labels in Spanish", () => {
    const serialised = JSON.stringify(translations.es);
    for (const phrase of ["Pulsa", "read-only", "tenant-wide", "Settings evaluados", "Baseline de gobernanza"]) {
      expect(serialised).not.toContain(phrase);
    }
  });
});
