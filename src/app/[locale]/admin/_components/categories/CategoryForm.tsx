"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { SupportedLocale, CategoryTranslation } from "@/gql/graphql";
import { Input } from "@/components/ui";
import { LanguageTabs } from "../LanguageTabs";

const LOCALES = [SupportedLocale.En, SupportedLocale.Fr, SupportedLocale.Nl];

type TranslationFields = {
  name: string;
  slug: string;
  description: string;
};

type CategoryFormProps = {
  initialTranslations?: CategoryTranslation[];
  parentId?: string | null;
  onSubmit: (
    translations: {
      locale: SupportedLocale;
      name: string;
      slug: string;
      description?: string;
    }[],
  ) => Promise<void>;
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
  const { initialTranslations, onSubmit, loading } = props;
  const t = useTranslations("admin.categories");
  const router = useRouter();

  const [fields, setFields] = useState<
    Record<SupportedLocale, TranslationFields>
  >(
    initialTranslations
      ? fromExisting(initialTranslations)
      : emptyTranslations(),
  );
  const [error, setError] = useState<string | null>(null);

  const updateField = (
    locale: string,
    field: keyof TranslationFields,
    value: string,
  ) => {
    setFields((prev) => ({
      ...prev,
      [locale]: { ...prev[locale as SupportedLocale], [field]: value },
    }));
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
      await onSubmit(translations);
      router.push("/admin/categories");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("saveError"));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <p className="text-sm text-red-600">{error}</p>}

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
