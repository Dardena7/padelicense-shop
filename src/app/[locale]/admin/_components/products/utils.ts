import { z } from "zod";
import { SupportedLocale, ProductStatus } from "@/gql/graphql";
import type { useAdminProduct } from "../../_hooks/useAdminProduct";

// --- Constants ---

export const LOCALES = Object.values(SupportedLocale);
export const PRODUCT_STATUSES = Object.values(ProductStatus);

// --- Types ---

export type AdminProduct = NonNullable<
  ReturnType<typeof useAdminProduct>["product"]
>;

export type AdminVariant = AdminProduct["variants"][number];

// --- Zod schema ---

type ValidationMessages = {
  common: (key: string) => string;
  product: (key: string) => string;
};

const requiredTranslationSchema = (t: ValidationMessages) =>
  z.object({
    name: z.string().min(1, t.common("nameRequired")),
    slug: z.string().min(1, t.common("slugRequired")),
    description: z.string().optional(),
  });

const optionalTranslationSchema = () =>
  z.object({
    name: z.string().optional().default(""),
    slug: z.string().optional().default(""),
    description: z.string().optional(),
  });

export const productSchema = (t: ValidationMessages) =>
  z.object({
    categoryId: z.string().min(1, t.product("categoryRequired")),
    basePriceCents: z.number().int().positive(t.product("priceRequired")),
    brand: z.string().optional(),
    status: z.nativeEnum(ProductStatus),
    featured: z.boolean(),
    translations: z.object(
      Object.fromEntries(
        LOCALES.map((locale) => [
          locale,
          locale === SupportedLocale.En
            ? requiredTranslationSchema(t)
            : optionalTranslationSchema(),
        ]),
      ) as Record<
        SupportedLocale,
        ReturnType<typeof requiredTranslationSchema>
      >,
    ),
  });

export type ProductFormValues = z.infer<ReturnType<typeof productSchema>>;

// --- Default values ---

export const buildDefaultValues = (
  product?: AdminProduct | null,
): ProductFormValues => {
  const empty = { name: "", slug: "", description: "" };
  const translations = Object.fromEntries(
    LOCALES.map((locale) => {
      const existing = product?.translations?.find((t) => t.locale === locale);
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
  ) as ProductFormValues["translations"];

  return {
    categoryId: product?.category?.id ?? "",
    basePriceCents: product?.basePriceCents ?? 0,
    brand: product?.brand ?? "",
    status: (product?.status as ProductStatus) ?? ProductStatus.Draft,
    featured: product?.featured ?? false,
    translations,
  };
};
