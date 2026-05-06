import { getTranslations, setRequestLocale } from "next-intl/server";
import { CheckoutContent } from "./_components/CheckoutContent";

type CheckoutPageProps = {
  params: Promise<{ locale: string }>;
};

export const generateMetadata = async (props: CheckoutPageProps) => {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "checkout" });

  return {
    title: `${t("title")} — Padelicense Shop`,
    robots: { index: false },
  };
};

const CheckoutPage = async (props: CheckoutPageProps) => {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations("checkout");

  return (
    <main className="max-w-xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold text-foreground mb-8">{t("title")}</h1>
      <CheckoutContent />
    </main>
  );
};

export default CheckoutPage;
