"use client";

import { useTranslations } from "next-intl";
import { ProductForm } from "../../_components/products";
import { useCreateProduct } from "../../_hooks/useCreateProduct";
import {
  LOCALES,
  type ProductFormValues,
} from "../../_components/products/utils";

const NewProductPage = () => {
  const t = useTranslations("admin.products");
  const { createProduct, loading } = useCreateProduct();

  const handleSubmit = async (data: ProductFormValues) => {
    const translations = LOCALES.map((locale) => ({
      locale,
      ...data.translations[locale],
      description: data.translations[locale].description || undefined,
    }));

    await createProduct({
      variables: {
        input: {
          attributes: {
            categoryId: data.categoryId,
            basePriceCents: data.basePriceCents,
            brand: data.brand || undefined,
            status: data.status,
            featured: data.featured,
            translations,
          },
        },
      },
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h2 className="text-2xl font-bold">{t("addTitle")}</h2>
      <ProductForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
};

export default NewProductPage;
