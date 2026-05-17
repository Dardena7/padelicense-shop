"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { SupportedLocale } from "@/gql/graphql";
import { slugify } from "@/lib/utils";
import { LanguageTabs } from "../LanguageTabs";
import { TranslationFields } from "../TranslationFields";
import { ProductFields } from "./ProductFields";
import {
  LOCALES,
  productSchema,
  buildDefaultValues,
  type ProductFormValues,
  type AdminProduct,
} from "./utils";

type ProductFormProps = {
  product?: AdminProduct | null;
  isEditing?: boolean;
  onSubmit: (data: ProductFormValues) => Promise<void>;
  loading: boolean;
};

export const ProductForm = (props: ProductFormProps) => {
  const { product, isEditing = false, onSubmit, loading } = props;
  const t = useTranslations("admin.products");
  const tCommon = useTranslations("admin.common");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, touchedFields },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(
      productSchema({
        common: useTranslations("admin.common.validation"),
        product: useTranslations("admin.products.validation"),
      }),
    ),
    defaultValues: buildDefaultValues(product),
  });

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

  const onFormSubmit = async (data: ProductFormValues) => {
    setError(null);
    try {
      await onSubmit(data);
      router.push("/admin/products");
    } catch {
      setError(t("saveError"));
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <ProductFields register={register} errors={errors} />

      <LanguageTabs>
        {(locale) => (
          <TranslationFields
            locale={locale}
            register={register}
            namePrefix="translations"
            errors={errors.translations?.[locale]}
            onNameChange={(e) => handleNameChange(locale, e)}
          />
        )}
      </LanguageTabs>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? tCommon("saving") : tCommon("save")}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          {tCommon("cancel")}
        </button>
      </div>
    </form>
  );
};
