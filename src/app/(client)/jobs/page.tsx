import { Metadata } from "next";
import JobsPage from "./JobsPage";

export const metadata: Metadata = {
  title: "Jobs",
  description:
    "We're looking for creative, ambitious talent to join our team. See open positions and join our journey.",
};

export default function Page() {
  return <JobsPage />;
}
