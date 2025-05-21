import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

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
    <div className="grid grid-cols-1 place-items-center xl:grid-cols-2 gap-10 w-full max-w-screen-xl">
      {solutions.map((solution, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
        >
          <Link
            href={solution.href}
            className="flex flex-row rounded-xl bg-base-200 ring-2 p-2 ring-base-300 md:hover:bg-base-300 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-primary transition-all duration-300 ease-in-out gap-3 shadow-lg relative max-w-[650px] xl:max-w-[500px]"
            aria-label={t(
              `aria.solutionCards.${solution.key}`,
              `Go to ${solution.key} solution`
            )}
          >
            <div>
              <div className="h-full w-24 sm:h-32 sm:w-32 relative rounded-lg overflow-hidden">
                <Image
                  src={t(`solutionscards.${solution.key}.image`)}
                  alt={t(`solutionscards.${solution.key}.title`)}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#17171797] via-tranparent to-transparent z-10" />
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
        </motion.div>
      ))}
    </div>
  );
};

export default SolutionCards;
