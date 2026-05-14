import { OrderDetail } from "../../_components/orders";

type AdminOrderPageProps = {
  params: Promise<{ id: string }>;
};

const AdminOrderPage = async (props: AdminOrderPageProps) => {
  const { id } = await props.params;

  return <OrderDetail orderId={id} />;
};

export default AdminOrderPage;
