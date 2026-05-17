"use client";

import { useState } from "react";
import clsx from "clsx";
import { useTranslations, useLocale } from "next-intl";
import { Badge } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "./AddToCartButton";

type Variant = {
  id: string;
  name: string;
  effectivePrice: number;
  stockQuantity: number;
};

type ProductDetailsProps = {
  name: string;
  brand?: string | null;
  description?: string | null;
  basePriceCents: number;
  featured: boolean;
  variants: Variant[];
};

export const ProductDetails = (props: ProductDetailsProps) => {
  const { name, brand, description, basePriceCents, featured, variants } =
    props;
  const t = useTranslations("common");
  const tProducts = useTranslations("products");
  const locale = useLocale();

  const [selectedVariant, setSelectedVariant] = useState<Variant>(variants[0]);

  const displayPrice = selectedVariant?.effectivePrice ?? basePriceCents;
  const inStock = selectedVariant ? selectedVariant.stockQuantity > 0 : false;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        {brand && (
          <p className="text-sm font-medium uppercase tracking-wider text-muted">
            {brand}
          </p>
        )}
        <h1 className="text-3xl font-bold text-foreground">{name}</h1>
        <div className="flex gap-2">
          {featured && <Badge variant="accent">{t("featured")}</Badge>}
          {!inStock && <Badge variant="danger">{t("outOfStock")}</Badge>}
        </div>
      </div>

      <p className="text-3xl font-bold text-foreground">
        {formatPrice(displayPrice, locale)}
      </p>

      {description && (
        <p className="text-muted leading-relaxed">{description}</p>
      )}

      {variants.length > 1 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-foreground">
            {tProducts("variants")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => setSelectedVariant(variant)}
                className={clsx(
                  "rounded-lg border px-4 py-2 text-sm transition-colors",
                  selectedVariant?.id === variant.id
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:border-gray-400",
                )}
              >
                <span className="font-medium">{variant.name}</span>
                {variant.effectivePrice !== basePriceCents && (
                  <span className="ml-2 text-xs opacity-75">
                    {formatPrice(variant.effectivePrice, locale)}
                  </span>
                )}
                {variant.stockQuantity === 0 && (
                  <span className="ml-2">
                    <Badge variant="danger">{t("outOfStock")}</Badge>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedVariant && (
        <AddToCartButton
          productVariantId={selectedVariant.id}
          inStock={inStock}
        />
      )}
    </div>
  );
};
