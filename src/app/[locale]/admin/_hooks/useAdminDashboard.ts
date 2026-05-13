import { useQuery } from "@apollo/client/react";
import { graphql } from "@/gql";

const ADMIN_DASHBOARD_QUERY = graphql(`
  query AdminDashboard {
    adminDashboard {
      orderCountsByStatus {
        status
        count
      }
      productCountsByStatus {
        status
        count
      }
      revenueTodayCents
      revenueThisWeekCents
      revenueThisMonthCents
      recentOrders {
        id
        number
        status
        totalCents
        createdAt
      }
      lowStockVariants {
        id
        name
        sku
        stockQuantity
        productName
      }
    }
  }
`);

export const useAdminDashboard = () => {
  const { data, loading } = useQuery(ADMIN_DASHBOARD_QUERY);

  return { dashboard: data?.adminDashboard ?? null, loading };
};
