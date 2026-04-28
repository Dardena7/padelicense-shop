import { query } from "@/lib/apollo";
import { GET_PRODUCTS } from "./_queries/products";
import { nonNullable } from "@/lib/utils";
import { ProductCard } from "@/components/ui";

export const metadata = {
  title: "Products — Padelicense Shop",
  description: "Browse our selection of premium padel equipment",
};

export default async function ProductsPage() {
  const { data } = await query({ query: GET_PRODUCTS });
  const products = (data?.products?.nodes ?? []).filter(nonNullable);

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-foreground mb-8">Products</h1>

      {products.length === 0 ? (
        <p className="text-muted">No products found.</p>
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
              />
            );
          })}
        </div>
      )}
    </main>
  );
}
