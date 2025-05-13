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
  );
};

export default EuropeMap;
