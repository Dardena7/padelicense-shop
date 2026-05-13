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
      {children}
      <Footer />
    </CartProvider>
  );
};

export default ShopLayout;
