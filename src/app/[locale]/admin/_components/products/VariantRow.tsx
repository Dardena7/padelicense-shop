"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui";
import { type AdminVariant } from "./utils";

type VariantFormValues = {
  name: string;
  sku: string;
  stockQuantity: number;
  priceCents: number | null;
};

type VariantRowProps = {
  variant: AdminVariant;
  onUpdate: (data: VariantFormValues) => Promise<void>;
  onDelete: () => Promise<void>;
  loading: boolean;
};

export const VariantRow = (props: VariantRowProps) => {
  const { variant, onUpdate, onDelete, loading } = props;
  const t = useTranslations("admin.products");
  const [editing, setEditing] = useState(false);

  const { register, handleSubmit } = useForm<VariantFormValues>({
    defaultValues: {
      name: variant.name,
      sku: variant.sku,
      stockQuantity: variant.stockQuantity,
      priceCents: variant.priceCents ?? null,
    },
  });

  const onSubmit = async (data: VariantFormValues) => {
    await onUpdate(data);
    setEditing(false);
  };

  if (editing) {
    return (
      <tr>
        <td className="px-4 py-2">
          <Input id={`name-${variant.id}`} {...register("name")} />
        </td>
        <td className="px-4 py-2">
          <Input id={`sku-${variant.id}`} {...register("sku")} />
        </td>
        <td className="px-4 py-2">
          <Input
            id={`stock-${variant.id}`}
            type="number"
            {...register("stockQuantity", { valueAsNumber: true })}
          />
        </td>
        <td className="px-4 py-2">
          <Input
            id={`price-${variant.id}`}
            type="number"
            {...register("priceCents", { valueAsNumber: true })}
          />
        </td>
        <td className="px-4 py-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              className="text-sm text-blue-600 hover:underline disabled:opacity-50"
            >
              {t("variantSave")}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="text-sm text-gray-500 hover:underline"
            >
              {t("variantCancel")}
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-gray-50 last:border-0">
      <td className="px-4 py-3 text-sm">{variant.name}</td>
      <td className="px-4 py-3 text-sm text-gray-500">{variant.sku}</td>
      <td className="px-4 py-3 text-sm">{variant.stockQuantity}</td>
      <td className="px-4 py-3 text-sm">{variant.priceCents ?? "—"}</td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-sm text-blue-600 hover:underline"
          >
            {t("variantEdit")}
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={loading}
            className="text-sm text-red-600 hover:underline disabled:opacity-50"
          >
            {t("variantDelete")}
          </button>
        </div>
      </td>
    </tr>
  );
};
