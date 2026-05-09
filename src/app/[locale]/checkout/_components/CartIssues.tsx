"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui";
import type { VerifyCartQuery } from "@/gql/graphql";

type CartIssuesProps = {
  issues: NonNullable<VerifyCartQuery["verifyCart"]>["issues"];
};

export const CartIssues = (props: CartIssuesProps) => {
  const { issues } = props;
  const t = useTranslations("checkout");

  return (
    <div className="flex flex-col gap-4">
      <p className="text-danger font-medium">{t("cartIssues")}</p>
      <ul className="flex flex-col gap-2">
        {issues.map((issue, i) => (
          <li key={i} className="text-sm text-danger">
            {issue.type === "EMPTY_CART" && t("emptyCart")}
            {issue.type === "PRODUCT_UNAVAILABLE" &&
              t("productUnavailable", { name: issue.productName ?? "" })}
            {issue.type === "INSUFFICIENT_STOCK" &&
              t("insufficientStock", {
                name: issue.productName ?? "",
                available: issue.available ?? 0,
                requested: issue.requested ?? 0,
              })}
          </li>
        ))}
      </ul>
      <Link href="/cart">
        <Button variant="outline">{t("backToCart")}</Button>
      </Link>
    </div>
  );
};
