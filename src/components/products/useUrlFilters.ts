"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { type Filters } from "./ProductFilters";
import { ProductOrderBy, ProductStatus } from "@/gql/graphql";

const parseFromSearchParams = (params: URLSearchParams): Filters => ({
  search: params.get("search") || undefined,
  orderBy: (params.get("orderBy") as ProductOrderBy) || undefined,
  status: (params.get("status") as ProductStatus) || undefined,
  minPrice: params.get("minPrice")
    ? parseInt(params.get("minPrice")!)
    : undefined,
  maxPrice: params.get("maxPrice")
    ? parseInt(params.get("maxPrice")!)
    : undefined,
});

const syncFiltersToUrl = (filters: Filters) => {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.orderBy) params.set("orderBy", filters.orderBy);
  if (filters.status) params.set("status", filters.status);
  if (filters.minPrice) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice));

  const query = params.toString();
  const url = query
    ? `${window.location.pathname}?${query}`
    : window.location.pathname;
  window.history.replaceState(null, "", url);
};

export const useUrlFilters = () => {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<Filters>({});
  const [resetCount, setResetCount] = useState(0);

  // Sync filters when URL search params change (navigation, back/forward)
  useEffect(() => {
    const urlFilters = parseFromSearchParams(searchParams);
    const hasFilters = Object.values(urlFilters).some(
      (v) => v != null && v !== "",
    );
    requestAnimationFrame(() => {
      setFilters(hasFilters ? urlFilters : {});
      setResetCount((c) => c + 1);
    });
  }, [searchParams]);

  const updateFilters = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
    syncFiltersToUrl(newFilters);
  }, []);

  // Key changes on every URL sync — forces re-mount of uncontrolled inputs
  const filterKey = `${searchParams.toString()}-${resetCount}`;

  return { filters, updateFilters, filterKey };
};
