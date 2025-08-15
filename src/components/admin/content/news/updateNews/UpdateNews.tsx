import React, { useState, useEffect } from "react";
import { updateNews, getNewsById } from "@/lib/server/actions";
import { FaXmark } from "react-icons/fa6";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { FaInfoCircle } from "react-icons/fa";

interface NewsImage {
  url: string;
  path: string;
}

const UpdateNews = ({
  newsId,
  onNewsUpdated,
}: {
  newsId: number;
  onNewsUpdated: () => void;
}) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<NewsImage[]>([]);
  const [removedExistingImages, setRemovedExistingImages] = useState<string[]>(
    []
  );
  const [errors, setErrors] = useState({
    title: "",
    content: "",
    images: "",
  });
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const news = await getNewsById(newsId);
        if (!news) {
          console.error("News not found");
          return;
        }
        setTitle(news.title || "");
        setContent(news.content || news.desc || "");

        if (Array.isArray(news.images)) {
          const imageObjects = news.images
            .map((img: string | NewsImage) => {
              if (typeof img === "string") {
                // Legacy format - extract path from URL
                // URL format: https://[project].supabase.co/storage/v1/object/public/news-images/[user_id]/[filename]
                const urlParts = img.split("/");
                const newsImageIndex = urlParts.indexOf("news-images");
                if (
                  newsImageIndex !== -1 &&
                  newsImageIndex < urlParts.length - 1
                ) {
                  // Get everything after 'news-images/' as the path
                  const path = urlParts.slice(newsImageIndex + 1).join("/");
                  return { url: img, path };
                }
                // Fallback to just filename
                return { url: img, path: urlParts[urlParts.length - 1] || img };
              } else if (
                img &&
                typeof img === "object" &&
                img.url &&
                img.path
              ) {
                return img;
              }
              return null;
            })
            .filter(Boolean) as NewsImage[];
          setExistingImages(imageObjects);
        } else if (news.image) {
          // Handle single image (legacy)
          const urlParts = news.image.split("/");
          const newsImageIndex = urlParts.indexOf("news-images");
          let path = news.image;
          if (newsImageIndex !== -1 && newsImageIndex < urlParts.length - 1) {
            path = urlParts.slice(newsImageIndex + 1).join("/");
          } else {
            path = urlParts[urlParts.length - 1] || news.image;
          }
          setExistingImages([{ url: news.image, path }]);
        } else {
          setExistingImages([]);
        }
      } catch (error) {
        console.error("Failed to fetch news:", error);
      }
    };
    fetchNews();
  }, [newsId]);

  const handleUpdateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!title || !content) {
      setErrors({
        title: !title ? "Titel er påkrævet" : "",
        content: !content ? "Beskrivelse er påkrævet" : "",
        images: "",
      });
      setLoading(false);
      return;
    }
    try {
      // Combine existing images (minus removed ones) and new images
      const imagesToKeep = existingImages.filter(
        (img) => !removedExistingImages.includes(img.path)
      );
      const imagePaths = imagesToKeep.map((img) => img.path);

      console.log("🔍 [UpdateNews] Existing images:", existingImages);
      console.log("🔍 [UpdateNews] Removed images:", removedExistingImages);
      console.log("🔍 [UpdateNews] Images to keep:", imagesToKeep);
      console.log("🔍 [UpdateNews] Image paths to send:", imagePaths);
      console.log("🔍 [UpdateNews] New images:", images);

      // Send both existing image paths and new images to updateNews
      await updateNews(newsId, title, content, images, imagePaths);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      onNewsUpdated();
    } catch (error) {
      let msg = "Ukendt fejl";
      if (error instanceof Error) {
        msg = error.message;
      } else if (typeof error === "string") {
        msg = error;
      }
      setErrors((prevErrors) => ({
        ...prevErrors,
        general: msg,
      }));
      alert("Fejl ved opdatering af nyhed: " + msg);
    } finally {
      setLoading(false);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 250) {
      setContent(e.target.value);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles]);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full p-1 md:p-3">
      <span className="text-lg font-bold">
        {" "}
        {t("edit")} {t("news")}
      </span>
      <span className="alert">
        <FaInfoCircle className="inline-block text-primary" />
        Changes will repost it as a new post.
      </span>
      <form
        onSubmit={handleUpdateNews}
        className="flex flex-col items-start gap-5 w-full"
      >
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-14 w-full">
          <div className="flex flex-col gap-5 w-full">
            <fieldset className="flex flex-col gap-2 relative w-full fieldset md:max-w-sm">
              <legend className="fieldset-legend">{t("title")}</legend>
              <input
                name="title"
                type="text"
                className="input input-md w-full"
                placeholder={t("write_title")}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              {errors.title && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.title}
                </span>
              )}
            </fieldset>
            <fieldset className="flex flex-col gap-2 relative w-full fieldset md:max-w-sm">
              <legend className="fieldset-legend">{t("desc")}</legend>
              <textarea
                name="content"
                className="textarea textarea-md w-full"
                value={content}
                onChange={handleContentChange}
                required
                placeholder={t("write_desc")}
                style={{ resize: "none" }}
                cols={30}
                rows={8}
              ></textarea>
              <div className="text-right text-xs font-medium text-gray-500">
                {content.length} / 250
              </div>
              {errors.content && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.content}
                </span>
              )}
            </fieldset>
          </div>
          <div className="flex flex-col gap-5 relative  w-full">
            <fieldset className="flex flex-col gap-2 relative w-full fieldset md:max-w-sm">
              <legend className="fieldset-legend">{t("choose_images")}</legend>
              <input
                name="images"
                type="file"
                className="file-input file-input-md w-full"
                onChange={handleImageChange}
                multiple
              />
              {errors.images && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.images}
                </span>
              )}
            </fieldset>
            {(existingImages.length > 0 || images.length > 0) && (
              <fieldset className="w-full flex flex-col justify-center gap-3 relative fieldset md:max-w-sm">
                <legend className="fieldset-legend">
                  {t("chosen_images")} ({" "}
                  {images.length +
                    (existingImages.length - removedExistingImages.length)}{" "}
                  )
                </legend>
                <div className="carousel rounded-box h-full gap-3">
                  {existingImages
                    .filter((img) => !removedExistingImages.includes(img.path))
                    .map((img, index) => (
                      <div
                        key={"existing-" + index}
                        className="carousel-item relative group h-full"
                      >
                        <Image
                          src={img.url}
                          alt={`Billede ${index + 1}`}
                          className="w-48 h-48 object-cover rounded-lg"
                          width={192}
                          height={128}
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 btn btn-xs btn-soft hidden group-hover:block"
                          onClick={() =>
                            setRemovedExistingImages((prev) => [
                              ...prev,
                              img.path,
                            ])
                          }
                          title="Fjern billede"
                        >
                          <FaXmark />
                        </button>
                      </div>
                    ))}
                  {images.map((file, index) => {
                    const url = URL.createObjectURL(file);
                    return (
                      <div
                        key={"new-" + index}
                        className="carousel-item relative group h-full"
                      >
                        <Image
                          src={url}
                          alt={`Billede ${existingImages.length + index + 1}`}
                          className="w-48 h-48 object-cover rounded-lg"
                          width={192}
                          height={128}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setImages((prev) =>
                              prev.filter((_, i) => i !== index)
                            )
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
              </fieldset>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary mt-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              {t("updating")}
            </>
          ) : (
            t("update") + " " + t("news")
          )}
        </button>
      </form>
      {showToast && (
        <div className="toast bottom-20 md:bottom-0 toast-end">
          <div className="alert alert-success text-neutral-content">
            <span className="text-base md:text-lg">Nyhed opdateret</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateNews;
