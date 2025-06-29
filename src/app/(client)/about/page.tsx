import { Metadata } from "next";
import AboutPage from "./AboutPage";

export const metadata: Metadata = {
  title: "About",
  description:
    "Arzonic is a modern software agency specializing in scalable web applications, immersive 3D experiences, and thoughtful digital design.",
};

export default function Page() {
  return <AboutPage />;
}
