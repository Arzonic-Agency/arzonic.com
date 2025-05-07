import Image from "next/image";
import React from "react";

const Preview = () => {
  return (
    <div className="flex items-center justify-center h-full w-full relative overflow-hidden">
      <div className="z-10">
        <Image src="/models/screen.png" alt="" width={1000} height={500} />
      </div>
      <div className="absolute -left-36 -rotate-[20deg] opacity-70 ">
        <Image
          src="/backgrounds/flashL.png"
          alt=""
          width={1000}
          height={1000}
        />
      </div>
      <div className="absolute -right-36 rotate-[20deg] opacity-70">
        <Image
          src="/backgrounds/flashR.png"
          alt=""
          width={1000}
          height={1000}
        />
      </div>
    </div>
  );
};

export default Preview;
