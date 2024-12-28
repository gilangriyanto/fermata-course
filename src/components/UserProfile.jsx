import React from "react";
import { MdOutlineCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useStateContext } from "../contexts/ContextProvider";
import defaultAvatar from "../data/avatar.jpg";
import api from "../api/axios";
import { BiChevronRight } from "react-icons/bi";

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { setIsClicked, initialState } = useStateContext();

  const handleLogout = async () => {
    try {
      await api.post("/api/users/logout");
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      logout();
      navigate("/login");
    } finally {
      setIsClicked(initialState);
    }
  };

  const handleClose = () => {
    setIsClicked(initialState);
  };

  const handleProfileClick = () => {
    setIsClicked(initialState);
    navigate("/profile");
  };

  const userAvatar = user?.cover_image || defaultAvatar;

  const renderRoleSpecificInfo = () => {
    switch (user?.role) {
      case "teacher":
        return (
          <div className="mt-2 text-sm text-gray-600">
            <p>Phone: {user?.phone || "Not set"}</p>
            <p className="mt-1">
              Instruments:{" "}
              {user?.teacher_data?.instruments?.join(", ") || "None"}
            </p>
          </div>
        );
      case "student":
        return (
          <div className="mt-2 text-sm text-gray-600">
            <p>Phone: {user?.phone || "Not set"}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="nav-item absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96 shadow-lg">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg">User Profile</p>
        <button
          onClick={handleClose}
          className="text-2xl p-3 hover:drop-shadow-xl hover:bg-light-gray rounded-full"
        >
          <MdOutlineCancel />
        </button>
      </div>
      <div
        onClick={handleProfileClick}
        className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-2 group"
      >
        <div className="relative">
          <img
            className="rounded-full h-24 w-24 group-hover:opacity-90 transition-opacity"
            src={userAvatar}
            alt="user-profile"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-sm text-gray-600 bg-white bg-opacity-90 px-2 py-1 rounded">
              Edit Profile
            </span>
          </div>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-xl">{user?.name || "User"}</p>
          <p className="text-gray-500 text-sm capitalize">
            {user?.role || "Role"}
          </p>
          <p className="text-gray-500 text-sm font-semibold">{user?.email}</p>
          {renderRoleSpecificInfo()}
        </div>
        <BiChevronRight className="text-gray-400 text-xl group-hover:text-gray-600 transition-colors" />
      </div>
      <div className="mt-5">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
