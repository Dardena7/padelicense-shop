"use client";

import { useState, useCallback, useEffect } from "react";
import { type Filters } from "./ProductFilters";
import { ProductOrderBy, ProductStatus } from "@/gql/graphql";

const parseFiltersFromUrl = (): Filters => {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  return {
    search: params.get("search") || undefined,
    orderBy: (params.get("orderBy") as ProductOrderBy) || undefined,
    status: (params.get("status") as ProductStatus) || undefined,
    minPrice: params.get("minPrice")
      ? parseInt(params.get("minPrice")!)
      : undefined,
    maxPrice: params.get("maxPrice")
      ? parseInt(params.get("maxPrice")!)
      : undefined,
  };
};

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
  const [filters, setFilters] = useState<Filters>({});

  // Sync URL filters after hydration to avoid SSR mismatch.
  // setState is deferred via requestAnimationFrame to avoid React's
  // "cascading renders" warning when setting state synchronously in an effect.
  useEffect(() => {
    const urlFilters = parseFiltersFromUrl();
    const hasFilters = Object.values(urlFilters).some(
      (v) => v != null && v !== "",
    );
    if (hasFilters) {
      requestAnimationFrame(() => setFilters(urlFilters));
    }
  }, []);

  const updateFilters = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
    syncFiltersToUrl(newFilters);
  }, []);

  return { filters, updateFilters };
};
