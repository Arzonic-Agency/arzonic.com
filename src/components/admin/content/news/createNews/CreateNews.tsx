import React, { useState, useEffect } from "react";
import { createNews } from "@/lib/server/actions";
import { FaXmark } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import Image from "next/image";

const CreateNews = ({ onNewsCreated }: { onNewsCreated: () => void }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [postToFacebook, setPostToFacebook] = useState(true);
  const [postToInstagram, setPostToInstagram] = useState(true);
  const [errors, setErrors] = useState<{
    desc?: string;
    general?: string;
    facebook?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  // Cleanup object URLs when component unmounts or images change
  useEffect(() => {
    return () => {
      imageUrls.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imageUrls]);

  // Create object URLs for images (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const newUrls = images.map((file) => URL.createObjectURL(file));
      setImageUrls(newUrls);

      // Cleanup previous URLs
      return () => {
        newUrls.forEach((url) => URL.revokeObjectURL(url));
      };
    }
  }, [images]);

  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (loading) return;

    setLoading(true);
    setErrors({});

    if (!desc) {
      setErrors({ desc: "Beskrivelse er påkrævet" });
      setLoading(false);
      return;
    }

    try {
      await createNews({
        title,
        content: desc,
        images,
        sharedFacebook: postToFacebook,
      });

      // Clear form
      setTitle("");
      setDesc("");
      setImages([]);
      setPostToFacebook(true);
      setPostToInstagram(true);
      setErrors({});
      onNewsCreated();
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "Ukendt fejl";

      // Check if it's a Facebook-specific error
      if (
        msg.includes("Facebook") ||
        msg.includes("admin/editor") ||
        msg.includes("siden")
      ) {
        setErrors({ facebook: msg });
      } else {
        setErrors({ general: msg });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 250) setDesc(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles].slice(0, 10));
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full p-3">
      <span className="text-lg font-bold">{t("news_creation")}</span>

      <form
        onSubmit={handleCreateNews}
        className="flex flex-col items-start gap-5 w-full"
      >
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-14 w-full">
          <div className="flex flex-col gap-5">
            <fieldset className="flex flex-col gap-2 fieldset max-w-xs w-full">
              <legend className="fieldset-legend">{t("title")}</legend>
              <input
                name="title"
                type="text"
                className="input input-bordered input-md"
                placeholder={t("write_title")}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </fieldset>

            <fieldset className="flex flex-col gap-2 fieldset max-w-xs w-full relative">
              <legend className="fieldset-legend">{t("desc")}</legend>
              <textarea
                name="desc"
                className="textarea textarea-bordered textarea-md"
                value={desc}
                onChange={handleDescChange}
                required
                placeholder={t("write_desc")}
                cols={30}
                rows={8}
                style={{ resize: "none" }}
              />
              <div className="text-right text-xs text-gray-500">
                {desc.length} / 250
              </div>
              {errors.desc && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.desc}
                </span>
              )}
            </fieldset>
          </div>

          <div className="flex flex-col gap-5">
            <fieldset className="flex flex-col gap-2 fieldset max-w-xs w-full relative">
              <legend className="fieldset-legend">{t("choose_images")}</legend>
              <input
                name="images"
                type="file"
                className="file-input file-input-bordered file-input-lg md:file-input-md w-full"
                onChange={handleImageChange}
                multiple
              />
            </fieldset>

            {images.length > 0 && (
              <fieldset className="fieldset w-full max-w-md flex flex-col gap-3">
                <legend className="fieldset-legend">
                  {t("chosen_images")} ( {images.length} / 10 )
                </legend>
                <div className="carousel gap-3">
                  {images.map((file, index) => {
                    const url = URL.createObjectURL(file);
                    return (
                      <div
                        key={index}
                        className="carousel-item relative group h-full"
                      >
                        <Image
                          src={url}
                          alt={`Billede ${index + 1}`}
                          width={192}
                          height={128}
                          className="rounded-lg object-cover w-48 h-48"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 btn btn-xs btn-soft hidden group-hover:block"
                          onClick={() =>
                            setImages((prev) =>
                              prev.filter((_, i) => i !== index)
                            )
                          }
                          title="Fjern billede"
                        >
                          <FaXmark />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </fieldset>
            )}
          </div>
        </div>

        <fieldset className="flex items-center gap-3">
          <input
            type="checkbox"
            name="postToFacebook"
            className="toggle toggle-primary"
            checked={postToFacebook}
            onChange={(e) => setPostToFacebook(e.target.checked)}
          />
          <label htmlFor="postToFacebook" className="label-text">
            {t("share_fb")}
          </label>
        </fieldset>

        <fieldset className="flex items-center gap-3 opacity-50">
          <input
            type="checkbox"
            name="postToInstagram"
            className="toggle toggle-primary"
            checked={postToInstagram}
            onChange={(e) => setPostToInstagram(e.target.checked)}
            disabled
          />
          <label htmlFor="postToInstagram" className="label-text">
            {t("share_instagram")}
          </label>
        </fieldset>

        {errors.facebook && (
          <div className="text-error">
            {/* <span className="text-sm">{errors.facebook}</span> */}
            <div className="text-sm mt-1">
              Du er ikke tilknyttet den korrekte Facebook-side, eller også
              mangler du de nødvendige rettigheder. Prøv at tilknytte din konto
              igen.
            </div>
          </div>
        )}

        {errors.general && (
          <span className="text-sm text-red-500">{errors.general}</span>
        )}

        <button
          type="submit"
          className="btn btn-primary mt-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              {t("creating")}
            </>
          ) : (
            t("create") + " " + t("news")
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateNews;
