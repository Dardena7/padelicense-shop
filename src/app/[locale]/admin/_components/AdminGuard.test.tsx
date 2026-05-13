import { screen } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import { render } from "@/test/render";
import { AdminGuard } from "./AdminGuard";

const mockReplace = vi.fn();

vi.mock("@/i18n/navigation", async () => {
  const actual =
    await vi.importActual<typeof import("@/i18n/navigation")>(
      "@/i18n/navigation",
    );
  return {
    ...actual,
    useRouter: () => ({ push: vi.fn(), replace: mockReplace }),
    usePathname: () => "/admin",
  };
});

const mockUseAuthContext = vi.fn();

vi.mock("@/lib/auth", () => ({
  useAuthContext: () => mockUseAuthContext(),
}));

describe("AdminGuard", () => {
  it("shows loading state while auth is loading", () => {
    mockUseAuthContext.mockReturnValue({ user: null, isLoading: true });

    render(
      <AdminGuard>
        <p>Admin content</p>
      </AdminGuard>,
    );

    expect(screen.queryByText("Admin content")).not.toBeInTheDocument();
  });

  it("redirects to login when user is not authenticated", () => {
    mockUseAuthContext.mockReturnValue({ user: null, isLoading: false });

    render(
      <AdminGuard>
        <p>Admin content</p>
      </AdminGuard>,
    );

    expect(mockReplace).toHaveBeenCalledWith("/login");
    expect(screen.queryByText("Admin content")).not.toBeInTheDocument();
  });

  it("shows unauthorized message for non-admin users", () => {
    mockUseAuthContext.mockReturnValue({
      user: { role: "CUSTOMER", firstName: "John", lastName: "Doe" },
      isLoading: false,
    });

    render(
      <AdminGuard>
        <p>Admin content</p>
      </AdminGuard>,
    );

    expect(
      screen.getByText("You must be an admin to access this page."),
    ).toBeInTheDocument();
    expect(screen.queryByText("Admin content")).not.toBeInTheDocument();
  });

  it("renders children for admin users", () => {
    mockUseAuthContext.mockReturnValue({
      user: { role: "ADMIN", firstName: "Admin", lastName: "User" },
      isLoading: false,
    });

    render(
      <AdminGuard>
        <p>Admin content</p>
      </AdminGuard>,
    );

    expect(screen.getByText("Admin content")).toBeInTheDocument();
  });
});
