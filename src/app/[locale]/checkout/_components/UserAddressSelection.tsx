"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button, AddressForm } from "@/components/ui";
import { getCountryName } from "@/components/ui/CountrySelect/getCountryName";
import { formatPrice } from "@/lib/utils";
import type { GetMyAddressesQuery } from "@/gql/graphql";

type Address = NonNullable<GetMyAddressesQuery["me"]>["addresses"][number];

type AddressValues = {
  label: string;
  line1: string;
  line2: string;
  city: string;
  postalCode: string;
  countryIso: string;
};

type UserAddressSelectionProps = {
  addresses: Address[];
  effectiveAddressId: string | null;
  totalCents: number;
  isCreatingOrder: boolean;
  error: string | null;
  onSelectAddress: (addressId: string) => void;
  onUseAddress: () => Promise<void>;
  onNewAddress: (address: AddressValues) => Promise<void>;
};

export const UserAddressSelection = (props: UserAddressSelectionProps) => {
  const {
    addresses,
    effectiveAddressId,
    totalCents,
    isCreatingOrder,
    error,
    onSelectAddress,
    onUseAddress,
    onNewAddress,
  } = props;
  const t = useTranslations("checkout");
  const locale = useLocale();

  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-bold text-foreground">
        {t("shippingAddress")}
      </h2>

      {addresses.length > 0 && !showNewAddressForm && (
        <>
          <div className="flex flex-col gap-3">
            {addresses.map((address) => (
              <label
                key={address.id}
                className={`border rounded-xl p-4 cursor-pointer transition-colors ${
                  effectiveAddressId === address.id
                    ? "border-accent bg-accent/5"
                    : "border-border hover:border-accent/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="address"
                    checked={effectiveAddressId === address.id}
                    onChange={() => onSelectAddress(address.id)}
                    className="mt-1"
                  />
                  <div>
                    {address.label && (
                      <p className="text-sm font-medium text-foreground">
                        {address.label}
                      </p>
                    )}
                    <p className="text-sm text-muted">{address.line1}</p>
                    {address.line2 && (
                      <p className="text-sm text-muted">{address.line2}</p>
                    )}
                    <p className="text-sm text-muted">
                      {address.postalCode} {address.city},{" "}
                      {getCountryName(address.countryIso, locale)}
                    </p>
                  </div>
                </div>
              </label>
            ))}
          </div>

          <div className="flex gap-3">
            <Button onClick={onUseAddress} disabled={isCreatingOrder}>
              {isCreatingOrder ? t("processing") : t("useThisAddress")}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowNewAddressForm(true)}
            >
              {t("newAddress")}
            </Button>
          </div>
        </>
      )}

      {(addresses.length === 0 || showNewAddressForm) && (
        <>
          {addresses.length > 0 && (
            <p className="text-sm text-muted">{t("orNewAddress")}</p>
          )}
          <AddressForm
            showLabel={false}
            onSubmit={onNewAddress}
            onCancel={
              addresses.length > 0
                ? () => setShowNewAddressForm(false)
                : undefined
            }
            submitLabel={
              isCreatingOrder
                ? t("processing")
                : t("pay", { amount: formatPrice(totalCents, locale) })
            }
          />
        </>
      )}

      {error && <p className="text-danger text-sm">{error}</p>}
    </div>
  );
};
