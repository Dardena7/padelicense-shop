"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAdminCategories } from "../../_hooks/useAdminCategories";
import { useDeleteCategory } from "../../_hooks/useDeleteCategory";

export const CategoryTree = () => {
  const t = useTranslations("admin.categories");
  const { categories, loading } = useAdminCategories();
  const { deleteCategory, loading: deleting } = useDeleteCategory();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (categoryId: string) => {
    if (!confirm(t("confirmDelete"))) return;

    setError(null);
    try {
      await deleteCategory({ variables: { input: { categoryId } } });
    } catch (e) {
      setError(e instanceof Error ? e.message : t("deleteError"));
    }
  };

  if (loading) {
    return <p className="text-gray-500">...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t("title")}</h2>
        <Link
          href="/admin/categories/new"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          {t("add")}
        </Link>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="rounded-lg border border-gray-200 bg-white">
        {categories.length === 0 ? (
          <p className="px-6 py-4 text-sm text-gray-500">{t("empty")}</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {categories.map((category) => (
              <li key={category.id}>
                <CategoryRow
                  category={category}
                  depth={0}
                  onDelete={handleDelete}
                  deleting={deleting}
                />
                {category.subcategories.map((sub) => (
                  <CategoryRow
                    key={sub.id}
                    category={sub}
                    depth={1}
                    onDelete={handleDelete}
                    deleting={deleting}
                  />
                ))}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

type CategoryRowProps = {
  category: {
    id: string;
    name: string;
    productsCount: number;
  };
  depth: number;
  onDelete: (id: string) => void;
  deleting: boolean;
};

const CategoryRow = (props: CategoryRowProps) => {
  const { category, depth, onDelete, deleting } = props;
  const t = useTranslations("admin.categories");

  return (
    <div
      className="flex items-center justify-between px-6 py-3"
      style={{ paddingLeft: `${1.5 + depth * 1.5}rem` }}
    >
      <div>
        <Link
          href={`/admin/categories/${category.id}/edit`}
          className="text-sm font-medium hover:underline"
        >
          {depth > 0 && "└ "}
          {category.name}
        </Link>
        <span className="ml-2 text-xs text-gray-400">
          {t("productsCount", { count: category.productsCount })}
        </span>
      </div>
      <div className="flex gap-2">
        <Link
          href={`/admin/categories/${category.id}/edit`}
          className="text-sm text-blue-600 hover:underline"
        >
          {t("edit")}
        </Link>
        <button
          type="button"
          onClick={() => onDelete(category.id)}
          disabled={deleting}
          className="text-sm text-red-600 hover:underline disabled:opacity-50"
        >
          {t("delete")}
        </button>
      </div>
    </div>
  );
};
