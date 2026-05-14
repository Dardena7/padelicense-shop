import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { render } from "@/test/render";
import { StatsCard } from "./StatsCard";

describe("StatsCard", () => {
  it("renders label and value", () => {
    render(<StatsCard label="Revenue today" value="€150.00" />);

    expect(screen.getByText("Revenue today")).toBeInTheDocument();
    expect(screen.getByText("€150.00")).toBeInTheDocument();
  });
});
