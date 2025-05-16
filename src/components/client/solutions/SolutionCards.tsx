import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

const SolutionCards = () => {
  const { t } = useTranslation();

  const solutions = [
    {
      key: "custom",
      href: "/solutions/custom-websites",
    },
    {
      key: "webapp",
      href: "/solutions/web-applications",
    },
    {
      key: "visualization",
      href: "/solutions/3d-visualization",
    },
    {
      key: "design",
      href: "/solutions/design-animation",
    },
  ];

  return (
    <div className="flex flex-col gap-10 w-full max-w-screen-xl mx-auto">
      {solutions.map((solution, index) => (
        <Link
          href={solution.href}
          key={index}
          className="flex flex-row rounded-xl bg-base-200 ring-2 p-2 ring-base-300 hover:bg-base-300  transition-colors duration-400 ease-in-out gap-3 shadow-lg relative"
        >
          <div>
            <div className="h-full w-24 sm:h-32 sm:w-32 relative rounded-lg overflow-hidden">
              <Image
                src={t(`solutionscards.${solution.key}.image`)}
                alt={t(`solutionscards.${solution.key}.title`)}
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="p-2 sm:p-4">
            <h2 className="text-lg sm:text-xl font-semibold mb-2">
              {t(`solutionscards.${solution.key}.title`)}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              {t(`solutionscards.${solution.key}.description`)}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SolutionCards;
