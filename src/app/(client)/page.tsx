import { Metadata } from "next";
import HomePage from "./HomePage";

export const metadata: Metadata = {
  title: {
    absolute: "Arzonic – Danish Software Agency ",
  },
  description:
    "We develop intelligent web apps for ambitious businesses. Specializing in custom web applications, powerful dashboards, and stunning 3D experiences powered by cutting-edge technology.",
};

export default function Page() {
  return (
    <>
      <p className="sr-only">
        We are a software agency building custom websites, web applications, and
        immersive 3D experiences for businesses across Europe.
      </p>
      <HomePage />
    </>
  );
}
