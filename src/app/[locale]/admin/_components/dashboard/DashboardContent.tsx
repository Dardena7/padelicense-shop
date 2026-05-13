"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useAdminDashboard } from "../../_hooks/useAdminDashboard";
import { StatsCard } from "./StatsCard";
import { RecentOrdersTable } from "./RecentOrdersTable";
import { LowStockAlerts } from "./LowStockAlerts";

export const DashboardContent = () => {
  const t = useTranslations("admin.dashboard");
  const locale = useLocale();
  const { dashboard, loading } = useAdminDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">...</p>
      </div>
    );
  }

  if (!dashboard) return null;

  const formatPrice = (cents: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EUR",
    }).format(cents / 100);

  const totalOrders = dashboard.orderCountsByStatus.reduce(
    (sum, s) => sum + s.count,
    0,
  );

  const totalProducts = dashboard.productCountsByStatus.reduce(
    (sum, s) => sum + s.count,
    0,
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t("title")}</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label={t("revenueToday")} value={formatPrice(dashboard.revenueTodayCents)} />
        <StatsCard label={t("revenueWeek")} value={formatPrice(dashboard.revenueThisWeekCents)} />
        <StatsCard label={t("revenueMonth")} value={formatPrice(dashboard.revenueThisMonthCents)} />
        <StatsCard label={t("totalOrders")} value={String(totalOrders)} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashboard.orderCountsByStatus.map((s) => (
          <StatsCard key={s.status} label={s.status} value={String(s.count)} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentOrdersTable orders={dashboard.recentOrders} />
        </div>
        <div>
          <LowStockAlerts variants={dashboard.lowStockVariants} />
        </div>
      </div>
    </div>
  );
};
