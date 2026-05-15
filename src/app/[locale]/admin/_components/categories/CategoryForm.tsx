"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { SupportedLocale, CategoryTranslation } from "@/gql/graphql";
import { Input, Select } from "@/components/ui";
import { slugify } from "@/lib/utils";
import { useAdminCategories } from "../../_hooks/useAdminCategories";
import { LanguageTabs } from "../LanguageTabs";

const LOCALES = [SupportedLocale.En, SupportedLocale.Fr, SupportedLocale.Nl];
const MAX_DEPTH = 3;

const translationSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("validation.nameRequired")),
    slug: z.string().min(1, t("validation.slugRequired")),
    description: z.string().optional(),
  });

const categorySchema = (t: (key: string) => string) =>
  z.object({
    parentId: z.string().optional(),
    translations: z.object({
      [SupportedLocale.En]: translationSchema(t),
      [SupportedLocale.Fr]: translationSchema(t),
      [SupportedLocale.Nl]: translationSchema(t),
    }),
  });

type FormValues = z.infer<ReturnType<typeof categorySchema>>;

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

type CategoryNode = {
  id: string;
  name: string;
  subcategories?: CategoryNode[];
};

const buildDefaultValues = (
  initialTranslations?: CategoryTranslation[],
  parentId?: string | null,
): FormValues => {
  const empty = { name: "", slug: "", description: "" };
  const translations = {
    [SupportedLocale.En]: { ...empty },
    [SupportedLocale.Fr]: { ...empty },
    [SupportedLocale.Nl]: { ...empty },
  };

  initialTranslations?.forEach((t) => {
    translations[t.locale] = {
      name: t.name,
      slug: t.slug,
      description: t.description ?? "",
    };
  });

  return { parentId: parentId ?? "", translations };
};

const flattenCategories = (
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

export const CategoryForm = (props: CategoryFormProps) => {
  const { initialTranslations, parentId, categoryId, onSubmit, loading } =
    props;
  const t = useTranslations("admin.categories");
  const router = useRouter();
  const { categories } = useAdminCategories();
  const isEditing = !!initialTranslations;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, touchedFields },
  } = useForm<FormValues>({
    resolver: zodResolver(categorySchema(t)),
    defaultValues: buildDefaultValues(initialTranslations, parentId),
  });

  const parentOptions = flattenCategories(categories, 0, categoryId);

  // Auto-generate slug from name in creation mode
  const watchedNames = {
    [SupportedLocale.En]: watch(`translations.${SupportedLocale.En}.name`),
    [SupportedLocale.Fr]: watch(`translations.${SupportedLocale.Fr}.name`),
    [SupportedLocale.Nl]: watch(`translations.${SupportedLocale.Nl}.name`),
  };

  useEffect(() => {
    if (isEditing) return;

    const setSlug = setValue as (path: string, value: string) => void;

    LOCALES.forEach((locale) => {
      if (touchedFields.translations?.[locale]?.slug) return;
      setSlug(`translations.${locale}.slug`, slugify(watchedNames[locale]));
    });
  }, [watchedNames.EN, watchedNames.FR, watchedNames.NL]);

  const onFormSubmit = async (data: FormValues) => {
    const translations = LOCALES.map((locale) => ({
      locale,
      name: data.translations[locale].name,
      slug: data.translations[locale].slug,
      description: data.translations[locale].description || undefined,
    }));

    try {
      await onSubmit({
        translations,
        parentId: data.parentId || undefined,
      });
      router.push("/admin/categories");
    } catch {
      // Error handled by parent via GraphQL
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <Select id="parentId" label={t("parent")} {...register("parentId")}>
        <option value="">{t("noParent")}</option>
        {parentOptions.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </Select>

      <LanguageTabs>
        {(locale) => {
          const loc = locale as SupportedLocale;
          const locErrors = errors.translations?.[loc];

          return (
            <div className="space-y-4">
              <Input
                id={`name-${loc}`}
                label={t("name")}
                error={locErrors?.name?.message}
                {...register(`translations.${loc}.name`)}
              />
              <Input
                id={`slug-${loc}`}
                label={t("slug")}
                error={locErrors?.slug?.message}
                {...register(`translations.${loc}.slug`)}
              />
              <Input
                id={`description-${loc}`}
                label={t("description")}
                {...register(`translations.${loc}.description`)}
              />
            </div>
          );
        }}
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
