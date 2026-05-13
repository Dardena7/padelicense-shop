type StatsCardProps = {
  label: string;
  value: string;
};

export const StatsCard = (props: StatsCardProps) => {
  const { label, value } = props;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
};
