import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

export const revalidate = 3600;

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/graphql";

type ProductNode = {
  slug: string;
  alternateSlugs: { locale: string; value: string }[];
};

type CategoryNode = {
  slug: string;
  alternateSlugs: { locale: string; value: string }[];
};

const fetchProducts = async (): Promise<ProductNode[]> => {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `{
          products(first: 100) {
            nodes {
              slug
              alternateSlugs { locale value }
            }
          }
        }`,
      }),
    });
    const json = await res.json();
    return json.data?.products?.nodes?.filter(Boolean) ?? [];
  } catch {
    return [];
  }
};

const fetchCategories = async (): Promise<CategoryNode[]> => {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `{
          categories {
            slug
            alternateSlugs { locale value }
          }
        }`,
      }),
    });
    const json = await res.json();
    return json.data?.categories?.filter(Boolean) ?? [];
  } catch {
    return [];
  }
};

const buildAlternates = (
  path: string,
  alternateSlugs?: { locale: string; value: string }[],
) => {
  const slugsByLocale = Object.fromEntries(
    (alternateSlugs ?? []).map((alt) => [alt.locale.toLowerCase(), alt.value]),
  );

  return {
    languages: Object.fromEntries(
      routing.locales.map((loc) => {
        const slug = slugsByLocale[loc];
        const localizedPath = slug ? path.replace(/[^/]+$/, slug) : path;
        return [loc, `${BASE_URL}/${loc}${localizedPath}`];
      }),
    ),
  };
};

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const [products] = await Promise.all([fetchProducts(), fetchCategories()]);

  const staticPages = ["", "/products"].flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      alternates: buildAlternates(path),
      lastModified: new Date(),
    })),
  );

  const productPages = products.flatMap((product) =>
    routing.locales.map((locale) => {
      const slugsByLocale = Object.fromEntries(
        product.alternateSlugs.map((alt) => [
          alt.locale.toLowerCase(),
          alt.value,
        ]),
      );
      const slug = slugsByLocale[locale] ?? product.slug;

      return {
        url: `${BASE_URL}/${locale}/products/${slug}`,
        alternates: buildAlternates(
          `/products/${slug}`,
          product.alternateSlugs,
        ),
        lastModified: new Date(),
      };
    }),
  );

  return [...staticPages, ...productPages];
};

export default sitemap;
