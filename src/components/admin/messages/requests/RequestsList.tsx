import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaAngleRight } from "react-icons/fa6";
import { getAllRequests } from "@/lib/server/actions";

export interface Request {
  id: number;
  name: string;
  company: string;
  category: string;
  created_at: string;
  mobile: string;
  mail: string;
  message: string;
  address: string;
  city: string;
  consent: boolean;
}

interface RequestsListProps {
  requests: Request[];
  setRequests: (requests: Request[]) => void;
  page: number;
  setPage: (page: number) => void;
  total: number;
  setTotal: (total: number) => void;
  searchTerm: string;
  onDetailsClick: (requestId: number) => void;
  selectedRequests: number[];
  setSelectedRequests: (selected: number[]) => void;
  handleCheckboxChange: (requestId: number) => void;
}

const RequestsList = ({
  requests,
  setRequests,
  page,
  setTotal,
  searchTerm,
  onDetailsClick,
  selectedRequests,
  setSelectedRequests,
  handleCheckboxChange,
}: RequestsListProps) => {
  const [loading, setLoading] = useState(true);
  const [localRequests, setLocalRequests] = useState<Request[]>(requests);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const { requests, total } = await getAllRequests(page, 6); // Fetch 6 requests per page
        setRequests(requests); // Update the requests state
        setTotal(total); // Update the total count for pagination
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [page, setRequests, setTotal]); // Refetch when the page changes

  useEffect(() => {
    setLocalRequests(
      requests.filter((request) => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
          request.name?.toLowerCase().includes(searchTermLower) ||
          request.category?.toLowerCase().includes(searchTermLower) ||
          request.mobile?.toString().includes(searchTerm) ||
          request.address?.toLowerCase().includes(searchTermLower) ||
          request.city?.toLowerCase().includes(searchTermLower) ||
          request.mail?.toLowerCase().includes(searchTermLower)
        );
      })
    );
  }, [requests, searchTerm]);

  if (loading) {
    return (
      <div className="flex justify-center gap-3 items-center h-52">
        <span className="loading loading-spinner loading-md"></span>
        {t("loading_request")}
      </div>
    );
  }

  if (!localRequests.length) {
    return (
      <div className="h-52 flex items-center justify-center">
        {t("no_requests")}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table md:table-md lg:table-lg">
        <thead>
          <tr>
            <th>
              <label>
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  onChange={(e) =>
                    setSelectedRequests(
                      e.target.checked ? localRequests.map((req) => req.id) : []
                    )
                  }
                  checked={selectedRequests.length === localRequests.length}
                  aria-label={t("aria.requestsList.selectAllCheckbox")}
                />
              </label>
            </th>
            <th>{t("sent_by")}</th>
            <th className="hidden md:block">{t("subject")}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {localRequests.map((request) => (
            <tr key={request.id}>
              <th>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary "
                    checked={selectedRequests.includes(request.id)}
                    onChange={() => handleCheckboxChange(request.id)}
                    aria-label={t("aria.requestsList.individualCheckbox")}
                  />
                </label>
              </th>
              <td
                onClick={() => onDetailsClick(request.id)}
                className="cursor-pointer w-full md:w-auto"
              >
                <div className="flex items-center gap-1 text-xs md:text-sm font-bold ">
                  <div>{request.company || request.name}</div>
                </div>
              </td>
              <td
                className="hidden md:block cursor-pointer "
                onClick={() => onDetailsClick(request.id)}
              >
                <span className="pl-2 font-bold text-xs md:text-sm">
                  {request.category}
                </span>
                <br />
                <span className="badge badge-sm lg:text-[11px] text-[10px]  ">
                  {request.created_at
                    ? new Date(request.created_at).toLocaleDateString("da-DK")
                    : "Ugyldig dato"}
                </span>
              </td>
              <th className="">
                <button
                  className="btn btn-outline btn-primary btn-sm flex items-center"
                  onClick={() => onDetailsClick(request.id)}
                  aria-label={t("aria.requestsList.detailsButton")}
                >
                  <span className="hidden lg:block">{t("details")}</span>
                  <FaAngleRight />
                </button>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestsList;
