"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAuthContext } from "@/lib/auth";
import { useRouter } from "@/i18n/navigation";
import { UserRole } from "@/gql/graphql";

type AdminGuardProps = {
  children: React.ReactNode;
};

export const AdminGuard = (props: AdminGuardProps) => {
  const { children } = props;
  const t = useTranslations("admin.guard");
  const { user, isLoading } = useAuthContext();
  const router = useRouter();

  const isAdmin = user?.role === UserRole.Admin;

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted">...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-red-600">{t("unauthorized")}</p>
      </div>
    );
  }

  return <>{children}</>;
};
