"use client";

import React, { useState, useEffect } from "react";
import CasesList from "./CasesList";
import { getAllCases } from "@/lib/client/actions";
import CasesPagination from "./CasesPagination";
import CasesFilter from "./CasesFilter";

const Cases = () => {
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const { total } = await getAllCases(page);
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
      <CasesList page={page} setTotal={setTotal} />
      <div className="flex w-full justify-center">
        {total > 6 && (
          <CasesPagination page={page} setPage={setPage} total={total} />
        )}
      </div>
    </div>
  );
};

export default Cases;
