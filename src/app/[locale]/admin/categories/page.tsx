import { getTranslations } from "next-intl/server";

const AdminCategoriesPage = async () => {
  const t = await getTranslations("admin.categories");

  return <h2 className="text-2xl font-bold">{t("title")}</h2>;
};

export default AdminCategoriesPage;
