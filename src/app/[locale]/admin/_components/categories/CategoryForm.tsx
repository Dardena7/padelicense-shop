"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { SupportedLocale, CategoryTranslation } from "@/gql/graphql";
import { Input, Select } from "@/components/ui";
import { slugify } from "@/lib/utils";
import { useAdminCategories } from "../../_hooks/useAdminCategories";
import { LanguageTabs } from "../LanguageTabs";

const LOCALES = [SupportedLocale.En, SupportedLocale.Fr, SupportedLocale.Nl];

type TranslationFields = {
  name: string;
  slug: string;
  description: string;
};

type SubmitData = {
  translations: {
    locale: SupportedLocale;
    name: string;
    slug: string;
    description?: string;
  }[];
  parentId?: string;
};

type CategoryFormProps = {
  initialTranslations?: CategoryTranslation[];
  parentId?: string | null;
  categoryId?: string;
  onSubmit: (data: SubmitData) => Promise<void>;
  loading: boolean;
};

const emptyTranslations = (): Record<SupportedLocale, TranslationFields> => ({
  [SupportedLocale.En]: { name: "", slug: "", description: "" },
  [SupportedLocale.Fr]: { name: "", slug: "", description: "" },
  [SupportedLocale.Nl]: { name: "", slug: "", description: "" },
});

const fromExisting = (
  translations: CategoryTranslation[],
): Record<SupportedLocale, TranslationFields> => {
  const result = emptyTranslations();
  translations.forEach((t) => {
    result[t.locale] = {
      name: t.name,
      slug: t.slug,
      description: t.description ?? "",
    };
  });
  return result;
};

export const CategoryForm = (props: CategoryFormProps) => {
  const { initialTranslations, parentId, categoryId, onSubmit, loading } =
    props;
  const t = useTranslations("admin.categories");
  const router = useRouter();
  const { categories } = useAdminCategories();

  const [fields, setFields] = useState<
    Record<SupportedLocale, TranslationFields>
  >(
    initialTranslations
      ? fromExisting(initialTranslations)
      : emptyTranslations(),
  );
  const [selectedParentId, setSelectedParentId] = useState<string>(
    parentId ?? "",
  );
  const [slugTouched, setSlugTouched] = useState<
    Record<SupportedLocale, boolean>
  >({
    [SupportedLocale.En]: !!initialTranslations,
    [SupportedLocale.Fr]: !!initialTranslations,
    [SupportedLocale.Nl]: !!initialTranslations,
  });
  const [error, setError] = useState<string | null>(null);

  // Flatten categories recursively, excluding self
  const MAX_DEPTH = 3;
  type FlatOption = { id: string; label: string };
  type CategoryNode = {
    id: string;
    name: string;
    subcategories?: CategoryNode[];
  };

  const flattenCategories = (
    cats: CategoryNode[],
    depth: number,
  ): FlatOption[] =>
    cats.flatMap((cat) => {
      if (cat.id === categoryId) return [];
      // Don't show categories at max depth — they can't be parents
      if (depth >= MAX_DEPTH - 1) return [];
      const indent = "\u00A0\u00A0\u00A0".repeat(depth);
      const prefix = depth > 0 ? `${indent}└ ` : "";
      const children = cat.subcategories
        ? flattenCategories(cat.subcategories, depth + 1)
        : [];
      return [{ id: cat.id, label: `${prefix}${cat.name}` }, ...children];
    });

  const parentOptions = flattenCategories(categories, 0);

  const updateField = (
    locale: string,
    field: keyof TranslationFields,
    value: string,
  ) => {
    const loc = locale as SupportedLocale;

    setFields((prev) => {
      const updated = { ...prev[loc], [field]: value };

      if (field === "name" && !slugTouched[loc]) {
        updated.slug = slugify(value);
      }

      return { ...prev, [loc]: updated };
    });

    if (field === "slug") {
      setSlugTouched((prev) => ({ ...prev, [loc]: true }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const translations = LOCALES.map((locale) => ({
      locale,
      name: fields[locale].name,
      slug: fields[locale].slug,
      description: fields[locale].description || undefined,
    }));

    try {
      await onSubmit({
        translations,
        parentId: selectedParentId || undefined,
      });
      router.push("/admin/categories");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("saveError"));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <Select
        id="parentId"
        label={t("parent")}
        value={selectedParentId}
        onChange={(e) => setSelectedParentId(e.target.value)}
      >
        <option value="">{t("noParent")}</option>
        {parentOptions.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </Select>

      <LanguageTabs>
        {(locale) => (
          <div className="space-y-4">
            <Input
              id={`name-${locale}`}
              label={t("name")}
              value={fields[locale as SupportedLocale].name}
              onChange={(e) => updateField(locale, "name", e.target.value)}
              required
            />
            <Input
              id={`slug-${locale}`}
              label={t("slug")}
              value={fields[locale as SupportedLocale].slug}
              onChange={(e) => updateField(locale, "slug", e.target.value)}
              required
            />
            <Input
              id={`description-${locale}`}
              label={t("description")}
              value={fields[locale as SupportedLocale].description}
              onChange={(e) =>
                updateField(locale, "description", e.target.value)
              }
            />
          </div>
        )}
      </LanguageTabs>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? t("saving") : t("save")}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/categories")}
          className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          {t("cancel")}
        </button>
      </div>
    </form>
  );
};
