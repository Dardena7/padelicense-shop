import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { AlternateUrlsSync } from "@/components/layout";
import { Breadcrumb } from "@/components/ui";
import { ProductCatalog } from "../../products/_components/ProductCatalog";
import { getCategory, getCategoryProducts } from "./_queries/category";
import { SubcategoryGrid } from "./_components/SubcategoryGrid";

type CategoryPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

const buildSlugsByLocale = (
  alternateSlugs: { locale: string; value: string }[],
) =>
  Object.fromEntries(
    alternateSlugs.map((alt) => [alt.locale.toLowerCase(), alt.value]),
  );

export const generateMetadata = async (
  props: CategoryPageProps,
): Promise<Metadata> => {
  const { locale, slug } = await props.params;
  const category = await getCategory(slug, locale);

  if (!category) return {};

  const slugsByLocale = buildSlugsByLocale(category.alternateSlugs ?? []);

  return {
    title: `${category.name} — Padelicense Shop`,
    description: category.description ?? undefined,
    alternates: {
      canonical: `/${locale}/categories/${slug}`,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((loc) => [
            loc,
            `/${loc}/categories/${slugsByLocale[loc] ?? slug}`,
          ]),
        ),
        "x-default": `/${routing.defaultLocale}/categories/${slugsByLocale[routing.defaultLocale] ?? slug}`,
      },
    },
    openGraph: {
      title: category.name,
      description: category.description ?? undefined,
      type: "website",
      locale,
    },
  };
};

const buildBreadcrumbItems = (
  category: {
    name: string;
    parent?: {
      name: string;
      slug: string;
      parent?: { name: string; slug: string } | null;
    } | null;
  },
  productsLabel: string,
) => {
  const items: { label: string; href?: string }[] = [
    { label: productsLabel, href: "/products" },
  ];

  if (category.parent?.parent) {
    items.push({
      label: category.parent.parent.name,
      href: `/categories/${category.parent.parent.slug}`,
    });
  }

  if (category.parent) {
    items.push({
      label: category.parent.name,
      href: `/categories/${category.parent.slug}`,
    });
  }

  items.push({ label: category.name });

  return items;
};

const CategoryPage = async (props: CategoryPageProps) => {
  const { locale, slug } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations("products");

  const [category, initialData] = await Promise.all([
    getCategory(slug, locale),
    getCategoryProducts(slug, locale),
  ]);

  if (!category) {
    notFound();
  }

  const alternateUrls = Object.fromEntries(
    (category.alternateSlugs ?? []).map((alt) => [
      alt.locale.toLowerCase(),
      `/categories/${alt.value}`,
    ]),
  );

  const subcategories = (category.subcategories ?? []).filter(
    (s): s is NonNullable<typeof s> => s != null,
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.description,
    url: `/${locale}/categories/${slug}`,
    numberOfItems: category.productsCount,
  };

  return (
    <main className="py-12 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AlternateUrlsSync urls={alternateUrls} />

      <Breadcrumb items={buildBreadcrumbItems(category, t("title"))} />

      <div>
        <h1 className="text-3xl font-bold text-foreground">{category.name}</h1>
        {category.description && (
          <p className="text-muted mt-2">{category.description}</p>
        )}
      </div>

      <SubcategoryGrid subcategories={subcategories} />

      <Suspense>
        <ProductCatalog
          initialProducts={initialData.products}
          initialHasNextPage={initialData.pageInfo.hasNextPage}
          categorySlug={slug}
        />
      </Suspense>
    </main>
  );
};

export default CategoryPage;
