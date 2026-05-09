"use client";

import { useTranslations, useLocale } from "next-intl";
import { useMyOrders } from "../_hooks";
import { Badge } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import { OrderStatus } from "@/gql/graphql";

const statusVariant = (
  status: OrderStatus,
): "default" | "success" | "danger" | "accent" => {
  switch (status) {
    case OrderStatus.Paid:
      return "success";
    case OrderStatus.Shipped:
      return "accent";
    case OrderStatus.Delivered:
      return "success";
    case OrderStatus.Cancelled:
      return "danger";
    default:
      return "default";
  }
};

export const OrdersTab = () => {
  const t = useTranslations("account.orders");
  const locale = useLocale();

  const { orders, loading } = useMyOrders();

  if (loading) {
    return <p className="text-muted">...</p>;
  }

  if (orders.length === 0) {
    return <p className="text-muted">{t("empty")}</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="border border-border rounded-xl p-4 flex flex-col gap-3"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-foreground">
              {t("orderNumber", { number: order.number })}
            </h3>
            <Badge variant={statusVariant(order.status)}>
              {t(`statuses.${order.status}`)}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm text-muted">
            <p>
              {t("date")}:{" "}
              {new Intl.DateTimeFormat(locale).format(
                new Date(order.createdAt),
              )}
            </p>
            <p className="text-right">
              {t("total")}: {formatPrice(order.totalCents, locale)}
            </p>
          </div>

          <div className="border-t border-border pt-3">
            <p className="text-xs text-muted uppercase tracking-wider mb-2">
              {t("items")}
            </p>
            {order.lineItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-foreground">
                  {item.productName} — {item.variantName} x{item.quantity}
                </span>
                <span className="text-muted">
                  {formatPrice(item.unitPriceCents * item.quantity, locale)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
