"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { AddressForm } from "@/components/ui";
import { formatPrice } from "@/lib/utils";

type AddressValues = {
  label: string;
  line1: string;
  line2: string;
  city: string;
  postalCode: string;
  countryIso: string;
};

type GuestAddressFormProps = {
  totalCents: number;
  isCreatingOrder: boolean;
  error: string | null;
  onSubmit: (email: string, address: AddressValues) => Promise<void>;
};

export const GuestAddressForm = (props: GuestAddressFormProps) => {
  const { totalCents, isCreatingOrder, error, onSubmit } = props;
  const t = useTranslations("checkout");
  const locale = useLocale();

  const [guestEmail, setGuestEmail] = useState("");

  const handleSubmit = async (address: AddressValues) => {
    await onSubmit(guestEmail, address);
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-bold text-foreground">
        {t("shippingAddress")}
      </h2>

      <div className="mb-2">
        <label
          htmlFor="guestEmail"
          className="text-sm font-medium text-foreground block mb-1.5"
        >
          {t("email")}
        </label>
        <input
          id="guestEmail"
          type="email"
          value={guestEmail}
          onChange={(e) => setGuestEmail(e.target.value)}
          required
          className="w-full rounded-md border border-border px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
        />
      </div>

      <AddressForm
        showLabel={false}
        onSubmit={handleSubmit}
        submitLabel={
          isCreatingOrder
            ? t("processing")
            : t("pay", { amount: formatPrice(totalCents, locale) })
        }
      />

      {error && <p className="text-danger text-sm">{error}</p>}
    </div>
  );
};
