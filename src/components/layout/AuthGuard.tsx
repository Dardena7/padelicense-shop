"use client";

import { useEffect } from "react";
import { useAuthContext } from "@/lib/auth";
import { useRouter } from "@/i18n/navigation";

type AuthGuardProps = {
  children: React.ReactNode;
};

export const AuthGuard = (props: AuthGuardProps) => {
  const { children } = props;
  const { user, isLoading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted">...</p>
      </div>
    );
  }

  return <>{children}</>;
};
