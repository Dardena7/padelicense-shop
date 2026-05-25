import { getProduct } from "./_queries/product";
import { AlternateUrlsSync } from "@/components/layout";
import { Breadcrumb } from "@/components/ui";
import { ProductDetails } from "./_components/ProductDetails";
import { ProductGallery } from "./_components/ProductGallery";
import { notFound, redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
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
  const [t, tProducts] = await Promise.all([
    getTranslations("common"),
    getTranslations("products"),
  ]);

  const product = await getProduct(slug, locale);

  if (!product) {
    notFound();
  }

  if (product.status === "ARCHIVED" && product.category?.slug) {
    redirect(`/${locale}/categories/${product.category.slug}`);
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

  const variants = (product.variants ?? []).filter(
    (v): v is NonNullable<typeof v> => v != null,
  );
  const defaultVariant = variants[0];
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

  const breadcrumbItems: { label: string; href?: string }[] = [
    { label: tProducts("title"), href: "/products" },
  ];

  const category = product.category;
  if (category) {
    if (category.parent?.parent) {
      breadcrumbItems.push({
        label: category.parent.parent.name,
        href: `/categories/${category.parent.parent.slug}`,
      });
    }
    if (category.parent) {
      breadcrumbItems.push({
        label: category.parent.name,
        href: `/categories/${category.parent.slug}`,
      });
    }
    breadcrumbItems.push({
      label: category.name,
      href: `/categories/${category.slug}`,
    });
  }

  breadcrumbItems.push({ label: product.name });

  return (
    <main className="py-12 space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AlternateUrlsSync urls={alternateUrls} />
      <Breadcrumb items={breadcrumbItems} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ProductGallery images={images} productName={product.name} />

        <ProductDetails
          name={product.name}
          brand={product.brand}
          description={product.description}
          basePriceCents={product.basePriceCents}
          featured={product.featured}
          variants={variants}
        />
      </div>
    </main>
  );
};

export default ProductPage;
