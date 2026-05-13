import { Navbar, Footer } from "@/components/layout";

type ShopLayoutProps = {
  children: React.ReactNode;
};

const ShopLayout = (props: ShopLayoutProps) => {
  const { children } = props;

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default ShopLayout;
