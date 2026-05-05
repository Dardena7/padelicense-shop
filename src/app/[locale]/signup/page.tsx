"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuthContext, AuthError } from "@/lib/auth";
import { useRouter } from "@/i18n/navigation";
import { Button, Input } from "@/components/ui";

const SignupPage = () => {
  const t = useTranslations("auth.signup");
  const { signup } = useAuthContext();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await signup({
        firstName,
        lastName,
        email,
        password,
        passwordConfirmation,
      });
      router.replace("/");
    } catch (err) {
      if (err instanceof AuthError) {
        setError(err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-foreground text-center">
          {t("title")}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <p className="text-sm text-danger text-center">{error}</p>
          )}

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
            id="password"
            type="password"
            label={t("password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Input
            id="passwordConfirmation"
            type="password"
            label={t("passwordConfirmation")}
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />

          <Button type="submit" disabled={isSubmitting}>
            {t("submit")}
          </Button>
        </form>

        <p className="text-sm text-muted text-center">
          {t("hasAccount")}{" "}
          <Link href="/login" className="text-accent hover:underline">
            {t("loginLink")}
          </Link>
        </p>
      </div>
    </main>
  );
};

export default SignupPage;
