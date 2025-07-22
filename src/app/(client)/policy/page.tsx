import { Metadata } from "next";
import PolicyPage from "./PolicyPage";

export const metadata: Metadata = {
  title: "Policy",
  description:
    "This page outlines the policies and terms of service for Arzonic.",
};

export default function Page() {
  return <PolicyPage />;
}
