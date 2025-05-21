import React from "react";
import { FaStar } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

interface ReviewsRatingProps {
  rate: number;
}

const ReviewsRating = ({ rate }: ReviewsRatingProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex gap-2 text-primary md:text-lg">
      {[...Array(rate)].map((_, index) => (
        <FaStar
          key={index}
          aria-label={t("aria.reviewsRating.star", { index: index + 1 })}
        />
      ))}
    </div>
  );
};

export default ReviewsRating;
