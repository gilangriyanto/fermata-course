import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Inject,
  Search,
  Toolbar,
  Edit,
  Page,
  Sort,
} from "@syncfusion/ej2-react-grids";
import { Header } from "../components";

// Edit Modal Component
const EditModal = ({ isOpen, onClose, onSubmit, formError, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Edit Admin</h2>
        {formError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {formError}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Register Modal Component
const RegisterModal = ({ isOpen, onClose, onSubmit, formError }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Register New Admin</h2>
        {formError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {formError}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DataAdmin = () => {
  const [adminData, setAdminData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [formError, setFormError] = useState("");

  const toolbarOptions = ["Search"];

  const editing = {
    allowDeleting: true,
    allowEditing: true,
    allowAdding: false,
  };

  // Fetch admin data
  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/users`);
      const adminUsers = response.data.filter(
        (user) => user.user_type.role === "admin"
      );
      setAdminData(adminUsers);
      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch admin data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Handle register admin
  const handleRegisterAdmin = async (formData) => {
    setFormError("");

    try {
      const response = await axios.post(`/api/users/register`, formData);

      if (response.data && response.data._id) {
        // Add new admin to the list with the correct structure
        const newAdmin = {
          ...response.data,
          user_type: {
            role: response.data.role,
            teacher_data: response.data.teacher_data,
          },
        };
        setAdminData([...adminData, newAdmin]);

        // Close modal and show success message
        setShowRegisterModal(false);
        alert("Admin registered successfully!");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setFormError(
        error.response?.data?.message ||
          "Failed to register admin. Please try again."
      );
    }
  };

  // Handle edit admin
  const handleEdit = async (id) => {
    try {
      // Get admin data from current state
      const adminToEdit = adminData.find((admin) => admin._id === id);
      if (adminToEdit) {
        setSelectedAdmin(adminToEdit);
        setShowEditModal(true);
        setFormError("");
      } else {
        throw new Error("Admin not found");
      }
    } catch (error) {
      console.error("Error preparing edit:", error);
      alert("Failed to prepare edit form. Please try again.");
    }
  };

  // Handle edit submit
  const handleEditSubmit = async (formData) => {
    try {
      // Check if selectedAdmin exists and has an _id
      if (!selectedAdmin || !selectedAdmin._id) {
        throw new Error("No admin selected for editing");
      }

      const response = await axios.put(
        `/api/users/profile/${selectedAdmin._id}`,
        {
          name: formData.name,
          email: formData.email,
        }
      );

      // Update the admin data in state with the correct structure
      setAdminData(
        adminData.map((admin) =>
          admin._id === selectedAdmin._id
            ? {
                ...admin,
                ...response.data,
                user_type: {
                  role: response.data.role || admin.user_type.role,
                  teacher_data:
                    response.data.teacher_data || admin.user_type.teacher_data,
                },
              }
            : admin
        )
      );

      setShowEditModal(false);
      setSelectedAdmin(null);
      alert("Admin updated successfully!");
    } catch (error) {
      console.error("Error updating admin:", error);
      setFormError(
        error.message === "No admin selected for editing"
          ? "Invalid admin selection. Please try again."
          : error.response?.data?.message ||
              "Failed to update admin. Please try again."
      );
    }
  };

  // Handle delete admin
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        const response = await axios.delete(`/api/users/${id}`);
        if (response.data.message === "User deleted successfully") {
          setAdminData(adminData.filter((admin) => admin._id !== id));
          alert("Admin deleted successfully!");
        }
      } catch (error) {
        console.error("Error deleting admin:", error);
        alert(
          error.response?.data?.message ||
            "Failed to delete admin. Please try again."
        );
      }
    }
  };

  // Filter data based on search text
  const filteredData = adminData.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchText.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchText.toLowerCase())
  );

  // Column definitions
  const adminColumns = [
    {
      field: "_id",
      headerText: "ID",
      width: "120",
      textAlign: "Center",
    },
    {
      field: "name",
      headerText: "Name",
      width: "150",
      textAlign: "Center",
    },
    {
      field: "email",
      headerText: "Email",
      width: "200",
      textAlign: "Center",
    },
    {
      field: "createdAt",
      headerText: "Created Date",
      width: "150",
      textAlign: "Center",
      format: "yMd",
    },
    {
      field: "_id",
      headerText: "Actions",
      textAlign: "Center",
      width: "150",
      template: (rowData) => (
        <div className="flex justify-center gap-2">
          <button
            className="text-white bg-blue-500 px-2 py-1 rounded hover:bg-blue-600"
            onClick={() => handleEdit(rowData._id)}
          >
            Edit
          </button>
          <button
            className="text-white bg-red-500 px-2 py-1 rounded hover:bg-red-600"
            onClick={() => handleDelete(rowData._id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Admin Data" />
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          className="border p-2 rounded-lg w-1/3"
          placeholder="Search admins..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            onClick={() => alert("Generate Report")}
          >
            Report
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            onClick={() => setShowRegisterModal(true)}
          >
            Add Admin
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <GridComponent
          dataSource={filteredData}
          allowPaging
          pageSettings={{ pageSize: 5 }}
          toolbar={toolbarOptions}
          allowSorting
          editSettings={editing}
        >
          <ColumnsDirective>
            {adminColumns.map((col, index) => (
              <ColumnDirective key={index} {...col} />
            ))}
          </ColumnsDirective>
          <Inject services={[Search, Toolbar, Edit, Page, Sort]} />
        </GridComponent>
      )}

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSubmit={handleRegisterAdmin}
        formError={formError}
      />

      <EditModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedAdmin(null);
          setFormError("");
        }}
        onSubmit={handleEditSubmit}
        formError={formError}
        initialData={selectedAdmin}
      />
    </div>
  );
};

export default DataAdmin;
