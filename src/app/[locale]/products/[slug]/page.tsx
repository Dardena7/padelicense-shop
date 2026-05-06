import { getProduct } from "./_queries/product";
import Image from "next/image";
import { Badge } from "@/components/ui";
import { AlternateUrlsSync } from "@/components/layout";
import { AddToCartButton } from "./_components/AddToCartButton";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

type ProductPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

const buildSlugsByLocale = (
  alternateSlugs: { locale: string; value: string }[],
) =>
  Object.fromEntries(
    alternateSlugs.map((alt) => [alt.locale.toLowerCase(), alt.value]),
  );

export const generateMetadata = async (
  props: ProductPageProps,
): Promise<Metadata> => {
  const { locale, slug } = await props.params;
  const product = await getProduct(slug, locale);

  if (!product) return {};

  const slugsByLocale = buildSlugsByLocale(product.alternateSlugs ?? []);

  return {
    title: `${product.name} — Padelicense Shop`,
    description: product.description ?? undefined,
    alternates: {
      canonical: `/${locale}/products/${slug}`,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((loc) => [
            loc,
            `/${loc}/products/${slugsByLocale[loc] ?? slug}`,
          ]),
        ),
        "x-default": `/${routing.defaultLocale}/products/${slugsByLocale[routing.defaultLocale] ?? slug}`,
      },
    },
    openGraph: {
      title: product.name,
      description: product.description ?? undefined,
      type: "website",
      locale,
    },
  };
};

const ProductPage = async (props: ProductPageProps) => {
  const { locale, slug } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations("common");
  const tProducts = await getTranslations("products");

  const product = await getProduct(slug, locale);

  if (!product) {
    notFound();
  }

  const images = [...(product.images ?? [])].sort(
    (a, b) => (a?.position ?? 0) - (b?.position ?? 0),
  );
  const mainImage = images[0];

  const alternateUrls = Object.fromEntries(
    (product.alternateSlugs ?? []).map((alt) => [
      alt.locale.toLowerCase(),
      `/products/${alt.value}`,
    ]),
  );

  const defaultVariant = product.variants?.[0];
  const inStock = defaultVariant ? defaultVariant.stockQuantity > 0 : false;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: product.brand },
    image: mainImage?.imageUrl,
    offers: {
      "@type": "Offer",
      price: product.basePriceCents / 100,
      priceCurrency: "EUR",
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `/${locale}/products/${slug}`,
    },
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AlternateUrlsSync urls={alternateUrls} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="relative aspect-square bg-foreground-light rounded-xl overflow-hidden">
          {mainImage ? (
            <Image
              src={mainImage.imageUrl}
              alt={mainImage.altText || product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted">
              {t("noImageAvailable")}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium uppercase tracking-wider text-muted">
              {product.brand}
            </p>
            <h1 className="text-3xl font-bold text-foreground">
              {product.name}
            </h1>
            <div className="flex gap-2">
              {product.featured && (
                <Badge variant="accent">{t("featured")}</Badge>
              )}
            </div>
          </div>

          <p className="text-3xl font-bold text-foreground">
            {formatPrice(product.basePriceCents, locale)}
          </p>

          {product.description && (
            <p className="text-muted leading-relaxed">{product.description}</p>
          )}

          {defaultVariant && (
            <AddToCartButton
              productVariantId={defaultVariant.id}
              inStock={inStock}
            />
          )}

          {product.variants && product.variants.length > 1 && (
            <div className="flex flex-col gap-3">
              <h2 className="text-sm font-medium text-foreground">
                {tProducts("variants")}
              </h2>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) =>
                  variant ? (
                    <div
                      key={variant.id}
                      className="border border-border rounded-lg px-4 py-2 text-sm"
                    >
                      <span className="font-medium">{variant.name}</span>
                      {variant.effectivePrice !== product.basePriceCents && (
                        <span className="text-muted ml-2">
                          {formatPrice(variant.effectivePrice, locale)}
                        </span>
                      )}
                      {variant.stockQuantity === 0 && (
                        <Badge variant="danger">{t("outOfStock")}</Badge>
                      )}
                    </div>
                  ) : null,
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProductPage;
