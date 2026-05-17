"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ProductStatus } from "@/gql/graphql";
import clsx from "clsx";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/utils";
import { useAdminProducts } from "../../_hooks/useAdminProducts";
import { useDeleteProduct } from "../../_hooks/useDeleteProduct";
import { StatusBadge } from "../";
import { PRODUCT_STATUSES } from "./utils";

export const ProductList = () => {
  const t = useTranslations("admin.products");
  const locale = useLocale();
  const [statusFilter, setStatusFilter] = useState<ProductStatus | undefined>();
  const { products, loading } = useAdminProducts(statusFilter);
  const { deleteProduct, loading: deleting } = useDeleteProduct();

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

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setStatusFilter(undefined)}
          className={clsx("rounded-md px-3 py-1.5 text-sm", {
            "bg-gray-900 text-white": statusFilter === undefined,
            "bg-gray-100 text-gray-700 hover:bg-gray-200":
              statusFilter !== undefined,
          })}
        >
          {t("all")}
        </button>
        {PRODUCT_STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={clsx("rounded-md px-3 py-1.5 text-sm", {
              "bg-gray-900 text-white": statusFilter === status,
              "bg-gray-100 text-gray-700 hover:bg-gray-200":
                statusFilter !== status,
            })}
          >
            {t(`statuses.${status}`)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500">...</p>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white">
          {products.length === 0 ? (
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
      )}
    </div>
  );
};
