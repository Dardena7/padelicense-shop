import { z } from "zod";
import { SupportedLocale, CategoryTranslation } from "@/gql/graphql";

export const LOCALES = Object.values(SupportedLocale);
export const MAX_DEPTH = 3;

// --- Types ---

export type CategoryNode = {
  id: string;
  name: string;
  productsCount?: number;
  subcategories?: CategoryNode[];
};

// --- Zod schema ---

const translationSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("validation.nameRequired")),
    slug: z.string().min(1, t("validation.slugRequired")),
    description: z.string().optional(),
  });

export const categorySchema = (t: (key: string) => string) =>
  z.object({
    parentId: z.string().optional(),
    translations: z.object(
      Object.fromEntries(
        LOCALES.map((locale) => [locale, translationSchema(t)]),
      ) as Record<SupportedLocale, ReturnType<typeof translationSchema>>,
    ),
  });

export type CategoryFormValues = z.infer<ReturnType<typeof categorySchema>>;

export type CategorySubmitData = {
  translations: {
    locale: SupportedLocale;
    name: string;
    slug: string;
    description?: string;
  }[];
  parentId?: string;
};

// --- Default values ---

export const buildDefaultValues = (
  initialTranslations?: CategoryTranslation[],
  parentId?: string | null,
): CategoryFormValues => {
  const empty = { name: "", slug: "", description: "" };
  const translations = Object.fromEntries(
    LOCALES.map((locale) => {
      const existing = initialTranslations?.find((t) => t.locale === locale);
      return [
        locale,
        existing
          ? {
              name: existing.name,
              slug: existing.slug,
              description: existing.description ?? "",
            }
          : { ...empty },
      ];
    }),
  ) as CategoryFormValues["translations"];

  return { parentId: parentId ?? "", translations };
};

// --- Flatten categories for parent select ---

export const flattenCategories = (
  cats: CategoryNode[],
  depth: number,
  excludeId?: string,
): { id: string; label: string }[] =>
  cats.flatMap((cat) => {
    if (cat.id === excludeId) return [];
    if (depth >= MAX_DEPTH - 1) return [];
    const indent = "\u00A0\u00A0\u00A0".repeat(depth);
    const prefix = depth > 0 ? `${indent}└ ` : "";
    const children = cat.subcategories
      ? flattenCategories(cat.subcategories, depth + 1, excludeId)
      : [];
    return [{ id: cat.id, label: `${prefix}${cat.name}` }, ...children];
  });
