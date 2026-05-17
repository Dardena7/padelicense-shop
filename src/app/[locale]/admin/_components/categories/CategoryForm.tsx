"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { SupportedLocale, CategoryTranslation } from "@/gql/graphql";
import { Input, Select } from "@/components/ui";
import { slugify } from "@/lib/utils";
import { useAdminCategories } from "../../_hooks/useAdminCategories";
import { LanguageTabs } from "../LanguageTabs";
import {
  LOCALES,
  categorySchema,
  buildDefaultValues,
  flattenCategories,
  type CategoryFormValues,
  type CategorySubmitData,
} from "./utils";

type CategoryFormProps = {
  initialTranslations?: CategoryTranslation[];
  parentId?: string | null;
  categoryId?: string;
  onSubmit: (data: CategorySubmitData) => Promise<void>;
  loading: boolean;
};

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
    setValue,
    formState: { errors, touchedFields },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema(t)),
    defaultValues: buildDefaultValues(initialTranslations, parentId),
  });

  const parentOptions = flattenCategories(categories, 0, categoryId);

  const setSlug = setValue as (
    path: string,
    value: string,
    options?: { shouldValidate?: boolean },
  ) => void;

  const handleNameChange = (
    locale: SupportedLocale,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!isEditing && !touchedFields.translations?.[locale]?.slug) {
      setSlug(`translations.${locale}.slug`, slugify(e.target.value), {
        shouldValidate: true,
      });
    }
  };

  const onFormSubmit = async (data: CategoryFormValues) => {
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
          const locErrors = errors.translations?.[locale];
          const nameField = register(`translations.${locale}.name`);

          return (
            <div className="space-y-4">
              <Input
                id={`name-${locale}`}
                label={t("name")}
                error={locErrors?.name?.message}
                {...nameField}
                onChange={(e) => {
                  nameField.onChange(e);
                  handleNameChange(locale, e);
                }}
              />
              <Input
                id={`slug-${locale}`}
                label={t("slug")}
                error={locErrors?.slug?.message}
                {...register(`translations.${locale}.slug`)}
              />
              <Input
                id={`description-${locale}`}
                label={t("description")}
                {...register(`translations.${locale}.description`)}
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
