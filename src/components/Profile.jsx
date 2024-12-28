import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/axios";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  // currentuser

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

  

  // State management yang lebih baik
  const [imagePreview, setImagePreview] = useState(null); // Tambahkan state untuk preview

  useEffect(() => {
    fetchUserProfile();
  }, []);

  

  // Reset form function
  const resetForm = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setFormData({
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
  };

  const fetchUserProfile = async () => {
    try {
      setFetchLoading(true);
      const response = await api.get("/api/users/profile");
      
      if (response.data) {
        const userData = response.data;
        
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          address: userData.address || "",
          password: "", // Password selalu kosong untuk keamanan
          cover_image: userData.cover_image || "",
          user_type: {
            role: userData.user_type?.role || "",
            teacher_data: {
              instruments: userData.user_type?.teacher_data?.instruments || [],
            },
          },
        });
  
        // Set image preview if cover_image exists
        if (userData.cover_image) {
          setImagePreview(userData.cover_image);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error(
        error.response?.data?.message || 
        "Failed to fetch profile. Please try again later."
      );
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
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        toast.error("Please select a valid image file (JPG, PNG)");
        e.target.value = null; // Reset input
        return;
      }
  
      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast.error("File size must be less than 5MB");
        e.target.value = null; // Reset input
        return;
      }
  
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
  
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const formDataToSend = new FormData();
  
      // Append basic fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      
      // Only append non-empty fields
      if (formData.phone) formDataToSend.append('phone', formData.phone);
      if (formData.address) formDataToSend.append('address', formData.address);
      if (formData.password) formDataToSend.append('password', formData.password);
  
      // Append file if selected
      if (selectedFile) {
        formDataToSend.append('cover_image', selectedFile);
      }
  
      // Append teacher data if user is teacher
      if (formData.user_type.role === 'teacher') {
        formDataToSend.append(
          'teacher_data',
          JSON.stringify({
            instruments: formData.user_type.teacher_data.instruments
          })
        );
      }
  
      const response = await api.put("/api/users/profile", formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentage = (progressEvent.loaded * 100) / progressEvent.total;
          // You can use this percentage to show upload progress if needed
          console.log(`Upload Progress: ${percentage}%`);
        },
      });
  
      if (response.data) {
        // Buat object user yang baru dengan data terbaru
        const updatedUserData = {
          ...user, // spread existing user data
          name: response.data.name,
          email: response.data.email,
          cover_image: response.data.cover_image,
          phone: response.data.phone,
          address: response.data.address,
          user_type: response.data.user_type,
        };

        // Update context dan localStorage menggunakan updateUser
        updateUser(updatedUserData);

        // Update form data state
        setFormData(prev => ({
          ...prev,
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone || "",
          address: response.data.address || "",
          cover_image: response.data.cover_image || "",
          password: "", // Reset password field
          user_type: {
            role: response.data.user_type?.role || "",
            teacher_data: {
              instruments: response.data.user_type?.teacher_data?.instruments || [],
            },
          },
        }));
        // localStorage.setItem('user', JSON.stringify(updatedUser));
  
        // Update preview if new image
        // if (updatedData.cover_image) {
        //   setImagePreview(updatedData.cover_image);
        // }
  
        // Reset file selection
        setSelectedFile(null);
  
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(
        error.response?.data?.message || 
        "Failed to update profile. Please try again."
      );
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

  // Custom toast configuration
const showToast = (type, message) => {
  toast[type](message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

// Add success feedback with more details
const handleSuccess = (response) => {
  const updatedFields = [];
  
  if (response.data.cover_image !== formData.cover_image) {
    updatedFields.push('profile picture');
  }
  if (response.data.name !== formData.name) {
    updatedFields.push('name');
  }
  if (response.data.email !== formData.email) {
    updatedFields.push('email');
  }
  if (formData.password) {
    updatedFields.push('password');
  }
  
  let successMessage = 'Profile updated successfully';
  if (updatedFields.length > 0) {
    successMessage += `: Updated ${updatedFields.join(', ')}`;
  }
  
  showToast('success', successMessage);
};

// Add error handling with specific messages
const handleError = (error) => {
  if (error.response?.status === 413) {
    showToast('error', 'File size is too large. Please choose a smaller image.');
  } else if (error.response?.status === 422) {
    showToast('error', 'Please check your input and try again.');
  } else if (error.response?.status === 401) {
    showToast('error', 'Session expired. Please login again.');
    // Redirect to login or handle session expiry
  } else {
    showToast('error', error.response?.data?.message || 'Failed to update profile');
  }
};

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <h1 className="text-2xl font-semibold mb-6">Edit Profile</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl">
        {/* Profile Picture Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Profile Picture</label>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24">
              <img
                src={imagePreview || formData.cover_image || "/default-avatar.jpg"}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              {(imagePreview || formData.cover_image) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setImagePreview(null);
                    setFormData(prev => ({...prev, cover_image: ""}));
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  ×
                </button>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleFileChange}
                className="border p-2 rounded text-sm"
              />
              {selectedFile && (
                <span className="text-sm text-gray-600">
                  Selected: {selectedFile.name}
                </span>
              )}
            </div>
          </div>
        </div>
  
        {/* Basic Info Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
  
          {formData.user_type.role !== "admin" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., +62812345678"
                />
              </div>
  
              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Your full address"
                />
              </div>
            </>
          )}
  
          {/* Teacher Instruments Section */}
          {formData.user_type.role === "teacher" && (
            <div>
              <label className="block text-sm font-medium mb-2">Instruments</label>
              <div className="grid grid-cols-2 gap-2">
                {["Piano", "Vokal", "Drum", "Gitar", "Biola", "Bass"].map((instrument) => (
                  <label
                    key={instrument}
                    className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.user_type.teacher_data.instruments.includes(instrument)}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setFormData(prev => ({
                          ...prev,
                          user_type: {
                            ...prev.user_type,
                            teacher_data: {
                              instruments: isChecked
                                ? [...prev.user_type.teacher_data.instruments, instrument]
                                : prev.user_type.teacher_data.instruments.filter(i => i !== instrument)
                            }
                          }
                        }));
                      }}
                      className="rounded border-gray-300"
                    />
                    <span>{instrument}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
  
          {/* Password Section */}
          <div>
            <label className="block text-sm font-medium mb-2">
              New Password (leave blank to keep current)
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new password"
            />
          </div>
  
          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 
                       disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors
                       flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  <span>Saving...</span>
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
