type StatusBadgeProps = {
  status: string;
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  active: "bg-green-100 text-green-800",
  draft: "bg-gray-100 text-gray-800",
  archived: "bg-orange-100 text-orange-800",
};

export const StatusBadge = (props: StatusBadgeProps) => {
  const { status } = props;

  const colorClass =
    STATUS_COLORS[status.toLowerCase()] ?? "bg-gray-100 text-gray-800";

  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
    >
      {status}
    </span>
  );
};
