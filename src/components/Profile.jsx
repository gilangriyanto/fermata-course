import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/axios";
import { toast } from "react-toastify";

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    cover_image: "",
    user_type: {
      role: "",
      teacher_data: {
        instruments: [],
      },
    },
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get("/api/users/profile");
      const userData = response.data;

      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address: userData.address || "",
        password: "",
        cover_image: userData.cover_image || "",
        user_type: {
          role: userData.user_type?.role || "",
          teacher_data: {
            instruments: userData.user_type?.teacher_data?.instruments || [],
          },
        },
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error(error.response?.data?.message || "Failed to fetch profile");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        toast.error("Please select a valid image file (JPG, PNG)");
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Instead of FormData, let's send JSON directly since we're not just handling files
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        password: formData.password || undefined,
      };

      // Add teacher_data if user is a teacher
      if (formData.user_type.role === "teacher") {
        dataToSend.teacher_data = {
          instruments: formData.user_type.teacher_data.instruments,
        };
      }

      // If we have a file, then use FormData
      if (selectedFile) {
        const formDataToSend = new FormData();

        // Append the file
        formDataToSend.append("cover_image", selectedFile);

        // Append the JSON data
        Object.keys(dataToSend).forEach((key) => {
          if (typeof dataToSend[key] === "object") {
            formDataToSend.append(key, JSON.stringify(dataToSend[key]));
          } else if (dataToSend[key] !== undefined) {
            formDataToSend.append(key, dataToSend[key]);
          }
        });

        const response = await api.put("/api/users/profile", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        handleResponse(response);
      } else {
        // If no file, send JSON directly
        const response = await api.put("/api/users/profile", dataToSend, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        handleResponse(response);
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to handle the response
  const handleResponse = (response) => {
    if (response.data) {
      const updatedData = {
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone || "",
        address: response.data.address || "",
        avatar: response.data.cover_image || "",
        role: response.data.user_type?.role,
        teacher_data: {
          instruments: response.data.user_type?.teacher_data?.instruments || [],
        },
      };

      setFormData((prev) => ({
        ...prev,
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone || "",
        address: response.data.address || "",
        cover_image: response.data.cover_image || "",
        password: "",
        user_type: {
          role: response.data.role,
          teacher_data: {
            instruments: response.data.teacher_data?.instruments || [],
          },
        },
      }));

      setSelectedFile(null);
      toast.success("Profile updated successfully");
    }
  };

  if (fetchLoading) {
    return (
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading profile...</div>
        </div>
      </div>
    );
  }

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
              src={formData.cover_image || "/default-avatar.jpg"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleFileChange}
              className="border p-2 rounded"
            />
            {selectedFile && (
              <span className="text-sm text-gray-600">
                Selected: {selectedFile.name}
              </span>
            )}
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
            required
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
            required
          />
        </div>

        {formData.user_type.role !== "admin" && (
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
                rows={3}
              />
            </div>
          </>
        )}

        {formData.user_type.role === "teacher" && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Instruments
            </label>
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                {["Piano", "Vokal", "Drum", "Gitar", "Biola", "Bass"].map(
                  (instrument) => (
                    <label
                      key={instrument}
                      className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={formData.user_type.teacher_data.instruments.includes(
                          instrument
                        )}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            user_type: {
                              ...prev.user_type,
                              teacher_data: {
                                instruments: e.target.checked
                                  ? [
                                      ...prev.user_type.teacher_data
                                        .instruments,
                                      instrument,
                                    ]
                                  : prev.user_type.teacher_data.instruments.filter(
                                      (i) => i !== instrument
                                    ),
                              },
                            },
                          }));
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>{instrument}</span>
                    </label>
                  )
                )}
              </div>
              {formData.user_type.teacher_data.instruments.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.user_type.teacher_data.instruments.map(
                    (instrument) => (
                      <span
                        key={instrument}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                      >
                        {instrument}
                      </span>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            New Password (leave blank to keep current)
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
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
