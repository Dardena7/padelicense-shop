"use client";

import { useTranslations } from "next-intl";
import { CategoryForm } from "../../_components/categories";
import { useCreateCategory } from "../../_hooks/useCreateCategory";

const NewCategoryPage = () => {
  const t = useTranslations("admin.categories");
  const { createCategory, loading } = useCreateCategory();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h2 className="text-2xl font-bold">{t("addTitle")}</h2>
      <CategoryForm
        onSubmit={async (translations) => {
          await createCategory({ variables: { input: { translations } } });
        }}
        loading={loading}
      />
    </div>
  );
};

export default NewCategoryPage;
