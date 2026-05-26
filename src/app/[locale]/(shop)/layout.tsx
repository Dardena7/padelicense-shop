import { Navbar, Footer } from "@/components/layout";
import { CartProvider } from "@/lib/cart";
import { getNavCategories } from "./_queries/categories";
import { getLocale } from "next-intl/server";

type ShopLayoutProps = {
  children: React.ReactNode;
};

const ShopLayout = async (props: ShopLayoutProps) => {
  const { children } = props;
  const locale = await getLocale();

  let categories: Awaited<ReturnType<typeof getNavCategories>> = [];
  try {
    categories = await getNavCategories(locale);
  } catch {
    // Graceful degradation — navbar renders without category dropdown
  }

  return (
    <CartProvider>
      <Navbar categories={categories} />
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">{children}</div>
      <Footer />
    </CartProvider>
  );
};

export default ShopLayout;
