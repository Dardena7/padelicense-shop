import { ImageResponse } from "next/og";
import { getProduct } from "./_queries/product";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const OGImage = async (props: {
  params: Promise<{ locale: string; slug: string }>;
}) => {
  const { locale, slug } = await props.params;
  const product = await getProduct(slug, locale);

  const name = product?.name ?? "Product";
  const brand = product?.brand ?? "";
  const price = product
    ? new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "EUR",
      }).format(product.basePriceCents / 100)
    : "";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1a56db",
        color: "white",
        fontFamily: "sans-serif",
        padding: "60px",
      }}
    >
      <div style={{ fontSize: 24, opacity: 0.8, marginBottom: 12 }}>
        {brand}
      </div>
      <div
        style={{
          fontSize: 64,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 24,
        }}
      >
        {name}
      </div>
      <div style={{ fontSize: 40, color: "#f5c518" }}>{price}</div>
      <div
        style={{
          position: "absolute",
          bottom: 40,
          fontSize: 20,
          opacity: 0.6,
        }}
      >
        padelicense.com
      </div>
    </div>,
    { ...size },
  );
};

export default OGImage;
