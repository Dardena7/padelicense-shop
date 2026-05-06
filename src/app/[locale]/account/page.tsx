"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAuthContext } from "@/lib/auth";
import { useRouter } from "@/i18n/navigation";
import { AccountTabs } from "./_components/AccountTabs";
import { ProfileTab } from "./_components/ProfileTab";
import { AddressesTab } from "./_components/AddressesTab";
import { OrdersTab } from "./_components/OrdersTab";

const AccountPage = () => {
  const t = useTranslations("auth.account");
  const tAddresses = useTranslations("account.addresses");
  const tOrders = useTranslations("account.orders");
  const { user, isLoading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-muted">...</p>
      </main>
    );
  }

  return (
    <main className="w-full max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold text-foreground mb-8">{t("title")}</h1>

      <AccountTabs labels={[t("profile"), tAddresses("title"), tOrders("title")]}>
        <ProfileTab />
        <AddressesTab />
        <OrdersTab />
      </AccountTabs>
    </main>
  );
};

export default AccountPage;
