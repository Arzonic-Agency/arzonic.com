"use client";

import React, { useState, useActionState, useEffect } from "react";
import { FaEnvelope, FaKey } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import LanguageAdmin from "@/components/admin/layout/LanguageAdmin";
import PolicyModal from "@/components/client/modal/PolicyModal";
import Link from "next/link";
import Image from "next/image";
import { readUserSession } from "@/lib/auth/readUserSession";
import { login } from "@/lib/auth/actions";

const LoginPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleLogin = async (_prevState: any, formData: FormData) => {
    const emailValue = formData.get("email") as string;
    const passwordValue = formData.get("password") as string;

    let valid = true;
    const validationErrors = { email: "", password: "" };

    if (!validateEmail(emailValue)) {
      validationErrors.email = "Invalid email address";
      valid = false;
    }

    if (passwordValue.length < 6) {
      validationErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(validationErrors);

    if (!valid) {
      return { success: false, message: "Validation failed" };
    }

    return await login(formData);
  };

  const [state, formAction, isPending] = useActionState(handleLogin, null);

  useEffect(() => {
    if (state?.success) {
      const routeUser = async () => {
        const session = await readUserSession();
        if (session?.role === "editor") {
          router.push("/admin/content");
        } else {
          router.push("/admin");
        }
      };
      routeUser();
    }
  }, [state, router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formAction(formData);
  };

  return (
    <>
      <div className="md:h-lvh bg-base-100 h-dvh flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-base-200 p-11 rounded-lg shadow-lg flex flex-col gap-5"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="font-bold text-lg">Admin</span>
            <span className="text-sm">Arzonic Agency</span>
          </div>
          <div className="flex flex-col gap-2 relative">
            <label
              htmlFor="email"
              className="input input-ghost bg-base-300 flex items-center gap-2 "
            >
              <FaEnvelope />
              <input
                id="email"
                name="email"
                autoComplete="email"
                type="text"
                className="grow"
                placeholder={t("email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            {errors.email && (
              <span className="absolute -bottom-4 text-xs text-red-500">
                {errors.email}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2 relative">
            <label
              htmlFor="password"
              className="input input-ghost bg-base-300  flex items-center gap-2"
            >
              <FaKey />
              <input
                id="password"
                name="password"
                autoComplete="current-password"
                type="password"
                className="grow"
                placeholder={t("password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {errors.password && (
              <span className="text-xs absolute -bottom-4 text-red-500">
                {errors.password}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-primary mt-2"
            disabled={isPending}
          >
            {isPending ? t("logging_in") : t("login")}
          </button>
          <span className="text-xs text-red-500 min-h-4 text-center">
            {state && !state.success
              ? state.message || t("messages.error_wrong")
              : ""}
          </span>
        </form>
        <Link
          href="/"
          className="pl-2 flex items-center gap-2 absolute top-6 left-4"
          aria-label={t("aria.navigation.linkToHome")}
        >
          <Image
            src="/icon-192x192.png"
            alt={t("Header.logoAlt")}
            width={60}
            height={60}
            className="h-10 w-10 rounded-full"
            priority
          />
          <span className="font-bold text-xl tracking-wider">
            {t("Header.brandName")}
          </span>
        </Link>
        <div className="absolute top-6 right-4 btn">
          <LanguageAdmin />
        </div>
        <div className="text-zinc-400 text-[11px] flex flex-col items-center justify-center gap-1 p-4 absolute bottom-2">
          <span>
            © {new Date().getFullYear()} Powered by{" "}
            <span className="font-semibold text-[12px]">Arzonic</span>
          </span>
          <span>
            {t("by_continuing")}{" "}
            <PolicyModal buttonText={t("privacy_policy")} variant="primary" />
          </span>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
