"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useDeleteProductImage } from "../../_hooks/useDeleteProductImage";

type ProductImage = {
  id: string;
  imageUrl: string;
  position: number;
};

type ImageGalleryProps = {
  images: ProductImage[];
  onImageDeleted: (imageId: string) => void;
  onReorder: (orderedIds: string[]) => void;
};

export const ImageGallery = (props: ImageGalleryProps) => {
  const { images, onImageDeleted, onReorder } = props;
  const t = useTranslations("admin.products");
  const { deleteImage, loading: deleting } = useDeleteProductImage();
  const [error, setError] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const draggedId = useRef<string | null>(null);

  const sorted = [...images].sort((a, b) => a.position - b.position);

  const handleDelete = async (imageId: string) => {
    if (!confirm(t("imageDeleteConfirm"))) return;
    setError(null);
    try {
      await deleteImage({ variables: { input: { imageId } } });
      onImageDeleted(imageId);
    } catch {
      setError(t("imageDeleteError"));
    }
  };

  const handleDragStart = (imageId: string) => {
    draggedId.current = imageId;
  };

  const handleDragOver = (e: React.DragEvent, imageId: string) => {
    e.preventDefault();
    setDragOverId(imageId);
  };

  const handleDrop = (targetId: string) => {
    const sourceId = draggedId.current;
    if (!sourceId || sourceId === targetId) {
      setDragOverId(null);
      draggedId.current = null;
      return;
    }

    const ids = sorted.map((img) => img.id);
    const sourceIndex = ids.indexOf(sourceId);
    const targetIndex = ids.indexOf(targetId);

    ids.splice(sourceIndex, 1);
    ids.splice(targetIndex, 0, sourceId);

    onReorder(ids);
    setDragOverId(null);
    draggedId.current = null;
  };

  const handleDragEnd = () => {
    setDragOverId(null);
    draggedId.current = null;
  };

  if (sorted.length === 0) return null;

  return (
    <div>
      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
      <div className="grid grid-cols-4 gap-3">
        {sorted.map((image) => (
          <div
            key={image.id}
            draggable
            onDragStart={() => handleDragStart(image.id)}
            onDragOver={(e) => handleDragOver(e, image.id)}
            onDrop={() => handleDrop(image.id)}
            onDragEnd={handleDragEnd}
            className={clsx(
              "group relative cursor-grab active:cursor-grabbing",
              {
                "ring-2 ring-blue-400 rounded-lg": dragOverId === image.id,
              },
            )}
          >
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={image.imageUrl}
                alt=""
                fill
                sizes="150px"
                className="object-cover pointer-events-none"
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
