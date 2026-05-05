"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCartContext } from "@/lib/cart";
import { Button } from "../Button/Button";

type AddToCartActionProps = {
  productVariantId: string;
  inStock: boolean;
};

export const AddToCartAction = (props: AddToCartActionProps) => {
  const { productVariantId, inStock } = props;
  const t = useTranslations("common");
  const { addItem } = useCartContext();
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  if (!inStock) return null;

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

  return (
    <Button onClick={handleClick} disabled={isAdding} size="sm">
      {added ? t("itemAdded") : t("addToCart")}
    </Button>
  );
};
