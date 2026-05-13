"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

const NAV_ITEMS = [
  { key: "dashboard", href: "/admin" },
  { key: "products", href: "/admin/products" },
  { key: "categories", href: "/admin/categories" },
  { key: "orders", href: "/admin/orders" },
] as const;

export const AdminSidebar = () => {
  const t = useTranslations("admin.sidebar");
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-gray-200 bg-gray-50 p-4">
      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`block rounded-md px-3 py-2 text-sm font-medium ${
                isActive
                  ? "bg-gray-900 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              {t(item.key)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
