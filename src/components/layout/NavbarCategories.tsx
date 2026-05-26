"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { type getNavCategories } from "@/app/[locale]/(shop)/_queries/categories";

type NavbarCategoriesProps = {
  categories: Awaited<ReturnType<typeof getNavCategories>>;
};

export const NavbarCategories = (props: NavbarCategoriesProps) => {
  const { categories } = props;
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  if (categories.length === 0) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="text-sm text-muted hover:text-foreground transition-colors"
        onClick={() => setOpen((prev) => !prev)}
      >
        {t("categories")}
      </button>

      {open && (
        <div className="absolute top-full left-0 pt-2 w-64 z-50">
          <div className="rounded-lg border border-border bg-white shadow-lg">
            <ul className="py-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-foreground-light transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {category.name}
                  </Link>
                  {category.subcategories.length > 0 && (
                    <ul>
                      {category.subcategories.map((sub) => (
                        <li key={sub.id}>
                          <Link
                            href={`/categories/${sub.slug}`}
                            className="block px-8 py-1.5 text-sm text-muted hover:text-foreground hover:bg-foreground-light transition-colors"
                            onClick={() => setOpen(false)}
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
