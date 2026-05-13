"use client";

import { useTranslations } from "next-intl";

type Variant = {
  id: string;
  name: string;
  sku: string;
  stockQuantity: number;
  productName: string;
};

type LowStockAlertsProps = {
  variants: Variant[];
};

export const LowStockAlerts = (props: LowStockAlertsProps) => {
  const { variants } = props;
  const t = useTranslations("admin.dashboard");

  if (variants.length === 0) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <h3 className="border-b border-gray-200 px-6 py-4 text-sm font-semibold">
        {t("lowStock")}
      </h3>
      <ul className="divide-y divide-gray-50">
        {variants.map((variant) => (
          <li key={variant.id} className="flex items-center justify-between px-6 py-3">
            <div>
              <p className="text-sm font-medium">{variant.productName}</p>
              <p className="text-xs text-gray-500">
                {variant.name} — {variant.sku}
              </p>
            </div>
            <span
              className={`text-sm font-bold ${
                variant.stockQuantity === 0 ? "text-red-600" : "text-orange-500"
              }`}
            >
              {variant.stockQuantity}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
