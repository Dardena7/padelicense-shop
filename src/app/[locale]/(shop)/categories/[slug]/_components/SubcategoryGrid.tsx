import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Subcategory = {
  name: string;
  slug: string;
  description?: string | null;
  productsCount: number;
};

type SubcategoryGridProps = {
  subcategories: Subcategory[];
};

export const SubcategoryGrid = (props: SubcategoryGridProps) => {
  const { subcategories } = props;
  const t = useTranslations("categories");

  if (subcategories.length === 0) return null;

  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground mb-4">
        {t("subcategories")}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {subcategories.map((sub) => (
          <Link
            key={sub.slug}
            href={`/categories/${sub.slug}`}
            className="rounded-lg border border-border p-4 hover:border-foreground transition-colors"
          >
            <h3 className="font-medium text-foreground">{sub.name}</h3>
            {sub.description && (
              <p className="text-sm text-muted mt-1 line-clamp-2">
                {sub.description}
              </p>
            )}
            <p className="text-xs text-muted mt-2">
              {t("productsCount", { count: sub.productsCount })}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};
