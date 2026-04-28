import { render, RenderOptions } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "../../messages/en.json";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
};

const renderWithIntl = (ui: React.ReactElement, options?: RenderOptions) => {
  return render(ui, { wrapper: Wrapper, ...options });
};

export { renderWithIntl as render };
