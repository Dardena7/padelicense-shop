"use client";

import { useTranslations } from "next-intl";
import { ImageUploader } from "./ImageUploader";
import { ImageGallery } from "./ImageGallery";

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
  const { productId, images } = props;
  const t = useTranslations("admin.products");

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
      <h3 className="text-sm font-semibold">{t("images")}</h3>
      <ImageGallery images={images} />
      <ImageUploader productId={productId} />
    </div>
  );
};
