import React, { useState } from "react";
import { createNews } from "@/lib/server/actions";
import { FaXmark } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import Image from "next/image";

const CreateNews = ({ onNewsCreated }: { onNewsCreated: () => void }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [postToFacebook, setPostToFacebook] = useState(true);
  const [postToInstagram, setPostToInstagram] = useState(true);
  const [errors, setErrors] = useState({
    desc: "",
    images: "",
  });
  const [loading, setLoading] = useState(false);
  const [fbPostLink, setFbPostLink] = useState<string | null>(null);

  const handleCreateNews = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!desc) {
      setErrors({
        desc: !desc ? "Beskrivelse er påkrævet" : "",
        images: "",
      });
      setLoading(false);
      return;
    }

    try {
      // Pass postToFacebook to createNews
      const result = await createNews({
        title,
        content: desc,
        images,
        postToFacebook,
      });
      setTitle("");
      setDesc("");
      setImages([]);
      setPostToFacebook(true);
      setPostToInstagram(true);
      onNewsCreated();
      // Hvis Facebook link returneres, vis det
      const fbLink =
        result && typeof result === "object" ? result.fbPostLink : undefined;
      if (fbLink) {
        setFbPostLink(fbLink);
      } else {
        setFbPostLink(null);
      }
    } catch (error) {
      let msg = "Ukendt fejl";
      if (error instanceof Error) {
        msg = error.message;
        // Special handling for Facebook authentication errors
        if (msg.includes("Facebook token mangler")) {
          msg =
            "For at dele på Facebook skal du først logge ind med Facebook. Nyheden er oprettet, men ikke delt på Facebook.";
        }
      } else if (typeof error === "string") {
        msg = error;
      }
      setErrors((prev) => ({ ...prev, general: msg }));
      alert("Fejl ved oprettelse af nyhed: " + msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 250) {
      setDesc(e.target.value);
    }
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
      {fbPostLink && (
        <div className="alert alert-success mt-2">
          <span>
            Facebook opslag oprettet:{" "}
            <a
              href={fbPostLink}
              target="_blank"
              rel="noopener noreferrer"
              className="link link-primary"
            >
              Se opslag
            </a>
          </span>
        </div>
      )}
      <form
        onSubmit={handleCreateNews}
        className="flex flex-col items-start gap-5 w-full"
      >
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-14 w-full">
          <div className="flex flex-col gap-5 ">
            <fieldset className="flex flex-col gap-2 relative w-full fieldset max-w-xs">
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

            <fieldset className="flex flex-col gap-2 relative w-full fieldset max-w-xs">
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
          </div>

          <div className="flex flex-col gap-5 relative">
            <fieldset className="flex flex-col gap-2 relative w-full fieldset max-w-xs">
              <legend className="fieldset-legend">{t("choose_images")}</legend>
              <input
                name="images"
                type="file"
                className="file-input file-input-bordered file-input-md w-full"
                onChange={handleImageChange}
                multiple
                required
              />
              {errors.images && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.images}
                </span>
              )}
            </fieldset>

            {images.length > 0 && (
              <fieldset className="w-full flex flex-col justify-center gap-3 relative fieldset max-w-md">
                <legend className="fieldset-legend">
                  Valgte billeder ( {images.length} / 10 )
                </legend>
                <div className="carousel rounded-box h-full gap-2">
                  {[...images].reverse().map((file, index) => {
                    const url = URL.createObjectURL(file);
                    return (
                      <div
                        key={index}
                        className="carousel-item relative group h-full"
                      >
                        <Image
                          src={url}
                          alt={`Billede ${images.length - index}`}
                          width={192}
                          height={128}
                          className="w-48 h-32 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setImages((prev) => {
                              const reversed = [...prev].reverse();
                              const filtered = reversed.filter(
                                (_, i) => i !== index
                              );
                              return filtered.reverse();
                            })
                          }
                          className="absolute top-1 right-1 btn btn-xs btn-soft hidden group-hover:block"
                          title="Fjern billede"
                        >
                          <FaXmark className="" />
                        </button>
                      </div>
                    );
                  })}
                </div>
                {images.length >= 10 && (
                  <div className="text-xs text-primary font-medium mt-1">
                    Maks. 10 billeder kan vælges.
                  </div>
                )}
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
        <fieldset className="flex items-center gap-3">
          <input
            type="checkbox"
            name="postToInstagram"
            className="toggle toggle-primary"
            checked={postToInstagram}
            onChange={(e) => setPostToInstagram(e.target.checked)}
          />
          <label htmlFor="postToInstagram" className="label-text">
            {t("share_instagram")}
          </label>
        </fieldset>

        <button
          type="submit"
          className="btn btn-primary mt-2"
          disabled={loading}
        >
          {loading ? t("creating") : t("create") + " " + t("news")}
        </button>
      </form>
    </div>
  );
};

export default CreateNews;
