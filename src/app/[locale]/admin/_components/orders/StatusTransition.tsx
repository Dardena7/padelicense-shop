"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import { OrderStatus } from "@/gql/graphql";

type StatusTransitionProps = {
  currentStatus: OrderStatus;
  onTransition: (status: OrderStatus) => void;
  loading: boolean;
};

const TRANSITIONS: Partial<Record<OrderStatus, OrderStatus[]>> = {
  [OrderStatus.Pending]: [OrderStatus.Cancelled],
  [OrderStatus.Paid]: [OrderStatus.Shipped, OrderStatus.Cancelled],
  [OrderStatus.Shipped]: [OrderStatus.Delivered, OrderStatus.Cancelled],
};

export const StatusTransition = (props: StatusTransitionProps) => {
  const { currentStatus, onTransition, loading } = props;
  const t = useTranslations("admin.orders");

  const allowedTransitions = TRANSITIONS[currentStatus];

  if (!allowedTransitions) return null;

  return (
    <div className="flex gap-2">
      {allowedTransitions.map((status) => (
        <button
          key={status}
          type="button"
          disabled={loading}
          onClick={() => onTransition(status)}
          className={clsx(
            "rounded-md px-3 py-1.5 text-sm font-medium disabled:opacity-50",
            status === OrderStatus.Cancelled
              ? "bg-red-100 text-red-700 hover:bg-red-200"
              : "bg-blue-100 text-blue-700 hover:bg-blue-200",
          )}
        >
          {t(`transitionTo.${status}`)}
        </button>
      ))}
    </div>
  );
};
