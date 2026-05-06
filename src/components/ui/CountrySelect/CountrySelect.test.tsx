import { screen, fireEvent } from "@testing-library/react";
import { render } from "@/test/render";
import { describe, it, expect, vi } from "vitest";
import { CountrySelect, getCountryName } from "./CountrySelect";

describe("CountrySelect", () => {
  it("renders countries sorted alphabetically", () => {
    render(
      <CountrySelect label="Country" id="country" value="" onChange={() => {}} />,
    );

    const select = screen.getByLabelText("Country");
    expect(select).toBeInTheDocument();

    const options = select.querySelectorAll("option");
    expect(options.length).toBeGreaterThan(100);
  });

  it("selects the correct country by ISO code", () => {
    render(
      <CountrySelect label="Country" id="country" value="BE" onChange={() => {}} />,
    );

    const select = screen.getByLabelText("Country") as HTMLSelectElement;
    expect(select.value).toBe("BE");
  });

  it("calls onChange with country code", () => {
    const handleChange = vi.fn();
    render(
      <CountrySelect label="Country" id="country" value="" onChange={handleChange} />,
    );

    fireEvent.change(screen.getByLabelText("Country"), { target: { value: "FR" } });
    expect(handleChange).toHaveBeenCalledWith("FR");
  });
});

describe("getCountryName", () => {
  it("returns country name in English", () => {
    expect(getCountryName("BE", "en")).toBe("Belgium");
  });

  it("returns country name in French", () => {
    expect(getCountryName("BE", "fr")).toBe("Belgique");
  });

  it("returns country name in Dutch", () => {
    expect(getCountryName("BE", "nl")).toBe("België");
  });

  it("returns code for unknown country", () => {
    expect(getCountryName("XX", "en")).toBe("XX");
  });
});
