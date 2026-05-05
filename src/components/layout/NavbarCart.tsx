"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCartContext } from "@/lib/cart";
import { Badge } from "@/components/ui";

export const NavbarCart = () => {
  const t = useTranslations("nav");
  const { itemCount, isLoading } = useCartContext();

  if (isLoading) return null;

  return (
    <Link
      href="/cart"
      className="text-sm text-muted hover:text-foreground transition-colors flex items-center gap-1"
    >
      {t("cart")}
      {itemCount > 0 && <Badge variant="accent">{itemCount}</Badge>}
    </Link>
  );
};
