import { vi } from "vitest";
import messages from "../../../messages/en.json";

type Messages = Record<string, unknown>;

const getNestedValue = (obj: Messages, path: string): Messages => {
  return path.split(".").reduce((acc, key) => acc[key] as Messages, obj);
};

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn(
    async (namespace: string) => (key: string) =>
      getNestedValue(messages, namespace)[key],
  ),
  setRequestLocale: vi.fn(),
}));
