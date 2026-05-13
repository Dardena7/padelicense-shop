import { getTranslations } from "next-intl/server";

const AdminOrdersPage = async () => {
  const t = await getTranslations("admin.orders");

  return <h2 className="text-2xl font-bold">{t("title")}</h2>;
};

export default AdminOrdersPage;
