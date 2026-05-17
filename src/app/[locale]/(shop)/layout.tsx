import { Navbar, Footer } from "@/components/layout";
import { CartProvider } from "@/lib/cart";

type ShopLayoutProps = {
  children: React.ReactNode;
};

const ShopLayout = (props: ShopLayoutProps) => {
  const { children } = props;

  return (
    <CartProvider>
      <Navbar />
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">{children}</div>
      <Footer />
    </CartProvider>
  );
};

export default ShopLayout;
