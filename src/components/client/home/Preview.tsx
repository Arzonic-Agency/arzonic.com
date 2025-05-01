import Image from "next/image";
import React from "react";

const Preview = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <Image src="/models/screen.png" alt="" width={1000} height={500} />
    </div>
  );
};

export default Preview;
