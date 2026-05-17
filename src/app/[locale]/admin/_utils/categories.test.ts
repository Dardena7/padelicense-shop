import { describe, it, expect } from "vitest";
import { flattenCategories } from "./categories";

const categories = [
  {
    id: "1",
    name: "Rackets",
    subcategories: [
      { id: "2", name: "Control" },
      {
        id: "3",
        name: "Power",
        subcategories: [{ id: "4", name: "Advanced" }],
      },
    ],
  },
  { id: "5", name: "Balls" },
];

describe("flattenCategories", () => {
  it("flattens all categories with indentation", () => {
    const result = flattenCategories(categories);

    expect(result).toEqual([
      { id: "1", label: "Rackets" },
      { id: "2", label: "\u00A0\u00A0\u00A0└ Control" },
      { id: "3", label: "\u00A0\u00A0\u00A0└ Power" },
      {
        id: "4",
        label: "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0└ Advanced",
      },
      { id: "5", label: "Balls" },
    ]);
  });

  it("excludes a category by id", () => {
    const result = flattenCategories(categories, { excludeId: "3" });

    expect(result.find((c) => c.id === "3")).toBeUndefined();
    expect(result.find((c) => c.id === "1")).toBeDefined();
  });

  it("limits depth with maxDepth", () => {
    const result = flattenCategories(categories, { maxDepth: 1 });

    expect(result).toEqual([
      { id: "1", label: "Rackets" },
      { id: "5", label: "Balls" },
    ]);
  });

  it("returns empty array for empty input", () => {
    expect(flattenCategories([])).toEqual([]);
  });
});
