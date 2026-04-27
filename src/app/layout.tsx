import type { Metadata } from "next";
import { Atkinson_Hyperlegible } from "next/font/google";
import ApolloClientProvider from "@/lib/apollo-provider";
import "./globals.css";

const atkinson = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Padelicense Shop",
  description: "Premium padel equipment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${atkinson.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ApolloClientProvider>{children}</ApolloClientProvider>
      </body>
    </html>
  );
}
