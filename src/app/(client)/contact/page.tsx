import { Metadata } from "next";
import ContactPage from "./ContactPage";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Ready to start your project? Contact Arzonic to discuss your goals and find the right digital solution.",
};

export default function Page() {
  return <ContactPage />;
}
