import { getClient, localizedContext } from "@/lib/apollo";
import { GET_PRODUCT } from "./_queries/product";
import Image from "next/image";
import { Badge } from "@/components/ui";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

type ProductPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

const formatPrice = (cents: number, locale: string): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
};

const ProductPage = async (props: ProductPageProps) => {
  const { locale, slug } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations("common");
  const tProducts = await getTranslations("products");

  const { data } = await getClient().query({
    query: GET_PRODUCT,
    variables: { slug },
    ...localizedContext(locale),
  });

  const product = data?.product;

  if (!product) {
    notFound();
  }

  const images = [...(product.images ?? [])].sort(
    (a, b) => (a?.position ?? 0) - (b?.position ?? 0),
  );
  const mainImage = images[0];

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="relative aspect-square bg-foreground-light rounded-xl overflow-hidden">
          {mainImage ? (
            <Image
              src={mainImage.imageUrl}
              alt={mainImage.altText || product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted">
              {t("noImageAvailable")}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium uppercase tracking-wider text-muted">
              {product.brand}
            </p>
            <h1 className="text-3xl font-bold text-foreground">
              {product.name}
            </h1>
            <div className="flex gap-2">
              {product.featured && (
                <Badge variant="accent">{t("featured")}</Badge>
              )}
            </div>
          </div>

          <p className="text-3xl font-bold text-foreground">
            {formatPrice(product.basePriceCents, locale)}
          </p>

          {product.description && (
            <p className="text-muted leading-relaxed">{product.description}</p>
          )}

          {product.variants && product.variants.length > 1 && (
            <div className="flex flex-col gap-3">
              <h2 className="text-sm font-medium text-foreground">
                {tProducts("variants")}
              </h2>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) =>
                  variant ? (
                    <div
                      key={variant.id}
                      className="border border-border rounded-lg px-4 py-2 text-sm"
                    >
                      <span className="font-medium">{variant.name}</span>
                      {variant.effectivePrice !== product.basePriceCents && (
                        <span className="text-muted ml-2">
                          {formatPrice(variant.effectivePrice, locale)}
                        </span>
                      )}
                      {variant.stockQuantity === 0 && (
                        <Badge variant="danger">{t("outOfStock")}</Badge>
                      )}
                    </div>
                  ) : null,
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProductPage;
