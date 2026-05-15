import { describe, it, expect } from "vitest";
import { nonNullable, formatPrice, formatDate, slugify } from "./utils";

describe("nonNullable", () => {
  it("returns true for non-null values", () => {
    expect(nonNullable("hello")).toBe(true);
    expect(nonNullable(0)).toBe(true);
    expect(nonNullable(false)).toBe(true);
  });

  it("returns false for null and undefined", () => {
    expect(nonNullable(null)).toBe(false);
    expect(nonNullable(undefined)).toBe(false);
  });
});

describe("formatPrice", () => {
  it("formats cents to EUR currency", () => {
    expect(formatPrice(19990, "en")).toContain("199.90");
  });

  it("handles zero", () => {
    expect(formatPrice(0, "en")).toContain("0.00");
  });
});

describe("formatDate", () => {
  it("formats ISO date string", () => {
    const result = formatDate("2026-05-15T14:30:00Z", "en");
    expect(result).toContain("2026");
    expect(result).toMatch(/May|5/);
  });
});

describe("slugify", () => {
  it("converts to lowercase", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("replaces spaces with hyphens", () => {
    expect(slugify("padel rackets")).toBe("padel-rackets");
  });

  it("removes accents", () => {
    expect(slugify("Raquettes contrôle")).toBe("raquettes-controle");
  });

  it("removes special characters", () => {
    expect(slugify("Head Speed Pro!")).toBe("head-speed-pro");
  });

  it("collapses multiple hyphens", () => {
    expect(slugify("hello   world")).toBe("hello-world");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify(" hello world ")).toBe("hello-world");
  });

  it("handles empty string", () => {
    expect(slugify("")).toBe("");
  });
});
