import { Atkinson_Hyperlegible } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ApolloClientProvider } from "@/lib/apollo";
import { LocalizationProvider } from "@/lib/localization";
import { AuthProvider } from "@/lib/auth";
import { CartProvider } from "@/lib/cart";
import "./globals.css";

const atkinson = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
});

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export const generateStaticParams = () => {
  return routing.locales.map((locale) => ({ locale }));
};

export const generateMetadata = async (props: LayoutProps) => {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "metadata.home" });

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001",
    ),
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ...Object.fromEntries(routing.locales.map((loc) => [loc, `/${loc}`])),
        "x-default": `/${routing.defaultLocale}`,
      },
    },
  };
};

const LocaleLayout = async (props: LayoutProps) => {
  const { children } = props;
  const { locale } = await props.params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${atkinson.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <ApolloClientProvider>
            <AuthProvider>
              <LocalizationProvider>
                <CartProvider>{children}</CartProvider>
              </LocalizationProvider>
            </AuthProvider>
          </ApolloClientProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default LocaleLayout;
