import { render } from "@/test/render";
import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { LocalizationProvider } from "@/lib/localization";

const mockReplace = vi.fn();

vi.mock("next-intl", () => ({
  useLocale: () => "en",
}));

vi.mock("@/i18n/routing", () => ({
  routing: { locales: ["en", "fr", "nl"] },
}));

vi.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => "/products/head-speed-pro",
}));

const renderWithLocalization = (alternateUrls: Record<string, string> = {}) => {
  const Wrapper = (props: { children: React.ReactNode }) => {
    return (
      <LocalizationProvider>
        <SetUrls urls={alternateUrls} />
        {props.children}
      </LocalizationProvider>
    );
  };

  return render(<LocaleSwitcher />, { wrapper: Wrapper });
};

// Helper to set alternate urls in context
import { useEffect } from "react";
import { useLocalizationContext } from "@/lib/localization";

const SetUrls = (props: { urls: Record<string, string> }) => {
  const { setAlternateUrls } = useLocalizationContext();
  useEffect(() => {
    setAlternateUrls(props.urls);
  }, [props.urls, setAlternateUrls]);
  return null;
};

describe("LocaleSwitcher", () => {
  beforeEach(() => {
    mockReplace.mockClear();
  });

  it("renders all locale buttons", () => {
    renderWithLocalization();

    expect(screen.getByText("EN")).toBeInTheDocument();
    expect(screen.getByText("FR")).toBeInTheDocument();
    expect(screen.getByText("NL")).toBeInTheDocument();
  });

  it("switches locale using pathname when no alternate urls", () => {
    renderWithLocalization();

    fireEvent.click(screen.getByText("FR"));

    expect(mockReplace).toHaveBeenCalledWith("/products/head-speed-pro", {
      locale: "fr",
    });
  });

  it("switches locale using alternate url when available", () => {
    renderWithLocalization({
      en: "/products/head-pro-s-balls",
      fr: "/products/head-pro-s-balles",
      nl: "/products/head-pro-s-ballen",
    });

    fireEvent.click(screen.getByText("FR"));

    expect(mockReplace).toHaveBeenCalledWith("/products/head-pro-s-balles", {
      locale: "fr",
    });
  });
});
