import React, { useEffect, useState } from "react";
import { FaPen, FaTrash } from "react-icons/fa6";
import { getAllUsers, deleteUser } from "@/lib/server/actions";
import { useTranslation } from "react-i18next";

interface User {
  id: string;
  email?: string;
  name?: string;
  role?: string;
}

const UserList = ({
  onUpdateUserClick,
  onUserDeleted,
}: {
  onUpdateUserClick: (userId: string) => void;
  onUserDeleted: () => void;
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers();
        setUsers(users || []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [isModalOpen]);

  const handleDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete.id);
        setUsers(users.filter((user) => user.id !== userToDelete.id));
        setUserToDelete(null);
        setIsModalOpen(false);
        onUserDeleted(); // Trigger toast for deletion
      } catch (error) {
        console.error("Failed to delete user:", error);
        setError("Failed to delete user");
      }
    }
  };

  const openModal = (user: User) => {
    setUserToDelete(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setUserToDelete(null);
    setIsModalOpen(false);
  };

  const handleUpdateClick = (userId: string) => {
    onUpdateUserClick(userId);
  };

  return (
    <div>
      {loading ? (
        <div className="flex justify-center gap-3 items-center">
          <span className="loading loading-spinner loading-md h-52"></span>
          {t("loading_users")}
        </div>
      ) : (
        <>
          {error && <p className="text-red-500">{error}</p>}{" "}
          {/* Display error message */}
          <ul className="flex flex-col gap-4 md:gap-5">
            {users.map((user) => (
              <React.Fragment key={user.id}>
                <li
                  key={user.id}
                  className=" flex justify-between items-center rounded-lg"
                >
                  <div className="flex gap-3 items-center ">
                    <div className="w-20 md:w-32">
                      <span className=" badge md:badge-lg badge-primary badge-outline capitalize">
                        {user.role === "editor" ? "Redaktør" : user.role}
                      </span>
                    </div>
                    <div className="w-20 md:w-32">
                      <span className="font-semibold md:font-bold text-xs md:text-base">
                        {user.name}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold md:font-bold text-xs md:text-base hidden md:block">
                        {user.email}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-5 items-center">
                    <button
                      className="btn btn-sm"
                      onClick={() => handleUpdateClick(user.id)}
                    >
                      <FaPen size={17} />
                    </button>
                    <button
                      className="btn btn-sm"
                      onClick={() => openModal(user)}
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </li>
                <hr className="border-[1px] rounded-lg border-base-200" />
              </React.Fragment>
            ))}
          </ul>
        </>
      )}

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              {t("delete_user_confirmation")}
            </h3>
            <p className="py-4">{t("delete_user_prompt")}</p>
            <p className="text-sm text-warning">{t("delete_user_warning")}</p>
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

export default UserList;
