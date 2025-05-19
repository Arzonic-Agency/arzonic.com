import { Metadata } from "next";
import HomePage from "./HomePage";

export const metadata: Metadata = {
  title: {
    absolute: "Arzonic – Danish Modern Web Agency ",
  },
  description:
    "We specialize in building high-performance webapplications and immersive 3D experiences using modern",
};

export default function Page() {
  return <HomePage />;
}
