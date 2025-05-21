import { createMember } from "@/lib/server/actions";
import React, { useState } from "react";
import { FaEnvelope, FaKey, FaShield, FaSignature } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

const Register = ({ onUserCreated }: { onUserCreated: () => void }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"editor" | "admin">("editor");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    const errors = { email: "", password: "", confirmPassword: "" };

    if (!validateEmail(email)) {
      errors.email = t("invalid_email");
      valid = false;
    }

    if (password.length < 6) {
      errors.password = t("password_too_short");
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = t("passwords_not_matching");
      valid = false;
    }

    setErrors(errors);

    if (valid) {
      setLoading(true);
      try {
        await createMember({
          email,
          password,
          role,
          name,
        });
        onUserCreated();
      } catch {
        setErrors({ ...errors, password: t("registration_error") });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <form
        onSubmit={handleRegister}
        className=" flex flex-col items-start  gap-5 w-72 p-3"
      >
        <span className="text-lg font-bold">{t("create_new_user")}</span>
        <div className="flex gap-2 relative">
          <select
            className="select select-bordered w-full"
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value as "editor" | "admin")}
            required
          >
            <option disabled value="">
              {t("select_access_level")}
            </option>
            <option value="editor">{t("editor")}</option>
            <option value="admin">{t("admin")}</option>
          </select>
        </div>
        <div className="flex flex-col gap-2 relative">
          <label
            htmlFor="name"
            className="input input-bordered flex items-center gap-2"
          >
            <FaSignature />
            <input
              id="name"
              autoComplete="name"
              name="name"
              type="text"
              className="grow"
              placeholder={t("name")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              aria-label={t("aria.register.nameInput")}
            />
          </label>
        </div>
        <div className="flex flex-col gap-2 relative">
          <label
            htmlFor="email"
            className="input input-bordered flex items-center gap-2"
          >
            <FaEnvelope />
            <input
              name="email"
              autoComplete="email"
              id="email"
              type="text"
              className="grow"
              placeholder={t("email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label={t("aria.register.emailInput")}
            />
          </label>
          {errors.email && (
            <span className=" absolute -bottom-4 text-xs text-red-500">
              {errors.email}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 relative">
          <label
            htmlFor="password"
            className="input input-bordered flex items-center gap-2"
          >
            <FaKey />
            <input
              id="password"
              name="password"
              autoComplete="new-password"
              type="password"
              className="grow"
              placeholder={t("password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-label={t("aria.register.passwordInput")}
            />
          </label>
          {errors.password && (
            <span className="text-xs absolute -bottom-4 text-red-500">
              {errors.password}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 relative">
          <label
            htmlFor="confirmPassword"
            className="input input-bordered flex items-center gap-2"
          >
            <FaShield />
            <input
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              type="password"
              className="grow"
              placeholder={t("confirm_password")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
          {errors.confirmPassword && (
            <span className="text-xs absolute -bottom-4 text-red-500">
              {errors.confirmPassword}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary mt-2"
          disabled={loading}
        >
          {loading ? t("creating_user") : t("create_user")}
        </button>
      </form>
    </div>
  );
};

export default Register;
