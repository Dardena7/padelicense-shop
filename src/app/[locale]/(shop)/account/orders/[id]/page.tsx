import { MyOrderDetail } from "../../_components/MyOrderDetail";

export const metadata = {
  robots: { index: false },
};

type OrderPageProps = {
  params: Promise<{ id: string }>;
};

const OrderPage = async (props: OrderPageProps) => {
  const { id } = await props.params;

  return <MyOrderDetail orderId={id} />;
};

export default OrderPage;
