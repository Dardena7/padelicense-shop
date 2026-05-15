"use client";

import { useTranslations, useLocale } from "next-intl";
import { formatPrice, formatDate } from "@/lib/utils";
import { useAdminOrder } from "../../_hooks/useAdminOrder";
import { useUpdateOrderStatus } from "../../_hooks/useUpdateOrderStatus";
import { StatusBadge } from "../";
import { StatusTransition } from "./StatusTransition";

type OrderDetailProps = {
  orderId: string;
};

export const OrderDetail = (props: OrderDetailProps) => {
  const { orderId } = props;
  const t = useTranslations("admin.orders");
  const locale = useLocale();
  const { order, loading } = useAdminOrder(orderId);
  const { updateStatus, loading: updating } = useUpdateOrderStatus();

  if (loading) {
    return <p className="text-gray-500">...</p>;
  }

  if (!order) {
    return <p className="text-red-600">{t("notFound")}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{order.number}</h2>
        <StatusBadge
          status={order.status}
          label={t(`statuses.${order.status}`)}
        />
      </div>

      <StatusTransition
        currentStatus={order.status}
        onTransition={(status) => updateStatus(orderId, status)}
        loading={updating}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold">{t("customer")}</h3>
          {order.user ? (
            <div className="space-y-1 text-sm">
              <p className="font-medium">
                {order.user.firstName} {order.user.lastName}
              </p>
              <p className="text-gray-500">{order.user.email}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">{order.guestEmail}</p>
          )}
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold">{t("shippingAddress")}</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p>{order.shippingAddressSnapshot.line1}</p>
            {order.shippingAddressSnapshot.line2 && (
              <p>{order.shippingAddressSnapshot.line2}</p>
            )}
            <p>
              {order.shippingAddressSnapshot.postal_code}{" "}
              {order.shippingAddressSnapshot.city}
            </p>
            <p>{order.shippingAddressSnapshot.country_iso}</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white">
        <h3 className="border-b border-gray-200 px-6 py-4 text-sm font-semibold">
          {t("lineItems")}
        </h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
              <th className="px-6 py-3 font-medium">{t("product")}</th>
              <th className="px-6 py-3 font-medium">{t("variant")}</th>
              <th className="px-6 py-3 font-medium">{t("unitPrice")}</th>
              <th className="px-6 py-3 font-medium">{t("quantity")}</th>
              <th className="px-6 py-3 font-medium">{t("subtotal")}</th>
            </tr>
          </thead>
          <tbody>
            {order.lineItems.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-50 last:border-0"
              >
                <td className="px-6 py-3 text-sm font-medium">
                  {item.productName}
                </td>
                <td className="px-6 py-3 text-sm text-gray-500">
                  {item.variantName}
                </td>
                <td className="px-6 py-3 text-sm">
                  {formatPrice(item.unitPriceCents, locale)}
                </td>
                <td className="px-6 py-3 text-sm">{item.quantity}</td>
                <td className="px-6 py-3 text-sm font-medium">
                  {formatPrice(item.unitPriceCents * item.quantity, locale)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t border-gray-200 px-6 py-4 text-right">
          <span className="text-sm text-gray-500">{t("total")}: </span>
          <span className="text-lg font-bold">
            {formatPrice(order.totalCents, locale)}
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-400">
        {t("createdAt")} {formatDate(order.createdAt, locale)}
      </p>
    </div>
  );
};
