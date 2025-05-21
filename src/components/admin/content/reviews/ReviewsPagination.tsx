import React from "react";
import { useTranslation } from "react-i18next";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

interface ReviewPaginationProps {
  page: number;
  setPage: (page: number) => void;
  total: number;
}

const ReviewsPagination = ({ page, setPage, total }: ReviewPaginationProps) => {
  const totalPages = Math.ceil(total / 6);
  const { t } = useTranslation();
  const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className="join bg-base-100">
      <button
        className="join-item btn bg-base-100"
        onClick={handlePrevious}
        disabled={page === 1}
        aria-label={t("aria.reviewsPagination.previousPage")}
      >
        <FaAngleLeft />
      </button>
      <span className="join-item btn bg-base-100">
        {t("site")} {page}
      </span>
      <button
        className="join-item btn bg-base-100"
        onClick={handleNext}
        disabled={page >= totalPages}
        aria-label={t("aria.reviewsPagination.nextPage")}
      >
        <FaAngleRight />
      </button>
    </div>
  );
};

export default ReviewsPagination;
