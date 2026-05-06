import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Select } from "./Select";

describe("Select", () => {
  it("renders with label", () => {
    render(
      <Select label="Country" id="country">
        <option value="BE">Belgium</option>
      </Select>,
    );

    expect(screen.getByLabelText("Country")).toBeInTheDocument();
  });

  it("renders options", () => {
    render(
      <Select>
        <option value="BE">Belgium</option>
        <option value="FR">France</option>
      </Select>,
    );

    expect(screen.getByText("Belgium")).toBeInTheDocument();
    expect(screen.getByText("France")).toBeInTheDocument();
  });

  it("triggers onChange", () => {
    const handleChange = vi.fn();
    render(
      <Select onChange={handleChange}>
        <option value="">Choose</option>
        <option value="BE">Belgium</option>
      </Select>,
    );

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "BE" } });
    expect(handleChange).toHaveBeenCalledOnce();
  });

  it("displays error message", () => {
    render(
      <Select error="Required field">
        <option value="">Choose</option>
      </Select>,
    );

    expect(screen.getByText("Required field")).toBeInTheDocument();
  });
});
