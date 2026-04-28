import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "success", "danger", "accent"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: "New",
  },
};

export const Success: Story = {
  args: {
    children: "In stock",
    variant: "success",
  },
};

export const Danger: Story = {
  args: {
    children: "Out of stock",
    variant: "danger",
  },
};

export const Accent: Story = {
  args: {
    children: "Featured",
    variant: "accent",
  },
};
