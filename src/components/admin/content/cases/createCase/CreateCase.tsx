import React, { useState, useEffect } from "react";
import { createCase } from "@/lib/server/actions";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { FaXmark } from "react-icons/fa6";

const CreateCase = ({ onCaseCreated }: { onCaseCreated: () => void }) => {
  const { t } = useTranslation();
  const [company, setCompany] = useState("");
  const [desc, setDesc] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [contact, setContact] = useState("");
  const [website, setWebsite] = useState("https://");

  const [errors, setErrors] = useState({
    company: "",
    desc: "",
    city: "",
    country: "",
    image: "",
    contact: "",
    website: "",
  });
  const [loading, setLoading] = useState(false);

  // Cleanup object URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (imageUrl && imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);

    if (file) {
      // Cleanup previous URL
      if (imageUrl && imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrl);
      }
      // Create new URL
      const newUrl = URL.createObjectURL(file);
      setImageUrl(newUrl);
    } else {
      setImageUrl("");
    }
  };

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!company || !desc || !city || !country || !contact) {
      setErrors({
        company: !company ? t("company_name_required") : "",
        desc: !desc ? t("desc_required") : "",
        city: !city ? t("city_required") : "",
        country: !country ? t("country_required") : "",
        image: "",
        contact: !contact ? t("contact_person_required") : "",
        website: "",
      });
      setLoading(false);
      return;
    }

    try {
      await createCase({
        company,
        desc,
        city,
        country,
        contact,
        image,
        website,
      });

      // Reset form
      setCompany("");
      setDesc("");
      setCity("");
      setCountry("");
      setContact("");
      setImage(null);
      setImageUrl("");
      setWebsite("https://");
      onCaseCreated();
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
    if (e.target.value.length <= 500) {
      setDesc(e.target.value);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full p-1 md:p-3">
      <span className="text-lg font-bold">{t("case_creation")}</span>
      <form
        onSubmit={handleCreateCase}
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
                aria-label={t("aria.createCase.companyName")}
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
                aria-label={t("aria.createCase.contactPerson")}
              />
              {errors.contact && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.contact}
                </span>
              )}
            </fieldset>

            <fieldset className="flex flex-col gap-2 relative w-full fieldset ">
              <legend className="fieldset-legend">{t("desc")}</legend>
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
                aria-label={t("aria.createCase.description")}
              ></textarea>
              <div className="text-right text-xs font-medium text-zinc-500 max-w-xs ">
                {desc.length} / 500
              </div>
              {errors.desc && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.desc}
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
                placeholder={t("write_city")}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                aria-label={t("aria.createCase.city")}
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
                aria-label={t("aria.createCase.country")}
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
                placeholder="https://"
                className="input input-bordered input-md"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                aria-label={t("aria.createCase.websiteUrl")}
              />
              {errors.website && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.website}
                </span>
              )}
            </fieldset>
            <fieldset className="flex flex-col gap-2 relative w-full fieldset">
              <legend className="fieldset-legend">{t("choose_images")}</legend>
              <input
                name="image"
                type="file"
                className="file-input file-input-bordered file-input-md w-full"
                onChange={handleImageChange}
                required
                accept="image/*"
                aria-label={t("aria.createCase.chooseImage")}
              />
              {errors.image && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.image}
                </span>
              )}
            </fieldset>

            {imageUrl && (
              <fieldset className="fieldset w-full flex flex-col gap-3">
                <legend className="fieldset-legend">
                  {t("image_preview")}
                </legend>
                <div className="relative group w-fit">
                  <Image
                    src={imageUrl}
                    alt="Selected image preview"
                    width={200}
                    height={150}
                    className="rounded-lg object-cover border border-base-300"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 btn btn-xs btn-circle btn-error opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      setImage(null);
                      setImageUrl("");
                      // Reset file input
                      const fileInput = document.querySelector(
                        'input[name="image"]'
                      ) as HTMLInputElement;
                      if (fileInput) fileInput.value = "";
                    }}
                    title="Fjern billede"
                  >
                    <FaXmark />
                  </button>
                </div>
              </fieldset>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary mt-2"
          disabled={loading}
          aria-label={
            loading
              ? t("aria.createCase.creating")
              : t("aria.createCase.create")
          }
        >
          {loading ? t("creating") : t("create")}
        </button>
      </form>
    </div>
  );
};

export default CreateCase;
