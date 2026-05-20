"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ImageUploader } from "./ImageUploader";
import { ImageGallery } from "./ImageGallery";
import { useReorderProductImages } from "../../_hooks/useReorderProductImages";

type ProductImage = {
  id: string;
  imageUrl: string;
  position: number;
};

type ImageSectionProps = {
  productId: string;
  images: ProductImage[];
};

export const ImageSection = (props: ImageSectionProps) => {
  const { productId, images: initialImages } = props;
  const t = useTranslations("admin.products");
  const [images, setImages] = useState(initialImages);
  const { reorderImages } = useReorderProductImages();

  const handleImageCreated = (image: ProductImage) => {
    setImages((prev) => [...prev, image]);
  };

  const handleImageDeleted = (imageId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleReorder = (orderedIds: string[]) => {
    setImages((prev) =>
      orderedIds.map((id, index) => {
        const img = prev.find((i) => i.id === id)!;
        return { ...img, position: index };
      }),
    );

    reorderImages({
      variables: { input: { productId, imageIds: orderedIds } },
    });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
      <h3 className="text-sm font-semibold">{t("images")}</h3>
      <ImageGallery
        images={images}
        onImageDeleted={handleImageDeleted}
        onReorder={handleReorder}
      />
      <ImageUploader
        productId={productId}
        onImageCreated={handleImageCreated}
      />
    </div>
  );
};
