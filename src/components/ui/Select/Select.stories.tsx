import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Select } from "./Select";

const meta: Meta<typeof Select> = {
  title: "UI/Select",
  component: Select,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: () => (
    <Select>
      <option value="">Choose...</option>
      <option value="a">Option A</option>
      <option value="b">Option B</option>
    </Select>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <Select label="Country" id="country">
      <option value="">Choose...</option>
      <option value="BE">Belgium</option>
      <option value="FR">France</option>
      <option value="NL">Netherlands</option>
    </Select>
  ),
};

export const WithError: Story = {
  render: () => (
    <Select label="Country" id="country-error" error="Please select a country">
      <option value="">Choose...</option>
      <option value="BE">Belgium</option>
    </Select>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select label="Country" id="country-disabled" disabled>
      <option value="BE">Belgium</option>
    </Select>
  ),
};
