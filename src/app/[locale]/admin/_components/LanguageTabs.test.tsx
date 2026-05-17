import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { render } from "@/test/render";
import { SupportedLocale } from "@/gql/graphql";
import { LanguageTabs } from "./LanguageTabs";

const LOCALES = Object.values(SupportedLocale);

describe("LanguageTabs", () => {
  it("renders a tab for each locale", () => {
    render(<LanguageTabs>{() => null}</LanguageTabs>);

    LOCALES.forEach((locale) => {
      expect(screen.getByRole("button", { name: locale })).toBeInTheDocument();
    });
  });

  it("shows first locale content by default", () => {
    render(
      <LanguageTabs>{(locale) => <p>Content for {locale}</p>}</LanguageTabs>,
    );

    expect(screen.getByText(`Content for ${LOCALES[0]}`)).toBeInTheDocument();
  });

  it("switches locale on click", async () => {
    render(
      <LanguageTabs>{(locale) => <p>Content for {locale}</p>}</LanguageTabs>,
    );

    const secondLocale = LOCALES[1];
    await userEvent.click(screen.getByRole("button", { name: secondLocale }));

    expect(screen.getByText(`Content for ${secondLocale}`)).toBeInTheDocument();
  });
});
