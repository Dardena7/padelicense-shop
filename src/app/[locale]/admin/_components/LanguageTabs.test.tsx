import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";
import { render } from "@/test/render";
import { LanguageTabs } from "./LanguageTabs";

describe("LanguageTabs", () => {
  it("renders all locale tabs", () => {
    render(<LanguageTabs>{() => null}</LanguageTabs>);

    expect(screen.getByRole("button", { name: "EN" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "FR" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "NL" })).toBeInTheDocument();
  });

  it("shows EN content by default", () => {
    render(
      <LanguageTabs>{(locale) => <p>Content for {locale}</p>}</LanguageTabs>,
    );

    expect(screen.getByText("Content for EN")).toBeInTheDocument();
  });

  it("switches to FR on click", async () => {
    render(
      <LanguageTabs>{(locale) => <p>Content for {locale}</p>}</LanguageTabs>,
    );

    await userEvent.click(screen.getByRole("button", { name: "FR" }));

    expect(screen.getByText("Content for FR")).toBeInTheDocument();
  });
});
