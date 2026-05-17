"use client";

import { useTranslations } from "next-intl";
import { UseFormRegister } from "react-hook-form";
import { SupportedLocale } from "@/gql/graphql";
import { Input } from "@/components/ui";

type TranslationFieldsProps = {
  locale: SupportedLocale;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  errors?: {
    name?: { message?: string };
    slug?: { message?: string };
  };
  namePrefix: string;
  onNameChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const TranslationFields = (props: TranslationFieldsProps) => {
  const { locale, register, errors, namePrefix, onNameChange } = props;
  const t = useTranslations("admin.common");

  const nameField = register(`${namePrefix}.${locale}.name`);

  return (
    <div className="space-y-4">
      <Input
        id={`name-${locale}`}
        label={t("name")}
        error={errors?.name?.message}
        {...nameField}
        onChange={(e) => {
          nameField.onChange(e);
          onNameChange?.(e);
        }}
      />
      <Input
        id={`slug-${locale}`}
        label={t("slug")}
        error={errors?.slug?.message}
        {...register(`${namePrefix}.${locale}.slug`)}
      />
      <Input
        id={`description-${locale}`}
        label={t("description")}
        {...register(`${namePrefix}.${locale}.description`)}
      />
    </div>
  );
};
