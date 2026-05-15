"use client";

import { useTranslations } from "next-intl";
import { AccountTabs } from "./AccountTabs";
import { ProfileTab } from "./ProfileTab";
import { AddressesTab } from "./AddressesTab";
import { OrdersTab } from "./OrdersTab";

export const AccountContent = () => {
  const t = useTranslations("auth.account");
  const tAddresses = useTranslations("account.addresses");
  const tOrders = useTranslations("account.orders");

  return (
    <main className="w-full max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold text-foreground mb-8">{t("title")}</h1>

      <AccountTabs
        labels={[t("profile"), tAddresses("title"), tOrders("title")]}
      >
        <ProfileTab />
        <AddressesTab />
        <OrdersTab />
      </AccountTabs>
    </main>
  );
};
