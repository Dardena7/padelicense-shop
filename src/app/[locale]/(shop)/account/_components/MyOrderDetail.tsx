"use client";

import { useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useAuthContext } from "@/lib/auth";
import { useMyOrder } from "../_hooks";
import { Badge, type BadgeVariant } from "@/components/ui";
import { formatPrice, formatDate } from "@/lib/utils";
import { OrderStatus } from "@/gql/graphql";

const statusVariant = (status: OrderStatus): BadgeVariant => {
  switch (status) {
    case OrderStatus.Paid:
    case OrderStatus.Delivered:
      return "success";
    case OrderStatus.Shipped:
      return "accent";
    case OrderStatus.Cancelled:
      return "danger";
    default:
      return "default";
  }
};

type MyOrderDetailProps = {
  orderId: string;
};

export const MyOrderDetail = (props: MyOrderDetailProps) => {
  const { orderId } = props;
  const t = useTranslations("account.orders");
  const locale = useLocale();
  const { user, isLoading: authLoading } = useAuthContext();
  const router = useRouter();
  const { order, loading } = useMyOrder(orderId);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  if (authLoading || loading) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-muted">...</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-muted">{t("notFound")}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {t("orderNumber", { number: order.number })}
        </h1>
        <Badge variant={statusVariant(order.status)}>
          {t(`statuses.${order.status}`)}
        </Badge>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-border p-4">
          <h3 className="text-xs text-muted uppercase tracking-wider mb-3">
            {t("shippingAddress")}
          </h3>
          <div className="space-y-1 text-sm text-muted">
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

        <div className="rounded-xl border border-border p-4">
          <h3 className="text-xs text-muted uppercase tracking-wider mb-3">
            {t("items")}
          </h3>
          <div className="space-y-2">
            {order.lineItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.productName} — {item.variantName} x{item.quantity}
                </span>
                <span className="text-muted">
                  {formatPrice(item.unitPriceCents * item.quantity, locale)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-border mt-3 pt-3 flex justify-between font-medium">
            <span>{t("total")}</span>
            <span>{formatPrice(order.totalCents, locale)}</span>
          </div>
        </div>

        <p className="text-sm text-muted">
          {t("date")}: {formatDate(order.createdAt, locale)}
        </p>
      </div>
    </main>
  );
};
