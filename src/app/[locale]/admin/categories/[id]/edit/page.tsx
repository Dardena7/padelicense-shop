"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { CategoryForm } from "../../../_components/categories";
import { useAdminCategory } from "../../../_hooks/useAdminCategory";
import { useUpdateCategory } from "../../../_hooks/useUpdateCategory";

const EditCategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations("admin.categories");
  const { category, loading } = useAdminCategory(id);
  const { updateCategory, loading: updating } = useUpdateCategory();

  if (loading) {
    return <p className="text-gray-500">...</p>;
  }

  if (!category) {
    return <p className="text-red-600">{t("notFound")}</p>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h2 className="text-2xl font-bold">{t("editTitle")}</h2>
      <CategoryForm
        initialTranslations={category.translations}
        parentId={category.parent?.id}
        categoryId={id}
        onSubmit={async ({ translations, parentId }) => {
          await updateCategory({
            variables: { input: { categoryId: id, translations, parentId } },
          });
        }}
        loading={updating}
      />
    </div>
  );
};

export default EditCategoryPage;
