"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui";

const ConfirmationDetails = () => {
  const t = useTranslations("confirmation");
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  return (
    <main className="max-w-xl mx-auto px-6 py-12 text-center">
      <h1 className="text-2xl font-bold text-foreground mb-4">{t("title")}</h1>

      {orderNumber && (
        <p className="text-lg text-foreground mb-4">
          {t("orderNumber", { number: orderNumber })}
        </p>
      )}

      <p className="text-muted mb-8">{t("thankYou")}</p>

      <Link href="/products">
        <Button variant="outline">{t("continueShopping")}</Button>
      </Link>
    </main>
  );
};

export const ConfirmationContent = () => {
  return (
    <Suspense fallback={<p className="text-muted text-center py-12">...</p>}>
      <ConfirmationDetails />
    </Suspense>
  );
};
