"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useApolloClient } from "@apollo/client/react";
import {
  useMyAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
} from "../_hooks";
import { Button, AddressForm } from "@/components/ui";
import { getCountryName } from "@/components/ui/CountrySelect/getCountryName";

type AddressFormValues = {
  label: string;
  line1: string;
  line2: string;
  city: string;
  postalCode: string;
  countryIso: string;
};

export const AddressesTab = () => {
  const t = useTranslations("account.addresses");
  const locale = useLocale();
  const client = useApolloClient();

  const { addresses, loading, refetch } = useMyAddresses();
  const { createAddress } = useCreateAddress();
  const { updateAddress } = useUpdateAddress();
  const { deleteAddress } = useDeleteAddress();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleCreate = async (values: AddressFormValues) => {
    await createAddress({
      label: values.label || undefined,
      line1: values.line1,
      line2: values.line2 || undefined,
      city: values.city,
      postalCode: values.postalCode,
      countryIso: values.countryIso,
    });
    setShowForm(false);
    refetch();
  };

  const handleUpdate = async (addressId: string, values: AddressFormValues) => {
    await updateAddress(addressId, {
      label: values.label || undefined,
      line1: values.line1,
      line2: values.line2 || undefined,
      city: values.city,
      postalCode: values.postalCode,
      countryIso: values.countryIso,
    });
    setEditingId(null);
    refetch();
  };

  const handleSetDefault = async (addressId: string) => {
    const address = addresses.find((a) => a.id === addressId);
    if (!address || address.default) return;

    const currentDefault = addresses.find((a) => a.default);

    // Update cache immediately — no flicker
    if (currentDefault) {
      client.cache.modify({
        id: client.cache.identify({
          __typename: "Address",
          id: currentDefault.id,
        }),
        fields: { default: () => false },
      });
    }
    client.cache.modify({
      id: client.cache.identify({ __typename: "Address", id: addressId }),
      fields: { default: () => true },
    });

    // Confirm with server in background
    await updateAddress(addressId, {
      line1: address.line1,
      city: address.city,
      postalCode: address.postalCode,
      countryIso: address.countryIso,
      default: true,
    });
  };

  const handleDelete = async (addressId: string) => {
    if (!confirm(t("confirmDelete"))) return;

    await deleteAddress(addressId);
    refetch();
  };

  if (loading) {
    return <p className="text-muted">...</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {addresses.length === 0 && !showForm && (
        <p className="text-muted">{t("empty")}</p>
      )}

      {addresses.map((address) => {
        if (editingId === address.id) {
          return (
            <div
              key={address.id}
              className="border border-border rounded-xl p-4"
            >
              <AddressForm
                initialValues={{
                  label: address.label ?? "",
                  line1: address.line1,
                  line2: address.line2 ?? "",
                  city: address.city,
                  postalCode: address.postalCode,
                  countryIso: address.countryIso,
                }}
                onSubmit={(values) => handleUpdate(address.id, values)}
                onCancel={() => setEditingId(null)}
                submitLabel={t("save")}
              />
            </div>
          );
        }

        return (
          <div
            key={address.id}
            className={`border rounded-xl p-4 ${address.default ? "border-accent" : "border-border"}`}
          >
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="radio"
                  name="defaultAddress"
                  checked={address.default}
                  onChange={() => handleSetDefault(address.id)}
                />
                <span
                  className={
                    address.default ? "font-medium text-accent" : "text-muted"
                  }
                >
                  {address.default ? t("default") : t("setDefault")}
                </span>
              </label>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingId(address.id)}
                >
                  {t("edit")}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(address.id)}
                >
                  {t("delete")}
                </Button>
              </div>
            </div>
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
        );
      })}

      {showForm ? (
        <div className="border border-border rounded-xl p-4">
          <AddressForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
            submitLabel={t("save")}
          />
        </div>
      ) : (
        <Button variant="outline" onClick={() => setShowForm(true)}>
          {t("add")}
        </Button>
      )}
    </div>
  );
};
