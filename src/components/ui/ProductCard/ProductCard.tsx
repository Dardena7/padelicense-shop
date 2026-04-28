import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Badge } from "../Badge/Badge";

type ProductCardProps = {
  name: string;
  brand: string;
  slug: string;
  priceCents: number;
  imageUrl?: string;
  imageAlt?: string;
  featured?: boolean;
  inStock?: boolean;
};

const formatPrice = (cents: number, locale: string): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
};

export const ProductCard = (props: ProductCardProps) => {
  const locale = useLocale();
  const {
    name,
    brand,
    slug,
    priceCents,
    imageUrl,
    imageAlt,
    featured = false,
    inStock = true,
  } = props;

  const t = useTranslations("common");

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
            {t("noImageAvailable")}
          </div>
        )}

        <div className="absolute top-3 left-3 flex gap-2">
          {featured && <Badge variant="accent">{t("featured")}</Badge>}
          {!inStock && <Badge variant="danger">{t("outOfStock")}</Badge>}
        </div>

        {!inStock && <div className="absolute inset-0 bg-background/40" />}
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
          {formatPrice(priceCents, locale)}
        </p>
      </div>
    </Link>
  );
};
