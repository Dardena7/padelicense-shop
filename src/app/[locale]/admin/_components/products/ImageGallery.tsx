"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useDeleteProductImage } from "../../_hooks/useDeleteProductImage";

type ProductImage = {
  id: string;
  imageUrl: string;
  position: number;
};

type ImageGalleryProps = {
  images: ProductImage[];
};

export const ImageGallery = (props: ImageGalleryProps) => {
  const { images } = props;
  const t = useTranslations("admin.products");
  const { deleteImage, loading: deleting } = useDeleteProductImage();
  const [error, setError] = useState<string | null>(null);

  const sorted = [...images].sort((a, b) => a.position - b.position);

  const handleDelete = async (imageId: string) => {
    if (!confirm(t("imageDeleteConfirm"))) return;
    setError(null);
    try {
      await deleteImage({ variables: { input: { imageId } } });
    } catch {
      setError(t("imageDeleteError"));
    }
  };

  if (sorted.length === 0) return null;

  return (
    <div>
      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
      <div className="grid grid-cols-4 gap-3">
        {sorted.map((image) => (
          <div key={image.id} className="group relative">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={image.imageUrl}
                alt=""
                fill
                sizes="150px"
                className="object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => handleDelete(image.id)}
              disabled={deleting}
              className="absolute top-1 right-1 rounded-full bg-red-600 text-white w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
