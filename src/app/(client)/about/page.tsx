import { Metadata } from "next";
import AboutPage from "./AboutPage";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Arzonic – a modern web agency focused on tailored digital solutions, 3D, and user experience.",
};

export default function Page() {
  return <AboutPage />;
}
