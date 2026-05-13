import { AdminGuard, AdminSidebar, AdminHeader } from "./_components";

type AdminLayoutProps = {
  children: React.ReactNode;
};

const AdminLayout = (props: AdminLayoutProps) => {
  const { children } = props;

  return (
    <AdminGuard>
      <div className="flex min-h-screen flex-col">
        <AdminHeader />
        <div className="flex flex-1">
          <AdminSidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
};

export default AdminLayout;
