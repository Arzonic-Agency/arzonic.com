import React, { useEffect, useState } from "react";

const ParallaxBox = () => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="h-48 bg-cover bg-no-repeat rounded-xl"
      style={{
        backgroundImage: "url('/backgrounds/noise.svg')",
        backgroundPosition: `center ${offset * 0.2}px`,
      }}
    >
      {/* Content here */}
    </div>
  );
};
