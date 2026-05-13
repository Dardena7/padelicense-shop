"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuthContext } from "@/lib/auth";
import { useRouter } from "@/i18n/navigation";
import { useUpdateProfile } from "../_hooks";
import { Button, Input } from "@/components/ui";

export const ProfileTab = () => {
  const t = useTranslations("auth.account");
  const { user, updateUser, logout } = useAuthContext();
  const { updateProfile, loading } = useUpdateProfile();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");

  if (!user) return null;

  const handleSave = async () => {
    const result = await updateProfile({
      firstName,
      lastName,
      email,
      phone: phone || undefined,
    });

    if (result) {
      updateUser({
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        phone: result.phone ?? null,
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);
    setPhone(user.phone ?? "");
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            id="firstName"
            label={t("firstName")}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <Input
            id="lastName"
            label={t("lastName")}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <Input
          id="email"
          type="email"
          label={t("email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          id="phone"
          type="tel"
          label={t("phone")}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={loading}>
            {t("save")}
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            {t("cancel")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="border border-border rounded-xl p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">{t("profile")}</h2>
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
            {t("edit")}
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted uppercase tracking-wider mb-1">
              {t("firstName")}
            </p>
            <p className="font-medium text-foreground">{user.firstName}</p>
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-wider mb-1">
              {t("lastName")}
            </p>
            <p className="font-medium text-foreground">{user.lastName}</p>
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-wider mb-1">
              {t("email")}
            </p>
            <p className="font-medium text-foreground">{user.email}</p>
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-wider mb-1">
              {t("phone")}
            </p>
            <p className="font-medium text-foreground">{user.phone || "—"}</p>
          </div>
        </div>
      </div>

      <Button variant="outline" onClick={handleLogout}>
        {t("logout")}
      </Button>
    </div>
  );
};
