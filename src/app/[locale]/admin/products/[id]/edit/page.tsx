"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ProductForm, VariantSection } from "../../../_components/products";
import { useAdminProduct } from "../../../_hooks/useAdminProduct";
import { useUpdateProduct } from "../../../_hooks/useUpdateProduct";
import {
  LOCALES,
  type ProductFormValues,
} from "../../../_components/products/utils";

const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations("admin.products");
  const { product, loading } = useAdminProduct(id);
  const { updateProduct, loading: updating } = useUpdateProduct();

  if (loading) {
    return <p className="text-gray-500">...</p>;
  }

  if (!product) {
    return <p className="text-red-600">{t("notFound")}</p>;
  }

  const handleSubmit = async (data: ProductFormValues) => {
    const translations = LOCALES.map((locale) => ({
      locale,
      ...data.translations[locale],
      description: data.translations[locale].description || undefined,
    }));

    await updateProduct({
      variables: {
        input: {
          productId: id,
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
      <h2 className="text-2xl font-bold">{t("editTitle")}</h2>
      <ProductForm
        product={product}
        onSubmit={handleSubmit}
        loading={updating}
      />
      <VariantSection productId={id} variants={product.variants} />
    </div>
  );
};

export default EditProductPage;
