"use client";

import { useTranslations, useLocale } from "next-intl";
import { AdminDashboardQuery } from "@/gql/graphql";
import { formatPrice, formatDate } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";

type RecentOrdersTableProps = {
  orders: AdminDashboardQuery["adminDashboard"]["recentOrders"];
};

export const RecentOrdersTable = (props: RecentOrdersTableProps) => {
  const { orders } = props;
  const t = useTranslations("admin.dashboard");
  const tStatus = useTranslations("admin.orders.statuses");
  const locale = useLocale();

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <h3 className="border-b border-gray-200 px-6 py-4 text-sm font-semibold">
        {t("recentOrders")}
      </h3>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
            <th className="px-6 py-3 font-medium">{t("orderNumber")}</th>
            <th className="px-6 py-3 font-medium">{t("status")}</th>
            <th className="px-6 py-3 font-medium">{t("total")}</th>
            <th className="px-6 py-3 font-medium">{t("date")}</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b border-gray-50 last:border-0"
            >
              <td className="px-6 py-3 text-sm font-medium">{order.number}</td>
              <td className="px-6 py-3">
                <StatusBadge
                  status={order.status}
                  label={tStatus(order.status)}
                />
              </td>
              <td className="px-6 py-3 text-sm">
                {formatPrice(order.totalCents, locale)}
              </td>
              <td className="px-6 py-3 text-sm text-gray-500">
                {formatDate(order.createdAt, locale)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
