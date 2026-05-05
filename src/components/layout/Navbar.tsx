import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { NavbarAuth } from "./NavbarAuth";
import { NavbarCart } from "./NavbarCart";

export const Navbar = () => {
  const t = useTranslations("nav");

  return (
    <header className="border-b border-border">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-lg font-bold text-foreground">
            Padelicense
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/products"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              {t("products")}
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <LocaleSwitcher />
          <NavbarCart />
          <NavbarAuth />
        </div>
      </nav>
    </header>
  );
};
