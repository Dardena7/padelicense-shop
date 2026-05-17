"use client";

import { useCallback, useRef } from "react";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { ProductOrderBy, ProductStatus } from "@/gql/graphql";
import { Input, Select } from "@/components/ui";

const ORDER_OPTIONS = Object.values(ProductOrderBy);
const STATUS_OPTIONS = Object.values(ProductStatus);
const DEBOUNCE_MS = 300;

export type Filters = {
  search?: string;
  orderBy?: ProductOrderBy;
  status?: ProductStatus;
  minPrice?: number;
  maxPrice?: number;
};

type ProductFiltersProps = {
  showStatusFilter?: boolean;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
};

export const ProductFilters = (props: ProductFiltersProps) => {
  const { showStatusFilter = false, filters, onFiltersChange } = props;
  const t = useTranslations("filters");
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const pendingUpdates = useRef<Partial<Filters>>({});
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const update = useCallback(
    (updates: Partial<Filters>) => {
      onFiltersChange({ ...filtersRef.current, ...updates });
    },
    [onFiltersChange],
  );

  const debouncedUpdate = useCallback(
    (updates: Partial<Filters>) => {
      pendingUpdates.current = { ...pendingUpdates.current, ...updates };
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        onFiltersChange({ ...filtersRef.current, ...pendingUpdates.current });
        pendingUpdates.current = {};
      }, DEBOUNCE_MS);
    },
    [onFiltersChange],
  );

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="w-full sm:w-64">
        <Input
          id="search"
          placeholder={t("searchPlaceholder")}
          defaultValue={filters.search ?? ""}
          onChange={(e) =>
            debouncedUpdate({ search: e.target.value || undefined })
          }
        />
      </div>

      <Select
        id="orderBy"
        value={filters.orderBy ?? ""}
        onChange={(e) =>
          update({ orderBy: (e.target.value as ProductOrderBy) || undefined })
        }
      >
        <option value="">{t("sortBy")}</option>
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
          defaultValue={filters.minPrice ?? ""}
          onChange={(e) =>
            debouncedUpdate({
              minPrice: e.target.value ? parseInt(e.target.value) : undefined,
            })
          }
          className="w-28"
        />
        <Input
          id="maxPrice"
          type="number"
          placeholder={t("maxPrice")}
          defaultValue={filters.maxPrice ?? ""}
          onChange={(e) =>
            debouncedUpdate({
              maxPrice: e.target.value ? parseInt(e.target.value) : undefined,
            })
          }
          className="w-28"
        />
      </div>

      {showStatusFilter && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => update({ status: undefined })}
            className={clsx("rounded-md px-3 py-1.5 text-sm", {
              "bg-gray-900 text-white": !filters.status,
              "bg-gray-100 text-gray-700 hover:bg-gray-200": filters.status,
            })}
          >
            {t("all")}
          </button>
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => update({ status })}
              className={clsx("rounded-md px-3 py-1.5 text-sm", {
                "bg-gray-900 text-white": filters.status === status,
                "bg-gray-100 text-gray-700 hover:bg-gray-200":
                  filters.status !== status,
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
