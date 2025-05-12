import React from "react";
import { useTranslation } from "react-i18next";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

interface RequestsPaginationProps {
  page: number;
  setPage: (page: number) => void;
  total: number;
}

const RequestsPagination = ({
  page,
  setPage,
  total,
}: RequestsPaginationProps) => {
  const totalPages = Math.ceil(total / 6); // Calculate total pages based on 6 items per page
  const { t } = useTranslation();

  if (total <= 6) {
    return null; // Do not render pagination if there are 6 or fewer requests
  }

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
    <div className="join w-full flex justify-center">
      <button
        className="join-item btn "
        onClick={handlePrevious}
        disabled={page === 1}
      >
        <FaAngleLeft />
      </button>
      <span className="join-item btn text-zinc-400">
        {t("site")} {page} / {totalPages}{" "}
      </span>
      <button
        className="join-item btn"
        onClick={handleNext}
        disabled={page >= totalPages}
      >
        <FaAngleRight />
      </button>
    </div>
  );
};

export default RequestsPagination;
