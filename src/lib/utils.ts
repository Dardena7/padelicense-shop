export function nonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

export const formatPrice = (cents: number, locale: string): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
};

export const formatDate = (iso: string, locale: string): string => {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
};

export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const buildSlugsByLocale = (
  alternateSlugs: { locale: string; value: string }[],
): Record<string, string> =>
  Object.fromEntries(
    alternateSlugs.map((alt) => [alt.locale.toLowerCase(), alt.value]),
  );

type CategoryWithParents = {
  name: string;
  slug: string;
  parent?: {
    name: string;
    slug: string;
    parent?: { name: string; slug: string } | null;
  } | null;
};

export const buildCategoryBreadcrumb = (
  category: CategoryWithParents,
): { label: string; href?: string }[] => {
  const items: { label: string; href?: string }[] = [];

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

  items.push({
    label: category.name,
    href: `/categories/${category.slug}`,
  });

  return items;
};
