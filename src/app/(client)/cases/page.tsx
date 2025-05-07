import React from "react";

const Cases = () => {
  return (
    <div className="p-5 sm:p-7 w-full h-full flex flex-col gap-10 md:gap-15 xl:gap-28 justify-center items-center relative my-20">
      <div className="max-w-md md:max-w-lg">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center">
          Se hvad vi har
          <span className="text-primary"> skabt for andre </span>
        </h1>
      </div>
      <div className="flex flex-col md:flex-row gap-10 md:gap-16">
        <div className="flex-initial md:w-3/5 flex justify-center"></div>
        <div className="flex-1 md:w-2/5 relative"></div>
      </div>
    </div>
  );
};

export default Cases;
