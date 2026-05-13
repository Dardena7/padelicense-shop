import { getTranslations } from "next-intl/server";

const AdminDashboardPage = async () => {
  const t = await getTranslations("admin.dashboard");

  return <h2 className="text-2xl font-bold">{t("title")}</h2>;
};

export default AdminDashboardPage;
