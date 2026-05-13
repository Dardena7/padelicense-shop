"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuthContext } from "@/lib/auth";
import { UserRole } from "@/gql/graphql";

export const NavbarAuth = () => {
  const t = useTranslations("nav");
  const { user, isLoading } = useAuthContext();

  if (isLoading) return null;

  if (user) {
    return (
      <div className="flex items-center gap-4">
        {user.role === UserRole.Admin && (
          <Link
            href="/admin"
            className="text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            {t("admin")}
          </Link>
        )}
        <Link
          href="/account"
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          {t("account")}
        </Link>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="text-sm text-muted hover:text-foreground transition-colors"
    >
      {t("login")}
    </Link>
  );
};
