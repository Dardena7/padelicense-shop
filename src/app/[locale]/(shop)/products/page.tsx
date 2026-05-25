import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ProductCatalog } from "./_components/ProductCatalog";
import { getInitialProducts } from "./_queries/products";
import { getNavCategories } from "../_queries/categories";

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
  const [initialData, navCategories] = await Promise.all([
    getInitialProducts(locale),
    getNavCategories(locale),
  ]);

  const categories = navCategories.flatMap((cat) => [
    { slug: cat.slug, name: cat.name },
    ...cat.subcategories.map((sub) => ({ slug: sub.slug, name: sub.name })),
  ]);

  return (
    <main className="py-12">
      <h1 className="text-3xl font-bold text-foreground mb-8">{t("title")}</h1>

      <Suspense>
        <ProductCatalog
          initialProducts={initialData.products}
          initialHasNextPage={initialData.pageInfo.hasNextPage}
          categories={categories}
        />
      </Suspense>
    </main>
  );
};

export default ProductsPage;
