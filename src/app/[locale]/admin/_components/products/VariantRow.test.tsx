import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { render } from "@/test/render";
import { type AdminVariant } from "./utils";
import { VariantRow } from "./VariantRow";

// --- Fixtures ---

const sampleVariant: AdminVariant = {
  id: "var-1",
  name: "Size M",
  sku: "RACK-001-M",
  stockQuantity: 25,
  priceCents: 15999,
} as AdminVariant;

const variantWithoutPrice: AdminVariant = {
  id: "var-2",
  name: "Size L",
  sku: "RACK-001-L",
  stockQuantity: 10,
  priceCents: null,
} as AdminVariant;

// --- Helpers ---

const renderInTable = (ui: React.ReactElement) =>
  render(
    <table>
      <tbody>{ui}</tbody>
    </table>,
  );

// --- Tests ---

describe("VariantRow", () => {
  let onUpdate: ReturnType<typeof vi.fn<() => Promise<void>>>;
  let onDelete: ReturnType<typeof vi.fn<() => Promise<void>>>;

  beforeEach(() => {
    onUpdate = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
    onDelete = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
  });

  it("displays variant name, sku, stock, and price", () => {
    renderInTable(
      <VariantRow
        variant={sampleVariant}
        onUpdate={onUpdate}
        onDelete={onDelete}
        loading={false}
      />,
    );

    expect(screen.getByText("Size M")).toBeInTheDocument();
    expect(screen.getByText("RACK-001-M")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("15999")).toBeInTheDocument();
  });

  it("displays a dash when priceCents is null", () => {
    renderInTable(
      <VariantRow
        variant={variantWithoutPrice}
        onUpdate={onUpdate}
        onDelete={onDelete}
        loading={false}
      />,
    );

    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("shows edit and delete buttons in view mode", () => {
    renderInTable(
      <VariantRow
        variant={sampleVariant}
        onUpdate={onUpdate}
        onDelete={onDelete}
        loading={false}
      />,
    );

    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("switches to edit mode when clicking Edit", async () => {
    renderInTable(
      <VariantRow
        variant={sampleVariant}
        onUpdate={onUpdate}
        onDelete={onDelete}
        loading={false}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Edit" }));

    // In edit mode, we see Save and Cancel buttons
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    // Edit/Delete buttons are no longer visible
    expect(
      screen.queryByRole("button", { name: "Edit" }),
    ).not.toBeInTheDocument();
  });

  it("returns to view mode when clicking Cancel", async () => {
    renderInTable(
      <VariantRow
        variant={sampleVariant}
        onUpdate={onUpdate}
        onDelete={onDelete}
        loading={false}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Edit" }));
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Save" }),
    ).not.toBeInTheDocument();
  });

  it("calls onUpdate with form data when Save is clicked", async () => {
    renderInTable(
      <VariantRow
        variant={sampleVariant}
        onUpdate={onUpdate}
        onDelete={onDelete}
        loading={false}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Edit" }));
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onUpdate).toHaveBeenCalledWith({
      name: "Size M",
      sku: "RACK-001-M",
      stockQuantity: 25,
      priceCents: 15999,
    });
  });

  it("calls onDelete when Delete is clicked", async () => {
    renderInTable(
      <VariantRow
        variant={sampleVariant}
        onUpdate={onUpdate}
        onDelete={onDelete}
        loading={false}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(onDelete).toHaveBeenCalledOnce();
  });

  it("disables delete button when loading", () => {
    renderInTable(
      <VariantRow
        variant={sampleVariant}
        onUpdate={onUpdate}
        onDelete={onDelete}
        loading={true}
      />,
    );

    expect(screen.getByRole("button", { name: "Delete" })).toBeDisabled();
  });

  it("disables save button when loading in edit mode", async () => {
    const { rerender } = renderInTable(
      <VariantRow
        variant={sampleVariant}
        onUpdate={onUpdate}
        onDelete={onDelete}
        loading={false}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Edit" }));

    // Re-render with loading=true to simulate a pending mutation
    rerender(
      <table>
        <tbody>
          <VariantRow
            variant={sampleVariant}
            onUpdate={onUpdate}
            onDelete={onDelete}
            loading={true}
          />
        </tbody>
      </table>,
    );

    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("returns to view mode after successful save", async () => {
    renderInTable(
      <VariantRow
        variant={sampleVariant}
        onUpdate={onUpdate}
        onDelete={onDelete}
        loading={false}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Edit" }));
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    // After save resolves, should return to view mode
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
  });
});
