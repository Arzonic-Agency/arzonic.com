import React, { useState } from "react";
import { createReview } from "@/lib/server/actions";
import CreateRating from "./CreateRating";
import { useTranslation } from "react-i18next";

interface CreateReviewProps {
  onReviewCreated: () => void;
}

const CreateReview = ({ onReviewCreated }: CreateReviewProps) => {
  const { t } = useTranslation();
  const [desc, setDesc] = useState("");
  const [rate, setRate] = useState<number>(1);
  const [company, setCompany] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    desc: "",
    company: "",
    contact: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!desc || !company || !contact) {
      setErrors({
        desc: !desc ? t("desc_required") : "",
        company: !company ? t("company_required") : "",
        contact: !contact ? t("contact_required") : "",
      });
      setLoading(false);
      return;
    }

    try {
      await createReview(desc, rate, company, contact);
      onReviewCreated();
    } catch {
      setError("Failed to create review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 100) {
      setDesc(e.target.value);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full p-3">
      <span className="text-lg font-bold">{t("review_creation")}</span>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-start gap-5 w-full"
      >
        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-control">
          <label className="label">Rating</label>
          <CreateRating rate={rate} setRate={(value) => setRate(value)} />
        </div>
        <div className="flex flex-col gap-2 relative w-full">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">{t("description")}</legend>
            <textarea
              name="desc"
              className="textarea textarea-bordered textarea-md text"
              value={desc}
              onChange={handleDescChange}
              required
              placeholder={t("write_desc")}
              aria-label={t("aria.descriptionInput")}
              style={{ resize: "none" }}
              cols={30}
              rows={5}
            ></textarea>
            <div className="absolute right-2 -bottom-5 text-right text-xs font-medium text-gray-500">
              {desc.length} / 100
            </div>
          </fieldset>
          {errors.desc && (
            <span className="absolute -bottom-4 text-xs text-red-500">
              {errors.desc}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 relative w-full">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">{t("company")}</legend>
            <input
              type="text"
              className="input input-bordered input-md"
              placeholder={t("write_company_name")}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              aria-label={t("aria.companyInput")}
            />
          </fieldset>
          {errors.company && (
            <span className="absolute -bottom-4 text-xs text-red-500">
              {errors.company}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 relative w-full">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">{t("contact_person")}</legend>
            <input
              type="text"
              className="input input-bordered input-md"
              placeholder={t("write_contact_person")}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
              aria-label={t("aria.contactInput")}
            />
          </fieldset>
          {errors.contact && (
            <span className="absolute -bottom-4 text-xs text-red-500">
              {errors.contact}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          aria-label={
            loading ? t("aria.creatingReview") : t("aria.createReview")
          }
        >
          {loading ? t("creating") : `${t("create")} ${t("request")}`}
        </button>
      </form>
    </div>
  );
};

export default CreateReview;
