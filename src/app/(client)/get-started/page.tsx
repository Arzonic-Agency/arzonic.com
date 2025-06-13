import { Metadata } from "next";
import GetStartedPage from "./GetStartedPage";

export const metadata: Metadata = {
  title: "Get Started",
  description:
    "Estimate the price of your digital solution in minutes with our interactive project calculator.",
};

export default function Page() {
  return <GetStartedPage />;
}
