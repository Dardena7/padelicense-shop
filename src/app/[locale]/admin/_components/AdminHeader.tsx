"use client";

import { useTranslations } from "next-intl";
import { useAuthContext } from "@/lib/auth";
import { useRouter } from "@/i18n/navigation";

export const AdminHeader = () => {
  const t = useTranslations("admin.header");
  const { user, logout } = useAuthContext();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
      <h1 className="text-lg font-bold">{t("title")}</h1>
      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm text-gray-600">
            {user.firstName} {user.lastName}
          </span>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          {t("logout")}
        </button>
      </div>
    </header>
  );
};
