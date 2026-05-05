import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
  LocalizationProvider,
  useLocalizationContext,
} from "./localizationContext";

const TestConsumer = () => {
  const { alternateUrls, setAlternateUrls } = useLocalizationContext();

  return (
    <div>
      <p>URLs: {Object.keys(alternateUrls).length}</p>
      {Object.entries(alternateUrls).map(([locale, url]) => (
        <p key={locale}>
          {locale}: {url}
        </p>
      ))}
      <button
        onClick={() =>
          setAlternateUrls({
            en: "/products/balls",
            fr: "/products/balles",
          })
        }
      >
        Set URLs
      </button>
      <button onClick={() => setAlternateUrls({})}>Clear URLs</button>
    </div>
  );
};

describe("LocalizationContext", () => {
  it("starts with empty alternate urls", () => {
    render(
      <LocalizationProvider>
        <TestConsumer />
      </LocalizationProvider>,
    );

    expect(screen.getByText("URLs: 0")).toBeInTheDocument();
  });

  it("sets and reads alternate urls", () => {
    render(
      <LocalizationProvider>
        <TestConsumer />
      </LocalizationProvider>,
    );

    fireEvent.click(screen.getByText("Set URLs"));

    expect(screen.getByText("URLs: 2")).toBeInTheDocument();
    expect(screen.getByText("en: /products/balls")).toBeInTheDocument();
    expect(screen.getByText("fr: /products/balles")).toBeInTheDocument();
  });

  it("clears alternate urls", () => {
    render(
      <LocalizationProvider>
        <TestConsumer />
      </LocalizationProvider>,
    );

    fireEvent.click(screen.getByText("Set URLs"));
    expect(screen.getByText("URLs: 2")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Clear URLs"));
    expect(screen.getByText("URLs: 0")).toBeInTheDocument();
  });
});
