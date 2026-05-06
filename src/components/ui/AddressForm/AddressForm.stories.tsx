import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AddressForm } from "./AddressForm";

const meta: Meta<typeof AddressForm> = {
  title: "UI/AddressForm",
  component: AddressForm,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AddressForm>;

export const Empty: Story = {
  args: {
    onSubmit: async (values) => console.log("submit", values),
  },
};

export const WithInitialValues: Story = {
  args: {
    initialValues: {
      label: "Home",
      line1: "Rue de la Loi 1",
      line2: "",
      city: "Bruxelles",
      postalCode: "1000",
      countryIso: "BE",
    },
    onSubmit: async (values) => console.log("submit", values),
  },
};

export const WithCancel: Story = {
  args: {
    onSubmit: async (values) => console.log("submit", values),
    onCancel: () => console.log("cancel"),
    submitLabel: "Save",
  },
};

export const WithoutLabel: Story = {
  args: {
    showLabel: false,
    onSubmit: async (values) => console.log("submit", values),
    submitLabel: "Pay €50.00",
  },
};
