"use client";

import { useTranslations } from "next-intl";
import { ProductCard, AddToCartAction, Button } from "@/components/ui";
import {
  ProductFilters,
  useUrlFilters,
  type Filters,
} from "@/components/products";
import { useProducts } from "../_hooks/useProducts";
import { type getInitialProducts } from "../_queries/products";

type Product = Awaited<ReturnType<typeof getInitialProducts>>["products"][number];

type CategoryOption = {
  slug: string;
  name: string;
};

type ProductCatalogProps = {
  initialProducts?: Product[];
  initialHasNextPage?: boolean;
  categorySlug?: string;
  categories?: CategoryOption[];
};

const hasActiveFilters = (filters: Filters) =>
  Object.values(filters).some((v) => v != null && v !== "");

export const ProductCatalog = (props: ProductCatalogProps) => {
  const {
    initialProducts = [],
    initialHasNextPage = false,
    categorySlug,
    categories,
  } = props;
  const t = useTranslations("common");
  const { filters, updateFilters, filterKey } = useUrlFilters();

  const {
    products: queryProducts,
    loading,
    hasNextPage,
    loadMore,
  } = useProducts({ categorySlug, ...filters });
  const products = queryProducts.length > 0 ? queryProducts : initialProducts;
  const showLoadMore = queryProducts.length > 0 ? hasNextPage : initialHasNextPage;

  return (
    <div className="w-full">
      <div className="mb-8">
        <ProductFilters
          key={filterKey}
          filters={filters}
          onFiltersChange={updateFilters}
          showCategoryFilter={!categorySlug}
          categories={categories}
        />
      </div>

      <div
        className={`min-h-[200px] transition-opacity ${loading ? "opacity-50" : ""}`}
      >
        {products.length === 0 && !loading ? (
          <p className="text-muted">{t("noProductsFound")}</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, index) => {
              const firstImage = product.images?.[0];
              const defaultVariant = product.variants?.[0];
              const inStock = defaultVariant
                ? defaultVariant.stockQuantity > 0
                : false;

              return (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  brand={product.brand ?? ""}
                  slug={product.slug}
                  priceCents={product.basePriceCents}
                  imageUrl={firstImage?.imageUrl}
                  imageAlt={firstImage?.altText ?? undefined}
                  featured={product.featured}
                  inStock={inStock}
                  priority={index === 0}
                  category={product.category ?? undefined}
                  action={
                    defaultVariant && (
                      <AddToCartAction
                        productVariantId={defaultVariant.id}
                        inStock={inStock}
                      />
                    )
                  }
                />
              );
            })}
          </div>
        )}

        {showLoadMore && (
          <div className="mt-8 flex justify-center">
            <Button onClick={loadMore} disabled={loading}>
              {t("loadMore")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
