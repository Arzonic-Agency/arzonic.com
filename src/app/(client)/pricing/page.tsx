import { Metadata } from "next";
import PricingPage from "./PricingPage";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "We offer transparent pricing for our web development services. Choose from our packages or get a custom quote tailored to your needs.",
};

export default function Page() {
  return <PricingPage />;
}
