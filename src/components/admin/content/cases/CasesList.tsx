"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { FaPen, FaTrash } from "react-icons/fa6";
import UpdateCase from "./updateCase/UpdateCase";
import { useTranslation } from "react-i18next";
import { deleteCase } from "@/lib/server/actions";

interface CasesListProps {
  view: "cards" | "list";
  page: number;
  setTotal: (total: number) => void;
  onEditCase: (caseId: number) => void;
}

interface CaseItem {
  id: number;
  company: string;
  desc: string;
  image: string | null;
}

const FALLBACK_IMAGE = "/demo.jpg";

const CasesList = ({ view, page, setTotal, onEditCase }: CasesListProps) => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [caseItems, setCaseItems] = useState<CaseItem[]>([]);
  const [editingCaseId, setEditingCaseId] = useState<number | null>(null);
  const [deletingCaseId, setDeletingCaseId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState<number>(6);

  const fetchCases = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/cases?page=${page}&limit=${itemsPerPage}&lang=${i18n.language}`
      );
      if (!res.ok) throw new Error("Failed to load cases");
      const { cases, total } = await res.json();
      setCaseItems(cases);
      setTotal(total);
    } catch (err) {
      console.error("Failed to fetch cases:", err);
      setCaseItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, itemsPerPage, setTotal, i18n.language]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;
      if (width >= 1920) {
        setItemsPerPage(8);
      } else if (width >= 1024) {
        setItemsPerPage(6);
      } else {
        setItemsPerPage(4);
      }
    };

    updateItemsPerPage();

    window.addEventListener("resize", updateItemsPerPage);

    return () => {
      window.removeEventListener("resize", updateItemsPerPage);
    };
  }, []);

  const truncate = (text: string | null | undefined, max: number) =>
    text && text.length > max ? text.slice(0, max) + "…" : text || "";

  const handleCaseUpdated = () => {
    setEditingCaseId(null);
    fetchCases();
  };

  const handleDelete = async () => {
    if (deletingCaseId == null) return;
    try {
      await deleteCase(deletingCaseId);
      setDeletingCaseId(null);
      setIsModalOpen(false);
      fetchCases();
    } catch (err) {
      console.error("Failed to delete case:", err);
    }
  };

  const closeModal = () => {
    setDeletingCaseId(null);
    setIsModalOpen(false);
  };

  if (editingCaseId) {
    return (
      <UpdateCase caseId={editingCaseId} onCaseUpdated={handleCaseUpdated} />
    );
  }

  return (
    <div className="w-full mt-3">
      {loading ? (
        view === "cards" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 4xl:grid-cols-4 gap-5">
            {[...Array(itemsPerPage)].map((_, index) => (
              <div
                key={index}
                className="card card-compact shadow-lg rounded-md"
              >
                <figure className="relative w-full aspect-4/3 h-56 overflow-hidden rounded-t-md">
                  <div className="skeleton w-full h-full"></div>
                </figure>
                <div className="card-body">
                  <div className="skeleton h-7 w-3/4"></div>
                  <div className="skeleton h-3 w-full mt-1"></div>
                  <div className="card-actions justify-end mt-2">
                    <div className="skeleton h-8 w-20"></div>
                    <div className="skeleton h-8 w-12"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {[...Array(itemsPerPage)].map((_, index) => (
              <React.Fragment key={index}>
                <li>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                      <div className="skeleton w-12 h-10 rounded-md"></div>
                      <div className="skeleton h-4 w-32"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="skeleton h-8 w-20"></div>
                      <div className="skeleton h-8 w-16"></div>
                    </div>
                  </div>
                </li>
                <hr className="border-px rounded-lg border-base-200" />
              </React.Fragment>
            ))}
          </ul>
        )
      ) : caseItems.length === 0 ? (
        <div className="flex justify-center items-center h-40 w-full">
          <p className="text-gray-500">{t("no_cases")}</p>
        </div>
      ) : (
        <>
          {view === "cards" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 4xl:grid-cols-4 gap-5">
              {caseItems.map((item, itemIndex) => (
                <div
                  key={item.id}
                  className="card card-compact shadow-lg rounded-md"
                >
                  <figure className="relative w-full aspect-4/3 h-56 overflow-hidden">
                    <Image
                      src={item.image || FALLBACK_IMAGE}
                      alt={`Case study for ${item.company}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={itemIndex < 8}
                      loading="eager"
                      className="object-cover"
                    />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title text-lg">{item.company}</h2>
                    <p className="text-xs">{truncate(item.desc, 100)}</p>
                    <div className="card-actions justify-end mt-2">
                      <button
                        className="btn btn-sm"
                        onClick={() => onEditCase(item.id)}
                      >
                        <FaPen /> {t("edit")}
                      </button>
                      <button
                        className="btn btn-sm"
                        onClick={() => {
                          setDeletingCaseId(item.id);
                          setIsModalOpen(true);
                        }}
                      >
                        <FaTrash /> {t("delete")}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {caseItems.map((item, itemIndex) => (
                <React.Fragment key={item.id}>
                  <li>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2 items-center">
                        <div className="relative w-12 h-10 rounded-md overflow-hidden">
                          <Image
                            src={item.image || FALLBACK_IMAGE}
                            alt={`Case study for ${item.company}`}
                            fill
                            style={{ objectFit: "cover" }}
                            priority={itemIndex < 8}
                            loading="eager"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-xs hidden sm:block">
                            {item.company}
                          </h3>
                          <h3 className="font-semibold text-xs block sm:hidden">
                            {truncate(item.company, 20)}
                          </h3>
                        </div>
                      </div>
                      <div className="flex gap-5 md:gap-2">
                        <button
                          className="btn btn-sm"
                          onClick={() => onEditCase(item.id)}
                        >
                          <FaPen />{" "}
                          <span className="md:flex hidden">{t("edit")}</span>
                        </button>
                        <button
                          className="btn btn-sm"
                          onClick={() => {
                            setDeletingCaseId(item.id);
                            setIsModalOpen(true);
                          }}
                        >
                          <FaTrash />{" "}
                          <span className="md:flex hidden">{t("delete")}</span>
                        </button>
                      </div>
                    </div>
                  </li>
                  <hr className="border-px rounded-lg border-base-200" />
                </React.Fragment>
              ))}
            </ul>
          )}
        </>
      )}

      {isModalOpen && deletingCaseId != null && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              {t("delete_case_confirmation")}
            </h3>
            <p className="py-4">{t("delete_case_prompt")}</p>
            <p className="text-sm text-warning">{t("delete_case_warning")}</p>
            <div className="modal-action">
              <button className="btn" onClick={closeModal}>
                {t("cancel")}
              </button>
              <button className="btn btn-error" onClick={handleDelete}>
                {t("delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CasesList;
