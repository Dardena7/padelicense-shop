import { getTranslations } from "next-intl/server";

const AdminProductsPage = async () => {
  const t = await getTranslations("admin.products");

  return <h2 className="text-2xl font-bold">{t("title")}</h2>;
};

export default AdminProductsPage;
