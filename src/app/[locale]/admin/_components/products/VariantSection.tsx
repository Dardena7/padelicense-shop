"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui";
import { useCreateVariant } from "../../_hooks/useCreateVariant";
import { useUpdateVariant } from "../../_hooks/useUpdateVariant";
import { useDeleteVariant } from "../../_hooks/useDeleteVariant";
import { VariantRow } from "./VariantRow";
import { type AdminVariant } from "./utils";

type NewVariantValues = {
  name: string;
  sku: string;
  stockQuantity: number;
  priceCents: number | null;
};

type VariantSectionProps = {
  productId: string;
  variants: AdminVariant[];
};

export const VariantSection = (props: VariantSectionProps) => {
  const { productId, variants } = props;
  const t = useTranslations("admin.products");
  const [adding, setAdding] = useState(false);

  const { createVariant, loading: creating } = useCreateVariant();
  const { updateVariant, loading: updating } = useUpdateVariant();
  const { deleteVariant, loading: deleting } = useDeleteVariant();

  const { register, handleSubmit, reset } = useForm<NewVariantValues>({
    defaultValues: { name: "", sku: "", stockQuantity: 0, priceCents: null },
  });

  const onAdd = async (data: NewVariantValues) => {
    await createVariant({
      variables: {
        input: {
          productId,
          attributes: data,
        },
      },
    });
    reset();
    setAdding(false);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h3 className="text-sm font-semibold">{t("variants")}</h3>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="text-sm text-blue-600 hover:underline"
          >
            {t("addVariant")}
          </button>
        )}
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
            <th className="px-4 py-2 font-medium">{t("variantName")}</th>
            <th className="px-4 py-2 font-medium">{t("variantSku")}</th>
            <th className="px-4 py-2 font-medium">{t("variantStock")}</th>
            <th className="px-4 py-2 font-medium">{t("variantPrice")}</th>
            <th className="px-4 py-2 font-medium" />
          </tr>
        </thead>
        <tbody>
          {variants.map((variant) => (
            <VariantRow
              key={variant.id}
              variant={variant}
              onUpdate={async (data) => {
                await updateVariant({
                  variables: {
                    input: { variantId: variant.id, attributes: data },
                  },
                });
              }}
              onDelete={async () => {
                await deleteVariant({
                  variables: { input: { variantId: variant.id } },
                });
              }}
              loading={updating || deleting}
            />
          ))}
          {adding && (
            <tr>
              <td className="px-4 py-2">
                <Input
                  id="new-name"
                  placeholder={t("variantName")}
                  {...register("name")}
                />
              </td>
              <td className="px-4 py-2">
                <Input
                  id="new-sku"
                  placeholder={t("variantSku")}
                  {...register("sku")}
                />
              </td>
              <td className="px-4 py-2">
                <Input
                  id="new-stock"
                  type="number"
                  placeholder={t("variantStock")}
                  {...register("stockQuantity", { valueAsNumber: true })}
                />
              </td>
              <td className="px-4 py-2">
                <Input
                  id="new-price"
                  type="number"
                  placeholder={t("variantPrice")}
                  {...register("priceCents", { valueAsNumber: true })}
                />
              </td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSubmit(onAdd)}
                    disabled={creating}
                    className="text-sm text-blue-600 hover:underline disabled:opacity-50"
                  >
                    {t("variantSave")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdding(false)}
                    className="text-sm text-gray-500 hover:underline"
                  >
                    {t("variantCancel")}
                  </button>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
