import Image from "next/image";

const EuropeMap = () => {
  return (
    <Image
      src="/elements/europe.svg"
      alt="Europe Map"
      width={400}
      height={400}
      className="w-auto h-32"
    />
    // <div className="relative w-full h-[300px] ">
    //   <div
    //     className="absolute inset-0 bg-[url('/backgrounds/noise2.svg')] bg-fixed bg-repeat europe-map"
    //     style={{
    //       WebkitMaskImage: `url('/elements/europe.svg')`,
    //       WebkitMaskRepeat: "no-repeat",
    //       WebkitMaskPosition: "center",
    //       WebkitMaskSize: "contain",
    //       maskImage: `url('/elements/europe.svg')`,
    //       maskRepeat: "no-repeat",
    //       maskPosition: "center",
    //       maskSize: "contain",
    //     }}
    //   />
    // </div>
  );
};

export default EuropeMap;
