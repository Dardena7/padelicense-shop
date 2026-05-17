"use client";

import { UseFormRegister } from "react-hook-form";
import { useTranslations } from "next-intl";
import { ProductStatus } from "@/gql/graphql";
import { Input, Select } from "@/components/ui";
import { useAdminCategories } from "../../_hooks/useAdminCategories";
import { PRODUCT_STATUSES, type ProductFormValues } from "./utils";
import { flattenCategories } from "../../_utils/categories";

type ProductFieldsProps = {
  register: UseFormRegister<ProductFormValues>;
  errors?: {
    categoryId?: { message?: string };
    basePriceCents?: { message?: string };
  };
};

export const ProductFields = (props: ProductFieldsProps) => {
  const { register, errors } = props;
  const t = useTranslations("admin.products");
  const { categories } = useAdminCategories();
  const categoryOptions = flattenCategories(categories);

  return (
    <div className="space-y-4">
      <Select
        id="categoryId"
        label={t("category")}
        error={errors?.categoryId?.message}
        {...register("categoryId")}
      >
        <option value="">{t("selectCategory")}</option>
        {categoryOptions.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </Select>

      <Input
        id="basePriceCents"
        type="number"
        label={t("basePrice")}
        error={errors?.basePriceCents?.message}
        {...register("basePriceCents", { valueAsNumber: true })}
      />

      <Input id="brand" label={t("brand")} {...register("brand")} />

      <Select id="status" label={t("status")} {...register("status")}>
        {PRODUCT_STATUSES.map((status) => (
          <option key={status} value={status}>
            {t(`statuses.${status}`)}
          </option>
        ))}
      </Select>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register("featured")} />
        {t("featured")}
      </label>
    </div>
  );
};
