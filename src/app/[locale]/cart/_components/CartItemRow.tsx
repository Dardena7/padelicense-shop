"use client";

import { useTranslations, useLocale } from "next-intl";
import { useCartContext } from "@/lib/cart";
import { Button } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import type { GetCartQuery } from "@/gql/graphql";

type CartItemRowProps = {
  item: NonNullable<GetCartQuery["cart"]>["items"][number];
};

export const CartItemRow = (props: CartItemRowProps) => {
  const { item } = props;
  const t = useTranslations("cart");
  const locale = useLocale();
  const { updateItem, removeItem } = useCartContext();
  const variant = item.productVariant;

  return (
    <div
      data-testid="cart-item"
      className="flex items-center gap-4 py-4 border-b border-border"
    >
      <div className="flex-1">
        <p data-testid="cart-item-name" className="font-medium text-foreground">
          {variant.product.name}
          {variant.name !== "Default" && ` — ${variant.name}`}
        </p>
        <p className="text-sm text-muted">
          {formatPrice(variant.effectivePrice, locale)}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          data-testid={`cart-item-decrease-${item.id}`}
          onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
          disabled={item.quantity <= 1}
        >
          -
        </Button>
        <span
          data-testid="cart-item-quantity"
          className="w-8 text-center text-sm font-medium"
        >
          {item.quantity}
        </span>
        <Button
          variant="outline"
          size="sm"
          data-testid={`cart-item-increase-${item.id}`}
          onClick={() => updateItem(item.id, item.quantity + 1)}
        >
          +
        </Button>
      </div>

      <p className="w-24 text-right font-medium text-foreground">
        {formatPrice(variant.effectivePrice * item.quantity, locale)}
      </p>

      <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
        {t("remove")}
      </Button>
    </div>
  );
};
