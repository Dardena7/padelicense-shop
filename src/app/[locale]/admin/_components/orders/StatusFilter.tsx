"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import { OrderStatus } from "@/gql/graphql";

type StatusFilterProps = {
  value: OrderStatus | undefined;
  onChange: (status: OrderStatus | undefined) => void;
};

const STATUSES = [
  OrderStatus.Pending,
  OrderStatus.Paid,
  OrderStatus.Shipped,
  OrderStatus.Delivered,
  OrderStatus.Cancelled,
];

export const StatusFilter = (props: StatusFilterProps) => {
  const { value, onChange } = props;
  const t = useTranslations("admin.orders");

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onChange(undefined)}
        className={clsx("rounded-md px-3 py-1.5 text-sm", {
          "bg-gray-900 text-white": value === undefined,
          "bg-gray-100 text-gray-700 hover:bg-gray-200": value !== undefined,
        })}
      >
        {t("all")}
      </button>
      {STATUSES.map((status) => (
        <button
          key={status}
          type="button"
          onClick={() => onChange(status)}
          className={clsx("rounded-md px-3 py-1.5 text-sm", {
            "bg-gray-900 text-white": value === status,
            "bg-gray-100 text-gray-700 hover:bg-gray-200": value !== status,
          })}
        >
          {t(`statuses.${status}`)}
        </button>
      ))}
    </div>
  );
};
