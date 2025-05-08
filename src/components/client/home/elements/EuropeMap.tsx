const EuropeMap = () => {
  return (
    <div className="relative w-full h-[400px] ">
      <div
        className="absolute inset-0 bg-[url('/backgrounds/noise2.svg')] bg-fixed bg-repeat europe-map"
        style={{
          WebkitMaskImage: `url('/elements/europe.svg')`,
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          WebkitMaskSize: "contain",
          maskImage: `url('/elements/europe.svg')`,
          maskRepeat: "no-repeat",
          maskPosition: "center",
          maskSize: "contain",
        }}
      />
    </div>
  );
};

export default EuropeMap;
