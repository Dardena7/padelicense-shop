import { screen } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import { render } from "@/test/render";
import { AuthGuard } from "./AuthGuard";

const mockReplace = vi.fn();

vi.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: mockReplace }),
  usePathname: () => "/account",
}));

const mockUseAuthContext = vi.fn();

vi.mock("@/lib/auth", () => ({
  useAuthContext: () => mockUseAuthContext(),
}));

describe("AuthGuard", () => {
  it("shows loading state while auth is loading", () => {
    mockUseAuthContext.mockReturnValue({ user: null, isLoading: true });

    render(
      <AuthGuard>
        <p>Protected content</p>
      </AuthGuard>,
    );

    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });

  it("redirects to login when not authenticated", () => {
    mockUseAuthContext.mockReturnValue({ user: null, isLoading: false });

    render(
      <AuthGuard>
        <p>Protected content</p>
      </AuthGuard>,
    );

    expect(mockReplace).toHaveBeenCalledWith("/login");
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });

  it("renders children when authenticated", () => {
    mockUseAuthContext.mockReturnValue({
      user: { firstName: "John", lastName: "Doe" },
      isLoading: false,
    });

    render(
      <AuthGuard>
        <p>Protected content</p>
      </AuthGuard>,
    );

    expect(screen.getByText("Protected content")).toBeInTheDocument();
  });
});
