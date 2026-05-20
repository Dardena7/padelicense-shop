"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/utils";
import { ProductFilters, useUrlFilters } from "@/components/products";
import { useAdminProducts } from "../../_hooks/useAdminProducts";
import { useDeleteProduct } from "../../_hooks/useDeleteProduct";
import { StatusBadge } from "../";

export const ProductList = () => {
  const t = useTranslations("admin.products");
  const locale = useLocale();
  const { filters, updateFilters, filterKey } = useUrlFilters();
  const { deleteProduct, loading: deleting } = useDeleteProduct();

  const { products, loading } = useAdminProducts(filters);

  const handleDelete = async (productId: string) => {
    if (!confirm(t("confirmDelete"))) return;
    await deleteProduct({ variables: { input: { productId } } });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t("title")}</h2>
        <Link
          href="/admin/products/new"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          {t("add")}
        </Link>
      </div>

      <ProductFilters
        key={filterKey}
        showStatusFilter
        filters={filters}
        onFiltersChange={updateFilters}
      />

      <div
        className={`rounded-lg border border-gray-200 bg-white transition-opacity ${loading ? "opacity-50" : ""}`}
      >
        {products.length === 0 && !loading ? (
          <p className="px-6 py-4 text-sm text-gray-500">{t("empty")}</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
                <th className="px-6 py-3 font-medium">{t("productName")}</th>
                <th className="px-6 py-3 font-medium">{t("category")}</th>
                <th className="px-6 py-3 font-medium">{t("price")}</th>
                <th className="px-6 py-3 font-medium">{t("status")}</th>
                <th className="px-6 py-3 font-medium">{t("variants")}</th>
                <th className="px-6 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-50 last:border-0"
                >
                  <td className="px-6 py-3 text-sm">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {product.name}
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">
                    {product.category.name}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    {formatPrice(product.basePriceCents, locale)}
                  </td>
                  <td className="px-6 py-3">
                    <StatusBadge
                      status={product.status}
                      label={t(`statuses.${product.status}`)}
                    />
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">
                    {product.variants.length}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {t("edit")}
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id)}
                        disabled={deleting}
                        className="text-sm text-red-600 hover:underline disabled:opacity-50"
                      >
                        {t("delete")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
