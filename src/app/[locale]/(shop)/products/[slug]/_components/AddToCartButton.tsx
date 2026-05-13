"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCartContext } from "@/lib/cart";
import { Button } from "@/components/ui";

type AddToCartButtonProps = {
  productVariantId: string;
  inStock: boolean;
};

export const AddToCartButton = (props: AddToCartButtonProps) => {
  const { productVariantId, inStock } = props;
  const t = useTranslations("common");
  const { addItem } = useCartContext();
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleClick = async () => {
    setIsAdding(true);
    try {
      await addItem(productVariantId);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } finally {
      setIsAdding(false);
    }
  };

  if (!inStock) {
    return (
      <Button disabled size="lg">
        {t("outOfStock")}
      </Button>
    );
  }

  return (
    <Button onClick={handleClick} disabled={isAdding} size="lg">
      {added ? t("itemAdded") : t("addToCart")}
    </Button>
  );
};
