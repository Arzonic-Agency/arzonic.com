import Image from "next/image";
import React from "react";

const Preview = () => {
  return (
    <div className="flex items-center justify-center h-full w-full relative overflow-hidden">
      <div className="z-10 max-w-4xl max-h-4xl flex items-center justify-center overflow-hidden">
        <Image
          src="/backgrounds/mockup-preview.png"
          alt=""
          width={1000}
          height={500}
        />
      </div>
      {/* <div className="absolute w-full h-full opacity-55">
        <Image src="/backgrounds/lines.svg" alt="" fill />
      </div> */}
    </div>
  );
};

export default Preview;
