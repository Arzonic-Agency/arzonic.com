import React from "react";
import { useTranslation } from "react-i18next";

interface CreateRatingProps {
  rate: number;
  setRate: (rate: number) => void;
}

const CreateRating = ({ rate, setRate }: CreateRatingProps) => {
  const { t } = useTranslation();
  return (
    <div className="rating rating-lg md:rating-md flex gap-2">
      <input
        type="radio"
        name="rating-4"
        className="mask mask-star-2 bg-secondary"
        checked={rate === 1}
        onChange={() => setRate(1)}
        aria-label={t("aria.createRating.rate1")}
      />
      <input
        type="radio"
        name="rating-4"
        className="mask mask-star-2 bg-secondary"
        checked={rate === 2}
        onChange={() => setRate(2)}
        aria-label={t("aria.createRating.rate2")}
      />
      <input
        type="radio"
        name="rating-4"
        className="mask mask-star-2 bg-secondary"
        checked={rate === 3}
        onChange={() => setRate(3)}
        aria-label={t("aria.createRating.rate3")}
      />
      <input
        type="radio"
        name="rating-4"
        className="mask mask-star-2 bg-secondary"
        checked={rate === 4}
        onChange={() => setRate(4)}
        aria-label={t("aria.createRating.rate4")}
      />
      <input
        type="radio"
        name="rating-4"
        className="mask mask-star-2 bg-secondary"
        checked={rate === 5}
        onChange={() => setRate(5)}
        aria-label={t("aria.createRating.rate5")}
      />
    </div>
  );
};

export default CreateRating;
