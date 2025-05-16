import Image from "next/image";
import React from "react";

const solutions = [
  {
    title: "Tilpassede Hjemmesider",
    image: "/backgrounds/custom-websites.jpg",
  },
  {
    title: "Web Applications",
    image: "/backgrounds/web-applications.jpg",
  },
  {
    title: "3D-Visualisering",
    image: "/backgrounds/3d-visualization.jpg",
  },
  {
    title: "Design & Animation",
    image: "/backgrounds/design-animation.jpg",
  },
];

const SolutionCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2  gap-6">
      {solutions.map((solution, index) => (
        <section
          key={index}
          className="flex flex-col gap-3 bg-base-100 rounded-2xl shadow-md p-5 h-full w-96"
        >
          <h2 className="text-lg font-semibold text-start">{solution.title}</h2>
          <div className=" w-full px-9 py-10 rounded-2xl bg-base-200 flex items-center justify-center">
            <div className="h-36 w-full relative rounded-xl overflow-hidden">
              <Image
                src={solution.image}
                alt={solution.title}
                fill
                className="object-cover "
              />
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default SolutionCards;
