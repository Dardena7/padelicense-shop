import { getTranslations, setRequestLocale } from "next-intl/server";
import { CartContent } from "./_components/CartContent";

type CartPageProps = {
  params: Promise<{ locale: string }>;
};

export const generateMetadata = async (props: CartPageProps) => {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "cart" });

  return {
    title: `${t("title")} — Padelicense Shop`,
    robots: { index: false },
  };
};

const CartPage = async (props: CartPageProps) => {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations("cart");

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold text-foreground mb-8">{t("title")}</h1>
      <CartContent />
    </main>
  );
};

export default CartPage;
