import { screen } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import { render } from "@/test/render";
import { NavbarAuth } from "./NavbarAuth";

const mockUseAuthContext = vi.fn();

vi.mock("@/lib/auth", () => ({
  useAuthContext: () => mockUseAuthContext(),
}));

describe("NavbarAuth", () => {
  it("shows login link when not authenticated", () => {
    mockUseAuthContext.mockReturnValue({ user: null, isLoading: false });

    render(<NavbarAuth />);

    expect(screen.getByText("Log in")).toBeInTheDocument();
    expect(screen.queryByText("Account")).not.toBeInTheDocument();
  });

  it("shows account link for authenticated customer", () => {
    mockUseAuthContext.mockReturnValue({
      user: { role: "CUSTOMER", firstName: "John", lastName: "Doe" },
      isLoading: false,
    });

    render(<NavbarAuth />);

    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
  });

  it("shows admin link for admin users", () => {
    mockUseAuthContext.mockReturnValue({
      user: { role: "ADMIN", firstName: "Admin", lastName: "User" },
      isLoading: false,
    });

    render(<NavbarAuth />);

    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("Account")).toBeInTheDocument();
  });

  it("renders nothing while loading", () => {
    mockUseAuthContext.mockReturnValue({ user: null, isLoading: true });

    const { container } = render(<NavbarAuth />);

    expect(container.innerHTML).toBe("");
  });
});
