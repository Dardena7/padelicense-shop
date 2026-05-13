import { screen, fireEvent } from "@testing-library/react";
import { render } from "@/test/render";
import { describe, it, expect, vi } from "vitest";
import { ProfileTab } from "./ProfileTab";

const mockUser = {
  publicId: "1",
  email: "john@example.com",
  firstName: "John",
  lastName: "Doe",
  phone: "+32 470 123456",
  role: "customer",
};

const mockUpdateUser = vi.fn();
const mockUpdateProfile = vi.fn();

vi.mock("@/lib/auth", () => ({
  useAuthContext: () => ({
    user: mockUser,
    updateUser: mockUpdateUser,
    logout: vi.fn(),
  }),
}));

vi.mock("../_hooks", () => ({
  useUpdateProfile: () => ({
    updateProfile: mockUpdateProfile,
    loading: false,
  }),
}));

vi.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
}));

describe("ProfileTab", () => {
  it("displays user info and logout button", () => {
    render(<ProfileTab />);

    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("+32 470 123456")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Edit profile" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log out" })).toBeInTheDocument();
  });

  it("switches to edit mode with pre-filled inputs", () => {
    render(<ProfileTab />);

    fireEvent.click(screen.getByRole("button", { name: "Edit profile" }));

    expect(
      (screen.getByLabelText("First name") as HTMLInputElement).value,
    ).toBe("John");
    expect((screen.getByLabelText("Last name") as HTMLInputElement).value).toBe(
      "Doe",
    );
    expect((screen.getByLabelText("Email") as HTMLInputElement).value).toBe(
      "john@example.com",
    );
    expect((screen.getByLabelText("Phone") as HTMLInputElement).value).toBe(
      "+32 470 123456",
    );
  });

  it("cancels editing and restores original values", () => {
    render(<ProfileTab />);

    fireEvent.click(screen.getByRole("button", { name: "Edit profile" }));
    fireEvent.change(screen.getByLabelText("First name"), {
      target: { value: "Jane" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.queryByLabelText("First name")).not.toBeInTheDocument();
  });

  it("shows dash when phone is null", () => {
    mockUser.phone = null as unknown as string;
    render(<ProfileTab />);

    expect(screen.getByText("—")).toBeInTheDocument();
    mockUser.phone = "+32 470 123456";
  });
});
