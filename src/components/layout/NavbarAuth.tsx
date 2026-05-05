"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuthContext } from "@/lib/auth";

export const NavbarAuth = () => {
  const t = useTranslations("nav");
  const { user, isLoading } = useAuthContext();

  if (isLoading) return null;

  if (user) {
    return (
      <Link
        href="/account"
        className="text-sm text-muted hover:text-foreground transition-colors"
      >
        {t("account")}
      </Link>
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
