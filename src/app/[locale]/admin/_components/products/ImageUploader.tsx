"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useDirectUpload } from "../../_hooks/useDirectUpload";
import { useCreateProductImage } from "../../_hooks/useCreateProductImage";

type ProductImage = {
  id: string;
  imageUrl: string;
  position: number;
};

type ImageUploaderProps = {
  productId: string;
  onImageCreated: (image: ProductImage) => void;
};

export const ImageUploader = (props: ImageUploaderProps) => {
  const { productId, onImageCreated } = props;
  const t = useTranslations("admin.products");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { upload, uploading } = useDirectUpload();
  const { createImage } = useCreateProductImage();
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    try {
      const signedId = await upload(file);
      const result = await createImage({
        variables: {
          input: { productId, blobSignedId: signedId },
        },
      });

      const image = result.data?.adminCreateProductImage?.image;
      if (image) onImageCreated(image);
    } catch {
      setError(t("imageUploadError"));
    }

    // Reset input so the same file can be uploaded again
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div>
      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
      <label
        className={`inline-flex items-center gap-2 rounded-md border border-dashed border-gray-300 px-4 py-3 text-sm cursor-pointer hover:border-gray-400 transition-colors ${
          uploading ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        {uploading ? t("imageUploading") : t("imageAdd")}
      </label>
    </div>
  );
};
