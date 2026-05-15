"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { OrderStatus } from "@/gql/graphql";
import { Link } from "@/i18n/navigation";
import { formatPrice, formatDate } from "@/lib/utils";
import { useAdminOrders } from "../../_hooks/useAdminOrders";
import { StatusBadge } from "../";
import { StatusFilter } from "./StatusFilter";

export const OrderList = () => {
  const t = useTranslations("admin.orders");
  const locale = useLocale();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>();
  const { orders, loading } = useAdminOrders(statusFilter);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t("title")}</h2>

      <StatusFilter value={statusFilter} onChange={setStatusFilter} />

      {loading ? (
        <p className="text-gray-500">...</p>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
                <th className="px-6 py-3 font-medium">{t("orderNumber")}</th>
                <th className="px-6 py-3 font-medium">{t("customer")}</th>
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
                  <td className="px-6 py-3 text-sm">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {order.number}
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {order.user
                      ? `${order.user.firstName} ${order.user.lastName}`
                      : order.guestEmail}
                  </td>
                  <td className="px-6 py-3">
                    <StatusBadge
                      status={order.status}
                      label={t(`statuses.${order.status}`)}
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
      )}
    </div>
  );
};
