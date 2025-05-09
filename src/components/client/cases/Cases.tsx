"use client";

import React, { useState, useEffect } from "react";
import CasesList from "./CasesList";
import { useTranslation } from "react-i18next";
import { getAllCases } from "@/lib/client/actions";
import CasesPagination from "./CasesPagination";
import CasesFilter from "./CasesFilter";

const Cases = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [cases, setCases] = useState<any[]>([]);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const { cases, total } = await getAllCases(page);
        setCases(cases);
        setTotal(total);
      } catch (error) {
        console.error("Failed to fetch cases:", error);
      }
    };

    fetchCases();
  }, [page]);

  return (
    <div className="flex flex-col md:items-start gap-7  w-full">
      <CasesFilter />
      <CasesList
        cases={cases}
        page={page}
        setTotal={setTotal}
        onEditCase={(caseId: number) => {}}
      />
      <div className="flex w-full justify-center">
        {total > 6 && (
          <CasesPagination page={page} setPage={setPage} total={total} />
        )}
      </div>
    </div>
  );
};

export default Cases;
