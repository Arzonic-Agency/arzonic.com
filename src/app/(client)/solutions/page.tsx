import { Metadata } from "next";
import SolutionsPage from "./SolutionsPage";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Discover our range of digital services – from custom websites and web apps to 3D visualization and interactive design.",
};

export default function Page() {
  return <SolutionsPage />;
}
