import React, { useState } from "react";
import { createNews } from "@/lib/server/actions";
import { FaX, FaXmark } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

const CreateNews = ({ onNewsCreated }: { onNewsCreated: () => void }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState({
    title: "",
    desc: "",
    images: "",
  });
  const [loading, setLoading] = useState(false);

  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!title || !desc) {
      setErrors({
        title: !title ? "Titel er påkrævet" : "",
        desc: !desc ? "Beskrivelse er påkrævet" : "",
        images: "",
      });
      setLoading(false);
      return;
    }

    try {
      await createNews({
        title,
        content: desc,
        images,
      });
      setTitle("");
      setDesc("");
      setImages([]);
      onNewsCreated();
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
      setImages((prev) => [...prev, ...newFiles]);
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
                name="desc"
                className="textarea textarea-bordered textarea-md text"
                value={desc}
                onChange={handleDescChange}
                required
                placeholder="Skriv en mindre nyhedsartikel..."
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
              <legend className="fieldset-legend">Vælg billede(r)</legend>
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
                  Valgte billeder ( {images.length} )
                </legend>

                <div className="carousel rounded-box h-full gap-2">
                  {images.map((file, index) => {
                    const url = URL.createObjectURL(file);
                    return (
                      <div
                        key={index}
                        className="carousel-item relative group h-full"
                      >
                        <img
                          src={url}
                          alt={`Billede ${index + 1}`}
                          className="w-48 h-32 object-cover"
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
          {loading ? "Opretter" : "Opret nyhed"}
        </button>
      </form>
    </div>
  );
};

export default CreateNews;
