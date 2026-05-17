"use client";

import { useCallback } from "react";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { ProductOrderBy, ProductStatus } from "@/gql/graphql";
import { Input, Select } from "@/components/ui";

const ORDER_OPTIONS = Object.values(ProductOrderBy);
const STATUS_OPTIONS = Object.values(ProductStatus);

type ProductFiltersProps = {
  showStatusFilter?: boolean;
};

export const ProductFilters = (props: ProductFiltersProps) => {
  const { showStatusFilter = false } = props;
  const t = useTranslations("filters");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") ?? "";
  const currentOrderBy = searchParams.get("orderBy") ?? "";
  const currentStatus = searchParams.get("status") ?? "";
  const currentMinPrice = searchParams.get("minPrice") ?? "";
  const currentMaxPrice = searchParams.get("maxPrice") ?? "";

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="flex-1 min-w-[200px]">
        <Input
          id="search"
          placeholder={t("searchPlaceholder")}
          defaultValue={currentSearch}
          onChange={(e) => updateParams({ search: e.target.value })}
        />
      </div>

      <Select
        id="orderBy"
        label={t("sortBy")}
        value={currentOrderBy}
        onChange={(e) => updateParams({ orderBy: e.target.value })}
      >
        <option value="">{t("sortDefault")}</option>
        {ORDER_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {t(`sort.${option}`)}
          </option>
        ))}
      </Select>

      <div className="flex gap-2 items-end">
        <Input
          id="minPrice"
          type="number"
          placeholder={t("minPrice")}
          defaultValue={currentMinPrice}
          onChange={(e) => updateParams({ minPrice: e.target.value })}
          className="w-28"
        />
        <Input
          id="maxPrice"
          type="number"
          placeholder={t("maxPrice")}
          defaultValue={currentMaxPrice}
          onChange={(e) => updateParams({ maxPrice: e.target.value })}
          className="w-28"
        />
      </div>

      {showStatusFilter && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => updateParams({ status: "" })}
            className={clsx("rounded-md px-3 py-1.5 text-sm", {
              "bg-gray-900 text-white": !currentStatus,
              "bg-gray-100 text-gray-700 hover:bg-gray-200": currentStatus,
            })}
          >
            {t("all")}
          </button>
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => updateParams({ status })}
              className={clsx("rounded-md px-3 py-1.5 text-sm", {
                "bg-gray-900 text-white": currentStatus === status,
                "bg-gray-100 text-gray-700 hover:bg-gray-200":
                  currentStatus !== status,
              })}
            >
              {t(`statuses.${status}`)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
