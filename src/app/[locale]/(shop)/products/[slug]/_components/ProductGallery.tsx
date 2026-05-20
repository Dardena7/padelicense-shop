"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { useTranslations } from "next-intl";

type GalleryImage = {
  imageUrl: string;
  altText?: string | null;
  position: number;
};

type ProductGalleryProps = {
  images: GalleryImage[];
  productName: string;
};

export const ProductGallery = (props: ProductGalleryProps) => {
  const { images, productName } = props;
  const t = useTranslations("common");

  const sorted = [...images].sort((a, b) => a.position - b.position);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = sorted[selectedIndex];

  if (sorted.length === 0) {
    return (
      <div className="relative aspect-square bg-foreground-light rounded-xl overflow-hidden">
        <div className="flex items-center justify-center h-full text-muted">
          {t("noImageAvailable")}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-square bg-foreground-light rounded-xl overflow-hidden">
        <Image
          src={selectedImage.imageUrl}
          alt={selectedImage.altText || productName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {sorted.length > 1 && (
        <div className="flex gap-2">
          {sorted.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={clsx(
                "relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors",
                selectedIndex === index
                  ? "border-foreground"
                  : "border-transparent hover:border-gray-300",
              )}
            >
              <Image
                src={image.imageUrl}
                alt={image.altText || productName}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
