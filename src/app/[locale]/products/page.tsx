import { getClient, localizedContext } from "@/lib/apollo";
import { GET_PRODUCTS } from "./_queries/products";
import { nonNullable } from "@/lib/utils";
import { ProductCard, AddToCartAction } from "@/components/ui";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export const dynamic = "force-dynamic";

type ProductsPageProps = {
  params: Promise<{ locale: string }>;
};

export const generateMetadata = async (props: ProductsPageProps) => {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "metadata.products" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/products`,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((loc) => [loc, `/${loc}/products`]),
        ),
        "x-default": `/${routing.defaultLocale}/products`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      locale,
    },
  };
};

const ProductsPage = async (props: ProductsPageProps) => {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations("products");
  const tCommon = await getTranslations("common");

  const { data } = await getClient().query({
    query: GET_PRODUCTS,
    ...localizedContext(locale),
  });
  const products = (data?.products?.nodes ?? []).filter(nonNullable);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-foreground mb-8">{t("title")}</h1>

      {products.length === 0 ? (
        <p className="text-muted">{tCommon("noProductsFound")}</p>
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
    </main>
  );
};

export default ProductsPage;
