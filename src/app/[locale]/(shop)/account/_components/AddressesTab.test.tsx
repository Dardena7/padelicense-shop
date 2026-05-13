import { screen, fireEvent } from "@testing-library/react";
import { render } from "@/test/render";
import { describe, it, expect, vi } from "vitest";
import { AddressesTab } from "./AddressesTab";

const mockUseMyAddresses = vi.fn();
const mockCreateAddress = vi.fn();
const mockUpdateAddress = vi.fn();
const mockDeleteAddress = vi.fn();

vi.mock("@apollo/client/react", () => ({
  useApolloClient: () => ({
    cache: {
      identify: (obj: { id: string }) => obj.id,
      modify: vi.fn(),
    },
  }),
}));

vi.mock("../_hooks", () => ({
  useMyAddresses: () => mockUseMyAddresses(),
  useCreateAddress: () => ({
    createAddress: mockCreateAddress,
    loading: false,
  }),
  useUpdateAddress: () => ({
    updateAddress: mockUpdateAddress,
    loading: false,
  }),
  useDeleteAddress: () => ({
    deleteAddress: mockDeleteAddress,
    loading: false,
  }),
}));

describe("AddressesTab", () => {
  it("shows loading state", () => {
    mockUseMyAddresses.mockReturnValue({
      addresses: [],
      loading: true,
      refetch: vi.fn(),
    });

    render(<AddressesTab />);

    expect(screen.getByText("...")).toBeInTheDocument();
  });

  it("shows empty state", () => {
    mockUseMyAddresses.mockReturnValue({
      addresses: [],
      loading: false,
      refetch: vi.fn(),
    });

    render(<AddressesTab />);

    expect(screen.getByText("No addresses saved yet.")).toBeInTheDocument();
    expect(screen.getByText("Add address")).toBeInTheDocument();
  });

  it("renders addresses with country name and default badge", () => {
    mockUseMyAddresses.mockReturnValue({
      addresses: [
        {
          id: "addr-1",
          label: "Home",
          line1: "Rue de la Loi 1",
          line2: null,
          city: "Bruxelles",
          postalCode: "1000",
          countryIso: "BE",
          default: true,
        },
      ],
      loading: false,
      refetch: vi.fn(),
    });

    render(<AddressesTab />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Rue de la Loi 1")).toBeInTheDocument();
    expect(screen.getByText("1000 Bruxelles, Belgium")).toBeInTheDocument();
    expect(screen.getByText("Default")).toBeInTheDocument();

    const radio = screen.getByRole("radio") as HTMLInputElement;
    expect(radio.checked).toBe(true);
  });

  it("pre-selects the default address radio", () => {
    mockUseMyAddresses.mockReturnValue({
      addresses: [
        {
          id: "addr-1",
          label: "Home",
          line1: "Rue 1",
          line2: null,
          city: "Bruxelles",
          postalCode: "1000",
          countryIso: "BE",
          default: true,
        },
        {
          id: "addr-2",
          label: "Work",
          line1: "Rue 2",
          line2: null,
          city: "Bruxelles",
          postalCode: "1050",
          countryIso: "BE",
          default: false,
        },
      ],
      loading: false,
      refetch: vi.fn(),
    });

    render(<AddressesTab />);

    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    expect(radios[0].checked).toBe(true);
    expect(radios[1].checked).toBe(false);

    expect(screen.getByText("Default")).toBeInTheDocument();
    expect(screen.getByText("Set as default")).toBeInTheDocument();
  });

  it("shows address form when clicking add", () => {
    mockUseMyAddresses.mockReturnValue({
      addresses: [],
      loading: false,
      refetch: vi.fn(),
    });

    render(<AddressesTab />);

    fireEvent.click(screen.getByText("Add address"));

    expect(screen.getByLabelText("Address line 1")).toBeInTheDocument();
    expect(screen.getByLabelText("City")).toBeInTheDocument();
    expect(screen.getByLabelText("Country")).toBeInTheDocument();
  });

  it("shows edit form when clicking edit", () => {
    mockUseMyAddresses.mockReturnValue({
      addresses: [
        {
          id: "addr-1",
          label: null,
          line1: "Rue Test",
          line2: null,
          city: "Bruxelles",
          postalCode: "1000",
          countryIso: "BE",
          default: false,
        },
      ],
      loading: false,
      refetch: vi.fn(),
    });

    render(<AddressesTab />);

    fireEvent.click(screen.getByText("Edit"));

    const line1Input = screen.getByLabelText(
      "Address line 1",
    ) as HTMLInputElement;
    expect(line1Input.value).toBe("Rue Test");
  });
});
