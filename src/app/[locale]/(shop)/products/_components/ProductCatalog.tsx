"use client";

import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { ProductOrderBy } from "@/gql/graphql";
import { ProductCard, AddToCartAction } from "@/components/ui";
import { ProductFilters } from "@/components/products";
import { useProducts } from "../_hooks/useProducts";

type ProductCatalogProps = {
  categorySlug?: string;
};

export const ProductCatalog = (props: ProductCatalogProps) => {
  const { categorySlug } = props;
  const t = useTranslations("common");
  const locale = useLocale();
  const searchParams = useSearchParams();

  const filters = {
    categorySlug,
    search: searchParams.get("search") || undefined,
    orderBy: (searchParams.get("orderBy") as ProductOrderBy) || undefined,
    minPrice: searchParams.get("minPrice")
      ? parseInt(searchParams.get("minPrice")!)
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? parseInt(searchParams.get("maxPrice")!)
      : undefined,
  };

  const { products, loading } = useProducts(filters);

  return (
    <>
      <div className="mb-8">
        <ProductFilters />
      </div>

      {loading ? (
        <p className="text-muted">...</p>
      ) : products.length === 0 ? (
        <p className="text-muted">{t("noProductsFound")}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
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
    </>
  );
};
