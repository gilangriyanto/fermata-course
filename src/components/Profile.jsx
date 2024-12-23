import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "../api/axios";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    avatar: null,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    instruments: user?.teacher_data?.instruments || [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      avatar: file,
    }));
  };

  const handleInstrumentChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      instruments: prev.instruments.includes(value)
        ? prev.instruments.filter((i) => i !== value)
        : [...prev.instruments, value],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Add basic user data
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);

      if (formData.phone) formDataToSend.append("phone", formData.phone);
      if (formData.address) formDataToSend.append("address", formData.address);

      // Add password fields if provided
      if (formData.currentPassword)
        formDataToSend.append("currentPassword", formData.currentPassword);
      if (formData.newPassword)
        formDataToSend.append("newPassword", formData.newPassword);
      if (formData.confirmPassword)
        formDataToSend.append("confirmPassword", formData.confirmPassword);

      // Add instruments for teacher
      if (user?.role === "teacher" && formData.instruments.length > 0) {
        formDataToSend.append(
          "teacher_data[instruments]",
          JSON.stringify(formData.instruments)
        );
      }

      // Add avatar if changed
      if (formData.avatar) {
        formDataToSend.append("avatar", formData.avatar);
      }

      const response = await axios.put("/api/users/profile", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        updateUser(response.data.data);
        toast.success("Profile updated successfully");
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const instrumentOptions = [
    "Gitar",
    "Piano",
    "Vokal",
    "Drum",
    "Bass",
    "Biola",
  ];

  const renderRoleSpecificFields = () => {
    switch (user?.role) {
      case "teacher":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
                rows="3"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Instruments
              </label>
              <div className="grid grid-cols-2 gap-2">
                {instrumentOptions.map((instrument) => (
                  <label
                    key={instrument}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      value={instrument}
                      checked={formData.instruments.includes(instrument)}
                      onChange={handleInstrumentChange}
                      className="form-checkbox"
                    />
                    <span>{instrument}</span>
                  </label>
                ))}
              </div>
            </div>
          </>
        );
      case "student":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
                rows="3"
              />
            </div>
          </>
        );
      case "admin":
      default:
        return null;
    }
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <h1 className="text-2xl font-semibold mb-6">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Profile Picture
          </label>
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || "/default-avatar.jpg"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border p-2 rounded"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {renderRoleSpecificFields()}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Current Password
          </label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
