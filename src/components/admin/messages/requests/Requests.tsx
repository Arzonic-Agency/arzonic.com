import React, { useState } from "react";
import RequestsSearch from "./RequestsSearch";
import RequestsList, { Request } from "./RequestsList";
import RequestsDetails from "./RequestsDetails";
import { FaAngleLeft } from "react-icons/fa6";
import { deleteRequest, updateRequest } from "@/lib/server/actions";
import RequestsPagination from "./RequestsPagination";

import { useTranslation } from "react-i18next";

const Requests = () => {
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(
    null
  );
  const [requests, setRequests] = useState<Request[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequests, setSelectedRequests] = useState<number[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { t } = useTranslation();

  const handleDetailsClick = (requestId: number) => {
    setSelectedRequestId(requestId);
  };

  const handleBackClick = () => {
    setSelectedRequestId(null);
    setIsEditing(false);
  };

  const handleDeleteSelected = async () => {
    try {
      setRequests((prevRequests) =>
        prevRequests.filter((request) => !selectedRequests.includes(request.id))
      );
      setSelectedRequests([]);
      await Promise.all(
        selectedRequests.map((id) => deleteRequest(id.toString()))
      );
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Failed to delete selected requests:", error);
    }
  };

  const handleCheckboxChange = (requestId: number) => {
    setSelectedRequests((prevSelected) =>
      prevSelected.includes(requestId)
        ? prevSelected.filter((id) => id !== requestId)
        : [...prevSelected, requestId]
    );
  };

  const handleDeleteRequest = (deletedRequestId: number) => {
    setRequests((prevRequests) =>
      prevRequests.filter((request) => request.id !== deletedRequestId)
    );
    setSelectedRequestId(null); // Redirect to list view
    setShowToast(true); // Trigger toast
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleUpdateRequest = async (
    requestId: string,
    data: Partial<Request>
  ) => {
    try {
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === parseInt(requestId) ? { ...request, ...data } : request
        )
      );
      await updateRequest(requestId, data);
    } catch (error) {
      console.error("Failed to update request:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {selectedRequestId ? (
        <div className="flex flex-col items-start gap-5">
          {!isEditing && (
            <div className="flex items-start gap-5">
              <button
                onClick={handleBackClick}
                className="btn btn-ghost"
                aria-label={t("aria.requests.backButton")}
              >
                <FaAngleLeft />
                {t("back")}
              </button>
            </div>
          )}
          <RequestsDetails
            name={requests.find((r) => r.id === selectedRequestId)?.name || ""}
            company={
              requests.find((r) => r.id === selectedRequestId)?.company || ""
            }
            category={
              requests.find((r) => r.id === selectedRequestId)?.category || ""
            }
            created_at={
              requests.find((r) => r.id === selectedRequestId)?.created_at || ""
            }
            mobile={
              requests.find((r) => r.id === selectedRequestId)?.mobile || ""
            }
            mail={requests.find((r) => r.id === selectedRequestId)?.mail || ""}
            city={requests.find((r) => r.id === selectedRequestId)?.city || ""}
            address={
              requests.find((r) => r.id === selectedRequestId)?.address || ""
            }
            message={
              requests.find((r) => r.id === selectedRequestId)?.message || ""
            }
            consent={
              !!requests.find((r) => r.id === selectedRequestId)?.consent
            }
            requestId={selectedRequestId.toString()}
            setIsEditing={setIsEditing}
            onUpdateRequest={handleUpdateRequest}
            onDeleteRequest={(deletedRequestId) => {
              handleDeleteRequest(deletedRequestId);
            }}
          />
        </div>
      ) : (
        <>
          <RequestsSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedRequests={selectedRequests}
            onDeleteSelected={handleDeleteSelected}
            aria-label={t("aria.requests.searchInput")}
          />
          <RequestsList
            requests={requests}
            setRequests={setRequests}
            page={page}
            setPage={setPage}
            total={total}
            setTotal={setTotal}
            searchTerm={searchTerm}
            onDetailsClick={handleDetailsClick}
            selectedRequests={selectedRequests}
            setSelectedRequests={setSelectedRequests}
            handleCheckboxChange={handleCheckboxChange}
          />
          <RequestsPagination page={page} setPage={setPage} total={total} />
        </>
      )}
      {showToast && (
        <div className="toast bottom-20 md:bottom-0 toast-end">
          <div className="alert alert-success text-neutral-content">
            <span className="text-base md:text-lg">{t("deleted_request")}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;
