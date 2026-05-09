"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Elements } from "@stripe/react-stripe-js";
import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import { useAuthContext } from "@/lib/auth";
import { useCartContext } from "@/lib/cart";
import { cartStorage } from "@/lib/cart/storage";
import { stripePromise } from "@/lib/stripe";
import { Button, AddressForm, getCountryName } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import { useVerifyCart, useCreateUserOrder, useCreateGuestOrder } from "../_hooks";
import { useMyAddresses, useCreateAddress } from "../../account/_hooks";
import { PaymentForm } from "./PaymentForm";

type AddressValues = {
  label: string;
  line1: string;
  line2: string;
  city: string;
  postalCode: string;
  countryIso: string;
};

export const CheckoutContent = () => {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const router = useRouter();
  const { user } = useAuthContext();
  const { items, totalCents, isLoading: cartLoading, clearCart } = useCartContext();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [orderUuid, setOrderUuid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [guestEmail, setGuestEmail] = useState("");
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  // Derive the effective selected address: manual selection, or default, or first
  
  const { verifyCart, result: cartVerification, loading: verifyLoading } = useVerifyCart();
  const { addresses, loading: addressesLoading } = useMyAddresses({ skip: !user });
  const { createAddress } = useCreateAddress();
  const { createUserOrder, loading: userOrderLoading } = useCreateUserOrder();
  const { createGuestOrder, loading: guestOrderLoading } = useCreateGuestOrder();
  
  const effectiveAddressId = selectedAddressId
    ?? addresses.find((a) => a.default)?.id
    ?? addresses[0]?.id
    ?? null;
    
  const isCreatingOrder = userOrderLoading || guestOrderLoading;

  useEffect(() => {
    if (!cartLoading) {
      verifyCart();
    }
  }, [cartLoading, verifyCart]);


  const hasIssues = cartVerification && !cartVerification.valid;

  const handleSelectAddress = async () => {
    if (!effectiveAddressId) return;
    setError(null);

    try {
      const result = await createUserOrder(effectiveAddressId);
      if (result) {
        setClientSecret(result.clientSecret);
        setOrderNumber(result.order.number);
        setOrderUuid(result.order.uuid);
      }
    } catch {
      setError(t("error"));
    }
  };

  const handleNewAddressSubmit = async (address: AddressValues) => {
    setError(null);

    try {
      if (user) {
        const addressResult = await createAddress({
          line1: address.line1,
          line2: address.line2 || undefined,
          city: address.city,
          postalCode: address.postalCode,
          countryIso: address.countryIso,
        });

        const addressId = addressResult.data?.createAddress?.address?.id;
        if (!addressId) return;

        const result = await createUserOrder(addressId);
        if (result) {
          setClientSecret(result.clientSecret);
          setOrderNumber(result.order.number);
          setOrderUuid(result.order.uuid);
        }
      } else {
        const result = await createGuestOrder(guestEmail, {
          line1: address.line1,
          line2: address.line2 || undefined,
          city: address.city,
          postalCode: address.postalCode,
          countryIso: address.countryIso,
        });

        if (result) {
          setClientSecret(result.clientSecret);
          setOrderNumber(result.order.number);
          setOrderUuid(result.order.uuid);
        }
      }
    } catch {
      setError(t("error"));
    }
  };

  const handlePaymentSuccess = () => {
    clearCart();
    cartStorage.clearGuestUuid();
    router.push(`/checkout/confirmation?order=${orderNumber}&uuid=${orderUuid}`);
  };

  if (cartLoading || verifyLoading) {
    return <p className="text-muted">...</p>;
  }

  if (hasIssues) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-danger font-medium">{t("cartIssues")}</p>
        <ul className="flex flex-col gap-2">
          {cartVerification.issues.map((issue, i) => (
            <li key={i} className="text-sm text-danger">
              {issue.type === "EMPTY_CART" && t("emptyCart")}
              {issue.type === "PRODUCT_UNAVAILABLE" &&
                t("productUnavailable", { name: issue.productName ?? "" })}
              {issue.type === "INSUFFICIENT_STOCK" &&
                t("insufficientStock", {
                  name: issue.productName ?? "",
                  available: issue.available ?? 0,
                  requested: issue.requested ?? 0,
                })}
            </li>
          ))}
        </ul>
        <Link href="/cart">
          <Button variant="outline">{t("backToCart")}</Button>
        </Link>
      </div>
    );
  }

  if (clientSecret) {
    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-lg font-bold text-foreground">{t("payment")}</h2>
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm
            amount={formatPrice(totalCents, locale)}
            onSuccess={handlePaymentSuccess}
          />
        </Elements>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <p className="text-muted">{t("emptyCart")}</p>
        <Link href="/products">
          <Button variant="outline">{t("backToCart")}</Button>
        </Link>
      </div>
    );
  }

  // Guest checkout — email + address form
  if (!user) {
    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-lg font-bold text-foreground">{t("shippingAddress")}</h2>

        <div className="mb-2">
          <label htmlFor="guestEmail" className="text-sm font-medium text-foreground block mb-1.5">
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
          onSubmit={handleNewAddressSubmit}
          submitLabel={isCreatingOrder ? t("processing") : t("pay", { amount: formatPrice(totalCents, locale) })}
        />

        {error && <p className="text-danger text-sm">{error}</p>}
      </div>
    );
  }

  // User checkout — select saved address or add new
  if (addressesLoading) {
    return <p className="text-muted">...</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-bold text-foreground">{t("shippingAddress")}</h2>

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
                    onChange={() => setSelectedAddressId(address.id)}
                    className="mt-1"
                  />
                  <div>
                    {address.label && (
                      <p className="text-sm font-medium text-foreground">{address.label}</p>
                    )}
                    <p className="text-sm text-muted">{address.line1}</p>
                    {address.line2 && <p className="text-sm text-muted">{address.line2}</p>}
                    <p className="text-sm text-muted">
                      {address.postalCode} {address.city}, {getCountryName(address.countryIso, locale)}
                    </p>
                  </div>
                </div>
              </label>
            ))}
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSelectAddress} disabled={isCreatingOrder}>
              {isCreatingOrder ? t("processing") : t("useThisAddress")}
            </Button>
            <Button variant="outline" onClick={() => setShowNewAddressForm(true)}>
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
            onSubmit={handleNewAddressSubmit}
            onCancel={addresses.length > 0 ? () => setShowNewAddressForm(false) : undefined}
            submitLabel={isCreatingOrder ? t("processing") : t("pay", { amount: formatPrice(totalCents, locale) })}
          />
        </>
      )}

      {error && <p className="text-danger text-sm">{error}</p>}
    </div>
  );
};
