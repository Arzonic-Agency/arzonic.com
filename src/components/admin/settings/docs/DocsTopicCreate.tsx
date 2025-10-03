import { createDocsTopic } from "@/lib/server/actions";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const DocsTopicCreate = ({ onSave }: { onSave: () => void }) => {
  const { t } = useTranslation();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [errors, setErrors] = useState({
    title: "",
    slug: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!title || !slug) {
      setErrors({
        title: !title ? t("createJob.errors.title") : "",
        slug: !slug ? t("createJob.errors.slug") : "",
      });
      setLoading(false);
      return;
    }

    try {
      await createDocsTopic(title, slug);
      onSave();
    } catch (error) {
      console.error("Failed to create job:", error);
      alert(t("createJob.createError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full p-3 pt-5">
      <span className="text-lg font-bold">{t("createJob.formTitle")}</span>

      <form onSubmit={handleSave} className="flex flex-col gap-5 w-full">
        <div className="flex flex-col lg:flex-row gap-5 w-full">
          <div className="flex flex-col gap-5 w-full">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                {t("createDocsTopic.title")}
              </legend>
              <input
                type="text"
                className="input input-bordered input-md"
                placeholder={t("createDocsTopic.placeholders.title")}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {errors.title && (
                <span className="text-xs text-red-500">{errors.title}</span>
              )}
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                {t("createDocsTopic.slug")}
              </legend>
              <input
                type="text"
                className="input input-bordered input-md"
                placeholder={t("createDocsTopic.placeholders.slug")}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
              {errors.slug && (
                <span className="text-xs text-red-500">{errors.slug}</span>
              )}
            </fieldset>
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="btn btn-primary mt-2"
            disabled={loading}
          >
            {loading ? t("createJob.creating") : t("createJob.create")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DocsTopicCreate;
