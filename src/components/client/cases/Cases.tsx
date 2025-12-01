"use client";

import React, {
  useState,
  useMemo,
  useRef,
  useCallback,
  useEffect,
} from "react";
import CasesList, { CaseItem } from "./CasesList";
import { getAllCases } from "@/lib/client/actions";
import CasesPagination from "./CasesPagination";
import { useTranslation } from "react-i18next";

const PAGE_SIZE = 6;

export type RawCase = {
  id: number;
  company: string;
  desc: string;
  desc_translated: string | null;
  source_lang: string | null;
  city: string;
  image: string | null;
  created_at: string;
  website: string | null;
};

interface CasesProps {
  initialCases: RawCase[];
  initialTotal: number;
  initialPage?: number;
}

const Cases: React.FC<CasesProps> = ({
  initialCases,
  initialTotal,
  initialPage = 1,
}) => {
  const { i18n } = useTranslation();

  const [page, setPage] = useState<number>(initialPage);
  const [total, setTotal] = useState<number>(initialTotal);
  const [rawCases, setRawCases] = useState<RawCase[]>(initialCases);
  const [loading, setLoading] = useState<boolean>(initialCases.length === 0);

  const hasUsedInitial = useRef(false);

  const mapCasesToDisplay = useCallback(
    (cases: RawCase[], language: string): CaseItem[] => {
      const normalizedLang = language === "en" ? "en" : "da";

      return cases.map((item) => {
        const sourceLang = item.source_lang?.toLowerCase() ?? "da";
        const description =
          sourceLang === normalizedLang
            ? item.desc
            : item.desc_translated ?? item.desc;

        return {
          id: item.id,
          company: item.company,
          desc: description,
          image: item.image,
          city: item.city,
          created_at: item.created_at,
          website: item.website,
        };
      });
    },
    []
  );

  const displayCases = useMemo(
    () => mapCasesToDisplay(rawCases, i18n.language),
    [mapCasesToDisplay, rawCases, i18n.language]
  );

  useEffect(() => {
    let isMounted = true;

    const fetchCases = async () => {
      setLoading(true);
      try {
        const { cases, total } = await getAllCases(page, PAGE_SIZE);
        if (!isMounted) return;
        setRawCases((cases as RawCase[]) ?? []);
        setTotal(total);
      } catch (error) {
        console.error("Failed to fetch cases:", error);
        if (isMounted) {
          setRawCases([]);
          setTotal(0);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (!hasUsedInitial.current && page === initialPage) {
      hasUsedInitial.current = true;
      setLoading(false);
    } else {
      fetchCases();
    }

    return () => {
      isMounted = false;
    };
  }, [page, initialPage]);

  return (
    <div className="flex flex-col md:items-start gap-7 max-w-6xl w-full">
      <CasesList cases={displayCases} loading={loading} />
      <div className="flex w-full justify-center">
        {total > PAGE_SIZE && (
          <CasesPagination page={page} setPage={setPage} total={total} />
        )}
      </div>
    </div>
  );
};

export default Cases;
