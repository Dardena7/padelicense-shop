"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAuthContext } from "@/lib/auth";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui";
import { AccountTabs } from "./_components/AccountTabs";
import { AddressesTab } from "./_components/AddressesTab";
import { OrdersTab } from "./_components/OrdersTab";

const AccountPage = () => {
  const t = useTranslations("auth.account");
  const tAddresses = useTranslations("account.addresses");
  const tOrders = useTranslations("account.orders");
  const { user, isLoading, logout } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  if (isLoading || !user) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-muted">...</p>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold text-foreground mb-8">{t("title")}</h1>

      <div className="flex flex-col gap-6">
        <div className="border border-border rounded-xl p-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted uppercase tracking-wider mb-1">
                {t("name")}
              </p>
              <p className="font-medium text-foreground">
                {user.firstName} {user.lastName}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted uppercase tracking-wider mb-1">
                {t("email")}
              </p>
              <p className="font-medium text-foreground">{user.email}</p>
            </div>
          </div>
        </div>

        <AccountTabs labels={[tAddresses("title"), tOrders("title")]}>
          <AddressesTab />
          <OrdersTab />
        </AccountTabs>

        <Button variant="outline" onClick={handleLogout}>
          {t("logout")}
        </Button>
      </div>
    </main>
  );
};

export default AccountPage;
