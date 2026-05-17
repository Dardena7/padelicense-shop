type CategoryNode = {
  id: string;
  name: string;
  subcategories?: CategoryNode[];
};

type FlattenOptions = {
  excludeId?: string;
  maxDepth?: number;
};

export const flattenCategories = (
  cats: CategoryNode[],
  options: FlattenOptions = {},
  depth = 0,
): { id: string; label: string }[] =>
  cats.flatMap((cat) => {
    if (cat.id === options.excludeId) return [];
    if (options.maxDepth != null && depth >= options.maxDepth) return [];
    const indent = "\u00A0\u00A0\u00A0".repeat(depth);
    const prefix = depth > 0 ? `${indent}└ ` : "";
    const children = cat.subcategories
      ? flattenCategories(cat.subcategories, options, depth + 1)
      : [];
    return [{ id: cat.id, label: `${prefix}${cat.name}` }, ...children];
  });
