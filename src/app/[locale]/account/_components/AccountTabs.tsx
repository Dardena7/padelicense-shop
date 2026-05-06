"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type AccountTabsProps = {
  children: React.ReactNode[];
  labels: string[];
};

export const AccountTabs = (props: AccountTabsProps) => {
  const { children, labels } = props;
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-1 border-b border-border">
        {labels.map((label, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === i
                ? "text-accent border-b-2 border-accent"
                : "text-muted hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {children[activeTab]}
    </div>
  );
};
