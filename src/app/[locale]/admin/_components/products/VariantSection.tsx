"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui";
import { useCreateVariant } from "../../_hooks/useCreateVariant";
import { useUpdateVariant } from "../../_hooks/useUpdateVariant";
import { useDeleteVariant } from "../../_hooks/useDeleteVariant";
import { VariantRow } from "./VariantRow";
import { type AdminVariant } from "./utils";

const variantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().min(1, "SKU is required"),
  stockQuantity: z.number().int().min(0),
  priceCents: z.number().int().positive().nullable(),
});

type NewVariantValues = z.infer<typeof variantSchema>;

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
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: formErrors },
  } = useForm<NewVariantValues>({
    resolver: zodResolver(variantSchema),
    defaultValues: { name: "", sku: "", stockQuantity: 0, priceCents: null },
  });

  const onAdd = async (data: NewVariantValues) => {
    setError(null);
    try {
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
    } catch {
      setError(t("saveError"));
    }
  };

  const handleError = () => {
    setError(t("saveError"));
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      {error && (
        <p className="px-6 py-3 text-sm text-red-600">{error}</p>
      )}
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
                setError(null);
                try {
                  await updateVariant({
                    variables: {
                      input: { variantId: variant.id, attributes: data },
                    },
                  });
                } catch {
                  handleError();
                }
              }}
              onDelete={async () => {
                setError(null);
                try {
                  await deleteVariant({
                    variables: { input: { variantId: variant.id } },
                  });
                } catch {
                  handleError();
                }
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
                  error={formErrors.name?.message}
                  {...register("name")}
                />
              </td>
              <td className="px-4 py-2">
                <Input
                  id="new-sku"
                  placeholder={t("variantSku")}
                  error={formErrors.sku?.message}
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
