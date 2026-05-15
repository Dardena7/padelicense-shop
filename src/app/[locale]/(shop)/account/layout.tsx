import { AuthGuard } from "@/components/layout";

export const metadata = {
  robots: { index: false },
};

type AccountLayoutProps = {
  children: React.ReactNode;
};

const AccountLayout = (props: AccountLayoutProps) => {
  const { children } = props;

  return <AuthGuard>{children}</AuthGuard>;
};

export default AccountLayout;
