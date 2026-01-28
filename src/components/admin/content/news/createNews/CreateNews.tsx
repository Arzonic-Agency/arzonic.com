import React, { useState, useEffect, useCallback } from "react";
import { createNews } from "@/lib/server/actions";
import { FaXmark, FaFacebook, FaInstagram, FaCheck } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import {
  useNewsRealtime,
  type NewsSocialStatus,
} from "@/hooks/useNewsRealtime";

type LoadingPhase = "idle" | "uploading" | "processing_social" | "done";

const CreateNews = ({
  onNewsCreated,
  setShowCreateNews,
  fetchNews,
}: {
  onNewsCreated: () => void;
  setShowCreateNews: (show: boolean) => void;
  fetchNews?: () => void;
}) => {
  const { t } = useTranslation();
  const [desc, setDesc] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [postToFacebook, setPostToFacebook] = useState(true);
  const [postToInstagram, setPostToInstagram] = useState(true);
  const [errors, setErrors] = useState<{
    desc?: string;
    general?: string;
    instagram?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState<LoadingPhase>("idle");
  const [createdNewsId, setCreatedNewsId] = useState<number | null>(null);
  const [socialStatus, setSocialStatus] = useState<{
    facebook?: "pending" | "success" | "error";
    instagram?: "pending" | "success" | "error";
  }>({});

  // Listen for realtime updates on the created news
  const handleStatusUpdate = useCallback(
    (update: {
      social_status?: NewsSocialStatus;
      sharedFacebook?: boolean;
      sharedInstagram?: boolean;
      linkFacebook?: string | null;
      linkInstagram?: string | null;
    }) => {
      // Update social status based on realtime update
      if (update.sharedFacebook && update.linkFacebook) {
        setSocialStatus((prev) => ({ ...prev, facebook: "success" }));
      }
      if (update.sharedInstagram && update.linkInstagram) {
        setSocialStatus((prev) => ({ ...prev, instagram: "success" }));
      }

      // Social posting happens in background, we don't wait for it here
    },
    [setShowCreateNews, fetchNews, onNewsCreated],
  );

  useNewsRealtime(createdNewsId, handleStatusUpdate);

  // Create object URLs for images (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Create new URLs
      const newUrls = images.map((file) => URL.createObjectURL(file));
      setImageUrls((prevUrls) => {
        // Clean up old URLs first
        prevUrls.forEach((url) => {
          if (url.startsWith("blob:")) {
            URL.revokeObjectURL(url);
          }
        });
        return newUrls;
      });

      // Cleanup function for when component unmounts or dependencies change
      return () => {
        newUrls.forEach((url) => URL.revokeObjectURL(url));
      };
    }
  }, [images]);

  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    if (!desc) {
      setErrors({ desc: "Beskrivelse er påkrævet" });
      return;
    }

    // Validate Instagram sharing
    if (postToInstagram && images.length === 0) {
      setErrors({
        instagram:
          "Instagram kræver mindst ét billede. Tilføj et billede eller slå Instagram deling fra.",
      });
      return;
    }

    setLoading(true);
    setLoadingPhase("uploading");
    setErrors({});

    // Initialize social status if posting to social media
    if (postToFacebook || postToInstagram) {
      setSocialStatus({
        ...(postToFacebook ? { facebook: "pending" } : {}),
        ...(postToInstagram ? { instagram: "pending" } : {}),
      });
    }

    try {
      const result = await createNews({
        content: desc,
        images,
        sharedFacebook: postToFacebook,
        sharedInstagram: postToInstagram,
      });

      // Store the news ID for realtime updates
      setCreatedNewsId(result.newsId);

      // If social posting is happening in background
      if (result.status === "processing_social") {
        // Social posting happens in background, close modal after short delay
        setLoadingPhase("processing_social");
        setTimeout(() => {
          setLoading(false);
          setLoadingPhase("idle");
          onNewsCreated();
          setShowCreateNews(false);
          if (fetchNews) fetchNews();
        }, 2500);
      } else {
        // No social posting, close immediately
        setDesc("");
        setImages([]);
        setPostToFacebook(true);
        setPostToInstagram(true);
        setErrors({});
        setShowCreateNews(false);
        onNewsCreated();
        if (fetchNews) fetchNews();
        setLoading(false);
        setLoadingPhase("idle");
      }
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : "Ukendt fejl";

      setErrors({ general: msg });
      setLoading(false);
      setLoadingPhase("idle");
      setSocialStatus({});
    }
  };

  const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 800) setDesc(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles].slice(0, 10));
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full p-1 md:p-3">
      <span className="text-lg font-bold">{t("news_creation")}</span>

      <form
        onSubmit={handleCreateNews}
        className="flex flex-col items-start gap-5 w-full"
      >
        <div className="flex flex-col gap-7 w-full">
          <div className="flex flex-col gap-5 w-full">
            <fieldset className="flex flex-col gap-2 fieldset w-full relative md:max-w-sm">
              <legend className="fieldset-legend">{t("desc")}</legend>
              <textarea
                name="desc"
                className="textarea textarea-md  w-full"
                value={desc}
                onChange={handleDescChange}
                required
                placeholder={t("write_desc")}
                maxLength={800}
                cols={30}
                rows={8}
                style={{ resize: "none" }}
                disabled={loading}
              />
              <div className="text-right text-xs font-medium text-zinc-500 absolute right-1 -bottom-5">
                {desc.length} / 800
              </div>
              {errors.desc && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.desc}
                </span>
              )}
            </fieldset>
          </div>

          <div className="flex flex-col gap-5 w-full">
            <fieldset className="flex flex-col gap-2 fieldset w-full relative md:max-w-sm">
              <legend className="fieldset-legend">{t("choose_images")}</legend>
              <input
                name="images"
                type="file"
                className="file-input file-input-md w-full"
                onChange={handleImageChange}
                multiple
                disabled={loading}
              />
            </fieldset>

            {images.length > 0 && (
              <fieldset className="fieldset w-full flex flex-col gap-3 md:max-w-sm">
                <legend className="fieldset-legend">
                  {t("chosen_images")} ( {images.length} / 10 )
                </legend>
                <div className="carousel gap-3">
                  {images.map((file, index) => {
                    const url = imageUrls[index] || URL.createObjectURL(file);
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
                          className="rounded-lg object-cover w-48 h-56"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 btn md:btn-xs btn-sm btn-soft md:hidden md:group-hover:block text-lg"
                          onClick={() => {
                            setImages((prev) =>
                              prev.filter((_, i) => i !== index),
                            );
                          }}
                          title="Fjern billede"
                          disabled={loading}
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

          {errors.instagram && (
            <span className="text-sm text-red-500">{errors.instagram}</span>
          )}

          {errors.general && (
            <span className="text-sm text-red-500">{errors.general}</span>
          )}
        </div>
        <div className="flex flex-col gap-5">
          <fieldset className="flex items-center gap-3">
            <input
              type="checkbox"
              name="postToFacebook"
              className="toggle toggle-primary"
              checked={postToFacebook}
              onChange={(e) => setPostToFacebook(e.target.checked)}
              disabled={loading}
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
              disabled={loading}
            />
            <label htmlFor="postToInstagram" className="label-text">
              {t("share_instagram")}
              {postToInstagram && images.length === 0 && (
                <span className="ml-2 text-xs text-primary">
                  (kræver billede)
                </span>
              )}
            </label>
          </fieldset>
        </div>

        <button
          type="submit"
          className="btn btn-sm btn-primary mt-2"
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
