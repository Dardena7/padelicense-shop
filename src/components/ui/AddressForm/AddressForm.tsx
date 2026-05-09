"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { Input, Button } from "@/components/ui";

const CountrySelect = dynamic(
  () => import("@/components/ui/CountrySelect/CountrySelect").then((m) => m.CountrySelect),
  { loading: () => <select className="w-full rounded-md border border-border px-3 py-2" disabled><option>...</option></select> },
);

type AddressFormValues = {
  label: string;
  line1: string;
  line2: string;
  city: string;
  postalCode: string;
  countryIso: string;
};

type AddressFormProps = {
  initialValues?: Partial<AddressFormValues>;
  onSubmit: (values: AddressFormValues) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  showLabel?: boolean;
};

export const AddressForm = (props: AddressFormProps) => {
  const { initialValues, onSubmit, onCancel, submitLabel, showLabel = true } = props;
  const t = useTranslations("checkout");

  const [values, setValues] = useState<AddressFormValues>({
    label: initialValues?.label ?? "",
    line1: initialValues?.line1 ?? "",
    line2: initialValues?.line2 ?? "",
    city: initialValues?.city ?? "",
    postalCode: initialValues?.postalCode ?? "",
    countryIso: initialValues?.countryIso ?? "BE",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof AddressFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {showLabel && (
        <Input
          id="label"
          label={t("label")}
          value={values.label}
          onChange={(e) => handleChange("label", e.target.value)}
        />
      )}
      <Input
        id="line1"
        label={t("line1")}
        value={values.line1}
        onChange={(e) => handleChange("line1", e.target.value)}
        required
      />
      <Input
        id="line2"
        label={t("line2")}
        value={values.line2}
        onChange={(e) => handleChange("line2", e.target.value)}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="city"
          label={t("city")}
          value={values.city}
          onChange={(e) => handleChange("city", e.target.value)}
          required
        />
        <Input
          id="postalCode"
          label={t("postalCode")}
          value={values.postalCode}
          onChange={(e) => handleChange("postalCode", e.target.value)}
          required
        />
      </div>
      <CountrySelect
        id="countryIso"
        label={t("country")}
        value={values.countryIso}
        onChange={(code) => handleChange("countryIso", code)}
        required
      />
      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {submitLabel ?? t("payment")}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            {t("backToCart")}
          </Button>
        )}
      </div>
    </form>
  );
};
