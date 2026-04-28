import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProductCard } from "./ProductCard";

const meta: Meta<typeof ProductCard> = {
  title: "UI/ProductCard",
  component: ProductCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ProductCard>;

export const Default: Story = {
  args: {
    name: "Head Speed Pro",
    brand: "Head",
    slug: "head-speed-pro",
    priceCents: 24990,
    imageUrl: "https://picsum.photos/400/300",
    imageAlt: "Head Speed Pro padel racket",
  },
};

export const Featured: Story = {
  args: {
    name: "Bullpadel Vertex 04",
    brand: "Bullpadel",
    slug: "bullpadel-vertex-04",
    priceCents: 34990,
    imageUrl: "https://picsum.photos/400/300",
    featured: true,
  },
};

export const OutOfStock: Story = {
  args: {
    name: "Adidas Metalbone",
    brand: "Adidas",
    slug: "adidas-metalbone",
    priceCents: 29990,
    imageUrl: "https://picsum.photos/400/300",
    inStock: false,
  },
};

export const NoImage: Story = {
  args: {
    name: "Nox AT10 Genius",
    brand: "Nox",
    slug: "nox-at10-genius",
    priceCents: 19990,
  },
};
