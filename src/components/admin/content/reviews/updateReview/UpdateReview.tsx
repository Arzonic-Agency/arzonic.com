import React, { useState, useEffect } from "react";
import { updateReview, getReviewById } from "@/lib/server/actions";
import CreateRating from "../createReview/CreateRating";
import { t } from "i18next";

interface UpdateReviewProps {
  reviewId: number;
  onReviewUpdated: () => void;
}

const UpdateReview = ({ reviewId, onReviewUpdated }: UpdateReviewProps) => {
  const [company, setCompany] = useState("");
  const [contact, setContact] = useState("");
  const [desc, setDesc] = useState("");
  const [rate, setRate] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    company: "",
    contact: "",
    desc: "",
  });

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const review = await getReviewById(reviewId);
        setCompany(review.company);
        setContact(review.contact);
        setDesc(review.desc);
        setRate(review.rate);
      } catch (error) {
        console.error("Failed to fetch review:", error);
      }
    };

    fetchReview();
  }, [reviewId]);

  const handleUpdateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!contact || !company || !desc) {
      setErrors({
        company: !company ? t("company_required") : "",
        contact: !contact ? t("contact_required") : "",
        desc: !desc ? t("desc_required") : "",
      });
      setLoading(false);
      return;
    }

    try {
      await updateReview(reviewId, company, contact, desc, rate);
      onReviewUpdated();
    } catch (err) {
      console.error("Failed to update review:", err);
      setError("Failed to update review. Please try again.");
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
      <span className="text-lg font-bold">
        {t("edit")} {t("review")}
      </span>
      <form
        onSubmit={handleUpdateReview}
        className="flex flex-col items-start gap-5 w-full"
      >
        {error && <div className="alert alert-error">{error}</div>}
        <div className="form-control">
          <label className="label">Rating</label>
          <CreateRating rate={rate} setRate={(value) => setRate(value)} />
        </div>
        <div className="flex flex-col gap-2 relative w-full">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">{t("contact")}</legend>
            <input
              type="text"
              className="input input-bordered input-md"
              placeholder="Reviewer name"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
              aria-label={t("aria.updateReview.contactInput")}
            />
          </fieldset>
          {errors.contact && (
            <span className="absolute -bottom-4 text-xs text-red-500">
              {errors.contact}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 relative w-full">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">{t("company")}</legend>
            <input
              type="text"
              className="input input-bordered input-md"
              placeholder="Reviewer name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              aria-label={t("aria.updateReview.companyInput")}
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
            <legend className="fieldset-legend">{t("description")}</legend>
            <textarea
              name="desc"
              className="textarea textarea-bordered textarea-md text"
              value={desc}
              onChange={handleDescChange}
              required
              placeholder={t("write_desc")}
              style={{ resize: "none" }}
              cols={30}
              rows={8}
              aria-label={t("aria.updateReview.descriptionInput")}
            ></textarea>
            <div className="text-right text-xs font-medium text-gray-500">
              {desc.length} / 100
            </div>
          </fieldset>
          {errors.desc && (
            <span className="absolute -bottom-4 text-xs text-red-500">
              {errors.desc}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          aria-label={
            loading
              ? t("aria.updateReview.saving")
              : t("aria.updateReview.save")
          }
        >
          {loading ? t("saving") : t("save")}
        </button>
      </form>
    </div>
  );
};

export default UpdateReview;
