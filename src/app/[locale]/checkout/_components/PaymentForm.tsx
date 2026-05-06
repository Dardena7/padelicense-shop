"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui";

type PaymentFormProps = {
  amount: string;
  onSuccess: () => void;
};

export const PaymentForm = (props: PaymentFormProps) => {
  const { amount, onSuccess } = props;
  const t = useTranslations("checkout");
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message ?? t("error"));
      setIsProcessing(false);
      return;
    }

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <PaymentElement />

      {error && <p className="text-danger text-sm">{error}</p>}

      <Button type="submit" size="lg" disabled={!stripe || isProcessing}>
        {isProcessing ? t("processing") : t("pay", { amount })}
      </Button>
    </form>
  );
};
