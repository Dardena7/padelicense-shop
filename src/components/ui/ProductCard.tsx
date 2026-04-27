import Image from "next/image";
import Link from "next/link";
import Badge from "./Badge";

interface ProductCardProps {
  name: string;
  brand: string;
  slug: string;
  priceCents: number;
  imageUrl?: string;
  imageAlt?: string;
  featured?: boolean;
  inStock?: boolean;
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export default function ProductCard({
  name,
  brand,
  slug,
  priceCents,
  imageUrl,
  imageAlt,
  featured = false,
  inStock = true,
}: ProductCardProps) {
  return (
    <Link
      href={`/products/${slug}`}
      className="group flex flex-col rounded-xl bg-background border border-border overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] bg-foreground-light overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt || name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted text-sm">
            No image available
          </div>
        )}

        <div className="absolute top-3 left-3 flex gap-2">
          {featured && <Badge variant="accent">Featured</Badge>}
          {!inStock && <Badge variant="danger">Out of stock</Badge>}
        </div>

        {!inStock && (
          <div className="absolute inset-0 bg-background/40" />
        )}
      </div>

      <div className="flex flex-col gap-2 p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            {brand}
          </p>
        </div>

        <h3 className="font-semibold text-foreground leading-snug group-hover:text-accent transition-colors duration-200">
          {name}
        </h3>

        <p className="text-xl font-bold text-foreground tracking-tight">
          {formatPrice(priceCents)}
        </p>
      </div>
    </Link>
  );
}
