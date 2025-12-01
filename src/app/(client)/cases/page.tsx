import { Metadata } from "next";
import CasesPage from "./CasesPage";
import { getAllCases } from "@/lib/server/actions";

const PAGE_SIZE = 6;

export const metadata: Metadata = {
  title: "Cases",
  description:
    "Explore the projects we've delivered – performance-driven, visually sharp digital solutions across industries.",
};

export default async function Page() {
  const { cases, total } = await getAllCases(1, PAGE_SIZE);

  return <CasesPage initialCases={cases} initialTotal={total} />;
}
