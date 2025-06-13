import Image from "next/image";

const EuropeMap = () => {
  return (
    <Image
      src="/elements/europe.svg"
      alt="Europe Map"
      width={160}
      height={128}
      className="h-32 w-auto"
      loading="lazy"
      priority={false}
    />
  );
};

export default EuropeMap;
