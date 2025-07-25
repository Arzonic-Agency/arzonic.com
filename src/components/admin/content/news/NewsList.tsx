import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { FaPen, FaTrash, FaFacebook, FaInstagram } from "react-icons/fa6";
import { getAllNews, deleteNews } from "@/lib/server/actions";
import UpdateNews from "./updateNews/UpdateNews";
import { useTranslation } from "react-i18next";
import Link from "next/link";

interface NewsListProps {
  view: "cards" | "list";
  page: number;
  setTotal: (total: number) => void;
  onEditNews: (newsId: number) => void;
}

interface NewsItem {
  id: number;
  title: string;
  content: string | null;
  images: string[];
  sharedFacebook?: boolean;
  sharedInstagram?: boolean;
  linkFacebook?: string;
}

const FALLBACK_IMAGE = "/demo.webp";

const NewsList = ({ view, page, setTotal, onEditNews }: NewsListProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(true);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [editingNewsId, setEditingNewsId] = useState<number | null>(null);
  const [deletingNewsId, setDeletingNewsId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      const { news, total } = await getAllNews(page);
      setNewsItems(news || []);
      setTotal(total);
    } catch (error) {
      console.error("Failed to fetch news:", error);
    } finally {
      setLoading(false);
    }
  }, [page, setTotal]);

  useEffect(() => {
    fetchNews();
  }, [page, setTotal, fetchNews]);

  const truncateDescription = (
    description: string | null,
    maxLength: number
  ) => {
    if (!description || description.length <= maxLength)
      return description || "";
    return description.substring(0, maxLength) + "...";
  };

  const truncateTitle = (title: string, maxLength: number) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + "...";
  };

  const handleNewsUpdated = () => {
    setEditingNewsId(null);
    fetchNews();
  };

  const handleDelete = async () => {
    if (deletingNewsId !== null) {
      try {
        setDeleting(true);
        await deleteNews(deletingNewsId);
        setDeletingNewsId(null);
        setIsModalOpen(false);
        fetchNews();
      } catch (error) {
        console.error("Failed to delete news:", error);
      } finally {
        setDeleting(false);
      }
    }
  };

  const closeModal = () => {
    setDeletingNewsId(null);
    setIsModalOpen(false);
  };

  return (
    <div className="w-full">
      {loading ? (
        <div className="flex justify-center gap-3 items-center h-40">
          <span className="loading loading-spinner loading-md"></span>
          {t("loading_news")}
        </div>
      ) : editingNewsId ? (
        <UpdateNews newsId={editingNewsId} onNewsUpdated={handleNewsUpdated} />
      ) : newsItems.length === 0 ? (
        <div className="flex justify-center items-center h-40 w-full">
          <p className="text-gray-500">{t("no_news")}</p>
        </div>
      ) : (
        <>
          {view === "cards" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
              {newsItems.map((item) => (
                <div
                  key={item.id}
                  className="card card-compact shadow-md border-2 border-base-100 rounded-lg h-full lg:h-[450px]"
                >
                  <figure className="relative w-full aspect-[1/1] overflow-hidden h-72 lg:h-68">
                    {item.images && item.images.length > 0 ? (
                      item.images.length === 1 ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={item.images[0]}
                            alt={item.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover"
                            priority
                          />
                        </div>
                      ) : (
                        <div className="carousel w-full h-full">
                          {item.images.map((image, index) => (
                            <div
                              key={index}
                              id={`slide${item.id}-${index}`}
                              className="carousel-item relative w-full h-full"
                            >
                              <Image
                                src={image}
                                alt={`${item.title} - billede ${index + 1}`}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover"
                                priority={index === 0}
                              />
                              {item.images.length > 1 && (
                                <div className="absolute left-2 right-2 top-1/2 flex -translate-y-1/2 transform justify-between">
                                  <button
                                    className="btn btn-circle btn-xs"
                                    onClick={() => {
                                      const prevSlide = document.getElementById(
                                        `slide${item.id}-${
                                          index === 0
                                            ? item.images.length - 1
                                            : index - 1
                                        }`
                                      );
                                      prevSlide?.scrollIntoView({
                                        behavior: "instant",
                                        block: "nearest",
                                      });
                                    }}
                                  >
                                    ❮
                                  </button>
                                  <button
                                    className="btn btn-circle btn-xs"
                                    onClick={() => {
                                      const nextSlide = document.getElementById(
                                        `slide${item.id}-${
                                          index === item.images.length - 1
                                            ? 0
                                            : index + 1
                                        }`
                                      );
                                      nextSlide?.scrollIntoView({
                                        behavior: "instant",
                                        block: "nearest",
                                      });
                                    }}
                                  >
                                    ❯
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )
                    ) : (
                      <div className="relative w-full h-full">
                        <Image
                          src={FALLBACK_IMAGE}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title text-lg">{item.title}</h2>
                    <p className="text-xs">
                      {truncateDescription(item.content, 100)}
                    </p>
                    <div className="card-actions justify-between items-center mt-2">
                      <div className="flex gap-2">
                        {item.linkFacebook && (
                          <Link
                            href={item.linkFacebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn md:btn-sm"
                            title="Se Facebook opslag"
                          >
                            <FaFacebook />
                            <span className=" font-normal text-base-content ">
                              Facebook
                            </span>
                          </Link>
                        )}
                        {item.sharedInstagram && (
                          <FaInstagram
                            size={20}
                            className="text-purple-600 drop-shadow"
                          />
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="btn md:btn-sm"
                          onClick={() => onEditNews(item.id)}
                        >
                          <FaPen />
                          {t("edit")}
                        </button>
                        <button
                          className="btn md:btn-sm"
                          onClick={() => {
                            setDeletingNewsId(item.id);
                            setIsModalOpen(true);
                          }}
                        >
                          <FaTrash />
                          <span className="hidden md:block">{t("delete")}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {newsItems.map((item) => (
                <React.Fragment key={item.id}>
                  <li>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2 items-center">
                        <div className="relative w-12 aspect-[1/1] rounded-md overflow-hidden">
                          <Image
                            src={
                              item.images && item.images.length > 0
                                ? item.images[0]
                                : FALLBACK_IMAGE
                            }
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <h3 className="font-semibold text-xs hidden sm:block">
                          {item.title}
                        </h3>
                        <h3 className="font-semibold text-xs block sm:hidden">
                          {truncateTitle(item.title, 20)}
                        </h3>
                      </div>
                      <div className="flex gap-5 md:gap-2">
                        <button
                          className="btn btn-sm"
                          onClick={() => onEditNews(item.id)}
                        >
                          <FaPen />
                          <span className="md:flex hidden"> {t("edit")} </span>
                        </button>
                        <button
                          className="btn btn-sm"
                          onClick={() => {
                            setDeletingNewsId(item.id);
                            setIsModalOpen(true);
                          }}
                        >
                          <FaTrash />
                          <span className="md:flex hidden"> Slet </span>
                        </button>
                      </div>
                    </div>
                  </li>
                  <hr className="border-[1px] rounded-lg border-base-200" />
                </React.Fragment>
              ))}
            </ul>
          )}
        </>
      )}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              {" "}
              {t("delete_news_confirmation")}
            </h3>
            <div className="py-4">
              <p className="mb-2">{t("delete_news_prompt")}</p>
              {deletingNewsId &&
                newsItems.find((item) => item.id === deletingNewsId)
                  ?.sharedFacebook && (
                  <div className="text-warning">
                    <span className="text-sm">{t("delete_news_warning")}</span>
                  </div>
                )}
            </div>
            <div className="modal-action">
              <button className="btn" onClick={closeModal}>
                {t("cancel")}
              </button>
              <button
                className="btn btn-error"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    {t("deleting")}
                  </>
                ) : (
                  t("delete")
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsList;
