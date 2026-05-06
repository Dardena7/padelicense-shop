import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CountrySelect } from "./CountrySelect";

const meta: Meta<typeof CountrySelect> = {
  title: "UI/CountrySelect",
  component: CountrySelect,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CountrySelect>;

export const Default: Story = {
  args: {
    label: "Country",
    id: "country",
    value: "",
    onChange: () => {},
  },
};

export const WithValue: Story = {
  args: {
    label: "Country",
    id: "country-value",
    value: "BE",
    onChange: () => {},
  },
};

export const Required: Story = {
  args: {
    label: "Country",
    id: "country-required",
    value: "",
    onChange: () => {},
    required: true,
  },
};
