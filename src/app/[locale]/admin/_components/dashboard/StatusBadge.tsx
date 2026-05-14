import { OrderStatus, ProductStatus } from "@/gql/graphql";

type StatusBadgeProps = {
  status: OrderStatus | ProductStatus;
};

const STATUS_COLORS: Record<OrderStatus | ProductStatus, string> = {
  [OrderStatus.Pending]: "bg-yellow-100 text-yellow-800",
  [OrderStatus.Paid]: "bg-blue-100 text-blue-800",
  [OrderStatus.Shipped]: "bg-purple-100 text-purple-800",
  [OrderStatus.Delivered]: "bg-green-100 text-green-800",
  [OrderStatus.Cancelled]: "bg-red-100 text-red-800",
  [ProductStatus.Active]: "bg-green-100 text-green-800",
  [ProductStatus.Draft]: "bg-gray-100 text-gray-800",
  [ProductStatus.Archived]: "bg-orange-100 text-orange-800",
};

export const StatusBadge = (props: StatusBadgeProps) => {
  const { status } = props;

  const colorClass = STATUS_COLORS[status] ?? "bg-gray-100 text-gray-800";

  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
    >
      {status}
    </span>
  );
};
