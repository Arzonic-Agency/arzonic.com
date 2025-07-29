import React, { useState, useEffect } from "react";
import { updateCase, getCaseById } from "@/lib/server/actions";
import Image from "next/image";
import { t } from "i18next";

const UpdateCase = ({
  caseId,
  onCaseUpdated,
}: {
  caseId: number;
  onCaseUpdated: () => void;
}) => {
  const [company, setCompany] = useState("");
  const [desc, setDesc] = useState("");
  const [city, setCity] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [contact, setContact] = useState("");
  const [country, setCountry] = useState("");
  const [website, setWebsite] = useState("");

  const [existingImage, setExistingImage] = useState<string | null>(null);

  const [errors, setErrors] = useState({
    company: "",
    desc: "",
    city: "",
    country: "",
    image: "",
    created_at: "",
    contact: "",
    website: "",
  });
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [createdAt, setCreatedAt] = useState<string>("");

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const caseData = await getCaseById(caseId);
        if (!caseData) {
          console.error(t("case_not_found"));
          return;
        }
        setCompany(caseData.company || "");
        setDesc(caseData.desc || "");
        setCity(caseData.city || "");
        setCountry(caseData.country || "");
        setExistingImage(caseData.image || null);
        setContact(caseData.contact || "");
        setWebsite(caseData.website || "");

        setCreatedAt(
          caseData.created_at
            ? new Date(caseData.created_at).toISOString().split("T")[0]
            : ""
        );
      } catch (error) {
        console.error(t("failed_to_fetch_case"), error);
      }
    };

    fetchCase();
  }, [caseId]);

  const handleUpdateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!company || !desc || !city || !country || !contact) {
      setErrors({
        company: !company ? t("company_name_required") : "",
        desc: !desc ? t("desc_required") : "",
        city: !city ? t("city_required") : "",
        country: !country ? t("country_required") : "",
        image: "",
        created_at: "",
        contact: !contact ? t("contact_person_required") : "",
        website: "",
      });
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("caseId", caseId.toString());
      formData.append("company", company);
      formData.append("desc", desc);
      formData.append("city", city);
      formData.append("country", country);
      formData.append("contact", contact);
      formData.append("website", website);

      formData.append("createdAt", createdAt);

      if (image) formData.append("image", image);

      await updateCase(
        caseId,
        company,
        desc,
        city,
        country,
        contact,
        image || undefined,
        createdAt,
        website
      );

      onCaseUpdated();
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          general: error.message,
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 250) {
      setDesc(e.target.value);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full p-1 md:p-3">
      <span className="text-lg font-bold">{t("case_editing")}</span>

      <form
        onSubmit={handleUpdateCase}
        className="flex flex-col items-start gap-5 w-full"
      >
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-14 w-full">
          <div className="flex flex-col gap-5 items-center">
            <fieldset className="flex flex-col gap-2 relative w-full fieldset">
              <legend className="fieldset-legend">{t("company_name")}</legend>
              <input
                name="company"
                type="text"
                className="input input-bordered input-md"
                placeholder={t("write_company_name")}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
              {errors.company && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.company}
                </span>
              )}
            </fieldset>
            <fieldset className="flex flex-col gap-2 relative w-full fieldset">
              <legend className="fieldset-legend">{t("contact_person")}</legend>
              <input
                name="contact"
                type="text"
                className="input input-bordered input-md"
                placeholder={t("write_contact_person")}
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
              />
              {errors.contact && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.contact}
                </span>
              )}
            </fieldset>
            <fieldset className="flex flex-col gap-2 relative w-full fieldset">
              <legend className="fieldset-legend">{t("description")}</legend>
              <textarea
                name="desc"
                className="textarea textarea-bordered textarea-md"
                value={desc}
                onChange={handleDescChange}
                required
                placeholder={t("write_case_description")}
                style={{ resize: "none" }}
                cols={30}
                rows={8}
              ></textarea>
              <div className="text-right text-xs font-medium text-gray-500">
                {desc.length} / 250
              </div>
              {errors.desc && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.desc}
                </span>
              )}
            </fieldset>

            <fieldset className="flex flex-col gap-2 relative w-full fieldset">
              <legend className="fieldset-legend">{t("creation_date")}</legend>
              <input
                name="createdAt"
                type="date"
                className="input input-bordered input-md"
                value={createdAt}
                onChange={(e) => setCreatedAt(e.target.value)}
                required
              />
              {errors.created_at && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.created_at}
                </span>
              )}
            </fieldset>
          </div>
          <div className="flex flex-col gap-3 relative">
            <fieldset className="flex flex-col gap-2 relative w-full fieldset">
              <legend className="fieldset-legend">{t("city")}</legend>
              <input
                name="city"
                type="text"
                className="input input-bordered input-md"
                placeholder={t("enter_city_area")}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
              {errors.city && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.city}
                </span>
              )}
            </fieldset>
            <fieldset className="flex flex-col gap-2 relative w-full fieldset">
              <legend className="fieldset-legend">{t("country")}</legend>
              <input
                name="country"
                type="text"
                className="input input-bordered input-md"
                placeholder={t("write_country")}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
              {errors.country && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.country}
                </span>
              )}
            </fieldset>
            <fieldset className="flex flex-col gap-2 relative w-full fieldset">
              <legend className="fieldset-legend">{t("website_url")}</legend>
              <input
                name="website"
                type="url"
                className="input input-bordered input-md"
                placeholder={t("write_website_url")}
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
              {errors.website && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.website}
                </span>
              )}
            </fieldset>
            <fieldset className="flex flex-col gap-2 relative w-full fieldset">
              <legend className="fieldset-legend">{t("image_update")}</legend>
              <input
                name="image"
                type="file"
                className="file-input file-input-bordered file-input-md w-full"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
              {errors.image && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.image}
                </span>
              )}
              {existingImage && !image && (
                <div className="relative w-full overflow-hidden rounded-md h-0 pb-[56.25%]">
                  <Image
                    src={existingImage}
                    alt={t("existing_image")}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )}
            </fieldset>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary mt-2"
          disabled={loading}
        >
          {loading ? t("editing") : t("save")}
        </button>
      </form>
      {showToast && (
        <div className="toast bottom-20 md:bottom-0 toast-end">
          <div className="alert alert-success text-neutral-content">
            <span className="text-base md:text-lg">{t("case_updated")}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateCase;
