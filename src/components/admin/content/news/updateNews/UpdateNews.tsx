import React, { useState, useEffect } from "react";
import { updateNews, getNewsById } from "@/lib/server/actions";
import { FaXmark } from "react-icons/fa6";
import Image from "next/image";

interface NewsImage {
  path: string;
  sort_order?: number;
}

const UpdateNews = ({
  newsId,
  onNewsUpdated,
}: {
  newsId: number;
  onNewsUpdated: () => void;
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
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
        // If your backend supports multiple images, adapt this accordingly
        if (Array.isArray(news.images)) {
          // Map to string[] if images are objects with a 'path' property
          const urls = news.images
            .map((img: string | NewsImage) =>
              typeof img === "string" ? img : img?.path || ""
            )
            .filter(Boolean);
          setExistingImages(urls);
        } else if (news.image) {
          setExistingImages([news.image]);
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
      await updateNews(newsId, title, content, images);
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
      setImages((prev) => {
        const combined = [...prev, ...newFiles];
        return combined.slice(0, 10);
      });
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full p-3">
      <span className="text-lg font-bold">Opdater nyhed</span>
      <form
        onSubmit={handleUpdateNews}
        className="flex flex-col items-start gap-5 w-full"
      >
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-14 w-full">
          <div className="flex flex-col gap-5 ">
            <fieldset className="flex flex-col gap-2 relative w-full fieldset max-w-xs">
              <legend className="fieldset-legend">Titel</legend>
              <input
                name="title"
                type="text"
                className="input input-bordered input-md"
                placeholder="Skriv en nyhedstitel..."
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
            <fieldset className="flex flex-col gap-2 relative w-full fieldset max-w-xs">
              <legend className="fieldset-legend">Beskrivelse</legend>
              <textarea
                name="content"
                className="textarea textarea-bordered textarea-md text"
                value={content}
                onChange={handleContentChange}
                required
                placeholder="Skriv en mindre nyhedsartikel..."
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
          <div className="flex flex-col gap-5 relative">
            <fieldset className="flex flex-col gap-2 relative w-full fieldset max-w-xs">
              <legend className="fieldset-legend">Vælg billede(r)</legend>
              <input
                name="images"
                type="file"
                className="file-input file-input-bordered file-input-md w-full"
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
              <fieldset className="w-full flex flex-col justify-center gap-3 relative fieldset max-w-md">
                <legend className="fieldset-legend">
                  Valgte billeder ( {images.length + existingImages.length} / 10
                  )
                </legend>
                <div className="carousel rounded-box h-full gap-2">
                  {existingImages.map((url, index) => (
                    <div
                      key={"existing-" + index}
                      className="carousel-item relative group h-full"
                    >
                      <Image
                        src={url}
                        alt={`Billede ${index + 1}`}
                        className="w-48 h-32 object-cover"
                        width={192}
                        height={128}
                      />
                      {/* Optionally, add a remove button for existing images if supported */}
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
                          className="w-48 h-32 object-cover"
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
                {images.length + existingImages.length >= 10 && (
                  <div className="text-xs text-red-500 font-medium mt-1">
                    Maks. 10 billeder kan vælges.
                  </div>
                )}
              </fieldset>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary mt-2"
          disabled={loading}
        >
          {loading ? "Opdaterer" : "Opdater nyhed"}
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
