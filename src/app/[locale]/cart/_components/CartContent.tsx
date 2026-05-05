"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCartContext } from "@/lib/cart";
import { Button } from "@/components/ui";
import { CartItemRow } from "./CartItemRow";

const formatPrice = (cents: number, locale: string): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
};

export const CartContent = () => {
  const t = useTranslations("cart");
  const locale = useLocale();
  const { items, totalCents, isLoading } = useCartContext();

  if (isLoading) {
    return <p className="text-muted">...</p>;
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <p className="text-muted">{t("empty")}</p>
        <Link href="/products">
          <Button variant="outline">{t("continueShopping")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        {items.map((item) => (
          <CartItemRow key={item.id} item={item} />
        ))}
      </div>

      <div className="flex justify-between items-center border-t border-border pt-6">
        <p className="text-lg font-bold text-foreground">
          {t("total")}: {formatPrice(totalCents, locale)}
        </p>
        <Button size="lg" disabled>
          {t("checkout")}
        </Button>
      </div>
    </div>
  );
};
