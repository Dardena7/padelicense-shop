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
import { Button } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import {
  useVerifyCart,
  useCreateUserOrder,
  useCreateGuestOrder,
} from "../_hooks";
import { useMyAddresses, useCreateAddress } from "../../account/_hooks";
import { PaymentForm } from "./PaymentForm";
import { CartIssues } from "./CartIssues";
import { GuestAddressForm } from "./GuestAddressForm";
import { UserAddressSelection } from "./UserAddressSelection";

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
  const {
    items,
    totalCents,
    isLoading: cartLoading,
    clearCart,
  } = useCartContext();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [orderUuid, setOrderUuid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );

  const {
    verifyCart,
    result: cartVerification,
    loading: verifyLoading,
  } = useVerifyCart();
  const { addresses, loading: addressesLoading } = useMyAddresses({
    skip: !user,
  });
  const { createAddress } = useCreateAddress();
  const { createUserOrder, loading: userOrderLoading } = useCreateUserOrder();
  const { createGuestOrder, loading: guestOrderLoading } =
    useCreateGuestOrder();

  const effectiveAddressId =
    selectedAddressId ??
    addresses.find((a) => a.default)?.id ??
    addresses[0]?.id ??
    null;

  const isCreatingOrder = userOrderLoading || guestOrderLoading;

  useEffect(() => {
    if (!cartLoading) {
      verifyCart();
    }
  }, [cartLoading, verifyCart]);

  const handleOrderCreated = (result: {
    clientSecret: string;
    order: { number: string; uuid: string };
  }) => {
    setClientSecret(result.clientSecret);
    setOrderNumber(result.order.number);
    setOrderUuid(result.order.uuid);
  };

  const handleUseAddress = async () => {
    if (!effectiveAddressId) return;
    setError(null);
    try {
      const result = await createUserOrder(effectiveAddressId);
      if (result) handleOrderCreated(result);
    } catch {
      setError(t("error"));
    }
  };

  const handleNewAddress = async (address: AddressValues) => {
    setError(null);
    try {
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
      if (result) handleOrderCreated(result);
    } catch {
      setError(t("error"));
    }
  };

  const handleGuestSubmit = async (email: string, address: AddressValues) => {
    setError(null);
    try {
      const result = await createGuestOrder(email, {
        line1: address.line1,
        line2: address.line2 || undefined,
        city: address.city,
        postalCode: address.postalCode,
        countryIso: address.countryIso,
      });
      if (result) handleOrderCreated(result);
    } catch {
      setError(t("error"));
    }
  };

  const handlePaymentSuccess = () => {
    clearCart();
    cartStorage.clearGuestUuid();
    router.push(
      `/checkout/confirmation?order=${orderNumber}&uuid=${orderUuid}`,
    );
  };

  if (cartLoading || verifyLoading) {
    return <p className="text-muted">...</p>;
  }

  if (cartVerification && !cartVerification.valid) {
    return <CartIssues issues={cartVerification.issues} />;
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

  if (!user) {
    return (
      <GuestAddressForm
        totalCents={totalCents}
        isCreatingOrder={isCreatingOrder}
        error={error}
        onSubmit={handleGuestSubmit}
      />
    );
  }

  if (addressesLoading) {
    return <p className="text-muted">...</p>;
  }

  return (
    <UserAddressSelection
      addresses={addresses}
      effectiveAddressId={effectiveAddressId}
      totalCents={totalCents}
      isCreatingOrder={isCreatingOrder}
      error={error}
      onSelectAddress={setSelectedAddressId}
      onUseAddress={handleUseAddress}
      onNewAddress={handleNewAddress}
    />
  );
};
