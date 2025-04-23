import React, { useState, useEffect, useCallback } from "react";
import { FaLocationDot, FaPen, FaTrash } from "react-icons/fa6";
import { getAllReviews, deleteReview } from "@/lib/server/actions";
import ReviewsRating from "./ReviewsRating";
import { t } from "i18next";

interface ReviewsListProps {
  view: "cards" | "list";
  page: number;
  setTotal: (total: number) => void;
  onEditReview: (reviewId: number) => void;
  loading: boolean; // Used for rendering the loading spinner
}

interface ReviewItem {
  id: number;
  companyName: string;
  contactPerson: string;
  city: string;
  desc: string;
  rate: number;
}

const ReviewsList = ({
  view,
  page,
  setTotal,
  onEditReview,
  loading, // Used for rendering the loading spinner
}: ReviewsListProps) => {
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [deletingReviewId, setDeletingReviewId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const fetchReviews = useCallback(async () => {
    try {
      const { reviews, total } = await getAllReviews(page);
      setReviewItems(reviews || []);
      setTotal(total || 0);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      setReviewItems([]);
      setTotal(0);
    }
  }, [page, setTotal]);

  const handleDelete = async () => {
    if (deletingReviewId !== null) {
      try {
        await deleteReview(deletingReviewId);
        setDeletingReviewId(null);
        setIsModalOpen(false);
        fetchReviews();
      } catch (error) {
        console.error("Failed to delete review:", error);
      }
    }
  };

  const closeModal = () => {
    setDeletingReviewId(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchReviews();
  }, [page, setTotal, fetchReviews]);

  return (
    <div className="w-full">
      {loading ? (
        <div className="flex justify-center gap-3 items-center h-40">
          <span className="loading loading-spinner loading-md"></span>
          Loading {t("reviews")}...
        </div>
      ) : reviewItems.length === 0 ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-lg text-gray-500">{t("no_reviews")}</p>
        </div>
      ) : (
        <>
          {view === "cards" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {reviewItems.map((item) => (
                <div
                  key={item.id}
                  className="card card-compact shadow-lg rounded-md"
                >
                  <div className="card-body gap-3 p-5">
                    <ReviewsRating rate={item.rate} />
                    <p className="text-xs">{item.desc}</p>
                    <div className="flex justify-between items-center mt-1">
                      <h2 className="text-sm font-semibold">
                        {item.contactPerson} {t("from_reviews")}{" "}
                        {item.companyName}
                      </h2>
                    </div>

                    <div className="card-actions justify-end">
                      <button
                        className="btn btn-sm btn-neutral"
                        onClick={() => onEditReview(item.id)}
                      >
                        <FaPen />
                        {t("edit")}
                      </button>
                      <button
                        className="btn btn-sm btn-neutral"
                        onClick={() => {
                          setDeletingReviewId(item.id);
                          setIsModalOpen(true);
                        }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {reviewItems.map((item) => (
                <React.Fragment key={item.id}>
                  <li>
                    <div className="flex gap-3 items-center">
                      <div className="flex gap-2 items-center flex-initial sm:flex-1 w-18 sm:w-auto truncate">
                        <h3 className="font-semibold text-xs hidden sm:block ">
                          {item.contactPerson}, {item.companyName}
                        </h3>
                        <h3 className="font-semibold text-xs block sm:hidden">
                          {item.companyName}
                        </h3>
                      </div>
                      <div className="flex-1">
                        <ReviewsRating rate={item.rate} />
                      </div>
                      <div className="flex gap-5 md:gap-2 flex-1 justify-end">
                        <button
                          className="btn btn-sm"
                          onClick={() => onEditReview(item.id)}
                        >
                          <FaPen />
                          <span className="md:flex hidden"> {t("edit")} </span>
                        </button>
                        <button
                          className="btn btn-sm"
                          onClick={() => {
                            setDeletingReviewId(item.id);
                            setIsModalOpen(true);
                          }}
                        >
                          <FaTrash />
                          <span className="md:flex hidden">
                            {" "}
                            {t("delete")}{" "}
                          </span>
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
              {t("delete_review_confirmation")}
            </h3>
            <p className="py-4">{t("delete_review_prompt")}</p>
            <p className="text-sm text-warning ">
              {t("delete_review_warning")}
            </p>
            <div className="modal-action">
              <button className="btn" onClick={closeModal}>
                {t("cancel")}
              </button>
              <button className="btn btn-error" onClick={handleDelete}>
                {t("delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
