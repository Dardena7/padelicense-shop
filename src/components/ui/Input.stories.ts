import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Input from "./Input";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: "Enter your email",
  },
};

export const WithLabel: Story = {
  args: {
    label: "Email",
    id: "email",
    type: "email",
    placeholder: "john@example.com",
  },
};

export const Password: Story = {
  args: {
    label: "Password",
    id: "password",
    type: "password",
    placeholder: "••••••••",
  },
};

export const WithError: Story = {
  args: {
    label: "Email",
    id: "email-error",
    type: "email",
    value: "invalid-email",
    error: "Please enter a valid email address",
  },
};

export const Disabled: Story = {
  args: {
    label: "Email",
    id: "email-disabled",
    value: "john@example.com",
    disabled: true,
  },
};

export const Search: Story = {
  args: {
    type: "search",
    placeholder: "Search products...",
  },
};
