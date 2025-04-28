"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { FaPen, FaTrash } from "react-icons/fa6";
import { getAllCases, deleteCase } from "@/lib/server/actions";
import UpdateCase from "./updateCase/UpdateCase";
import { useTranslation } from "react-i18next";

interface CasesListProps {
  view: "cards" | "list";
  page: number;
  setTotal: (total: number) => void;
  onEditCase: (caseId: number) => void;
}

interface CaseItem {
  id: number;
  companyName: string;
  desc: string | null;                // Danish
  desc_translated: string | null;     // English
  formType: "normal" | "beforeAfter";
  image: string | null;
  imageBefore: string | null;
  imageAfter: string | null;
}

const FALLBACK_IMAGE = "/demo.jpg";

const CasesList = ({ view, page, setTotal, onEditCase }: CasesListProps) => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [caseItems, setCaseItems] = useState<CaseItem[]>([]);
  const [editingCaseId, setEditingCaseId] = useState<number | null>(null);
  const [deletingCaseId, setDeletingCaseId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCases = useCallback(async () => {
    setLoading(true);
    try {
      const { cases, total } = await getAllCases(page);
      setCaseItems(cases || []);
      setTotal(total || 0);
    } catch (err) {
      console.error("Failed to fetch cases:", err);
      setCaseItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, setTotal]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const truncateDescription = (
    danish: string | null,
    english: string | null,
    maxLength: number
  ) => {
    const full =
      i18n.language === "en" ? english ?? danish : danish ?? english;
    if (!full) return "";
    return full.length > maxLength ? full.slice(0, maxLength) + "…" : full;
  };

  const truncateTitle = (title: string, maxLength: number) =>
    title.length > maxLength ? title.slice(0, maxLength) + "…" : title;

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

  if (loading) {
    return (
      <div className="flex justify-center gap-3 items-center">
        <span className="loading loading-spinner loading-md h-40" />
        {t("loading_cases")}
      </div>
    );
  }

  if (caseItems.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-lg text-gray-500">{t("no_cases")}</p>
      </div>
    );
  }

  if (editingCaseId) {
    return (
      <UpdateCase
        caseId={editingCaseId}
        onCaseUpdated={handleCaseUpdated}
      />
    );
  }

  return (
    <div className="w-full">
      {view === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {caseItems.map((item) => (
            <div
              key={item.id}
              className="card card-compact shadow-md bg-base-300 rounded-md"
            >
              <figure className="relative w-full aspect-[4/3] h-56 md:h-40 xl:h-56 overflow-hidden">
                <Image
                  src={item.image || FALLBACK_IMAGE}
                  alt={item.companyName}
                  fill
                  className="object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title text-lg">{item.companyName}</h2>
                <p className="text-xs">
                  {truncateDescription(
                    item.desc,
                    item.desc_translated,
                    100
                  )}
                </p>
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
          {caseItems.map((item) => (
            <li key={item.id}>
              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <div className="relative w-12 h-10 rounded-md overflow-hidden">
                    <Image
                      src={item.image || FALLBACK_IMAGE}
                      alt={item.companyName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-xs hidden sm:block">
                    {item.companyName}
                  </h3>
                  <h3 className="font-semibold text-xs block sm:hidden">
                    {truncateTitle(item.companyName, 20)}
                  </h3>
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
              <p className="text-xs mt-1">
                {truncateDescription(
                  item.desc,
                  item.desc_translated,
                  80
                )}
              </p>
            </li>
          ))}
        </ul>
      )}

      {isModalOpen && deletingCaseId != null && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              {t("delete_case_confirmation")}
            </h3>
            <p className="py-4">{t("delete_case_prompt")}</p>
            <p className="text-sm text-warning">
              {t("delete_case_warning")}
            </p>
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
