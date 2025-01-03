import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Resize,
  Sort,
  ContextMenu,
  Filter,
  Page,
  ExcelExport,
  PdfExport,
  Edit,
  Inject,
} from "@syncfusion/ej2-react-grids";
import { Header } from "../components";

const RegistrationModal = ({
  showModal,
  setShowModal,
  handleAdd,
  newStudent,
  handleInputChange,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg w-96">
      <h2 className="text-xl font-bold mb-4">Register New Student</h2>
      <form onSubmit={handleAdd}>
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            value={newStudent.name}
            onChange={handleInputChange}
            placeholder="Full Name"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="email"
            name="email"
            value={newStudent.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            name="password"
            value={newStudent.password}
            onChange={handleInputChange}
            placeholder="Password"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="tel"
            name="phone"
            value={newStudent.phone}
            onChange={handleInputChange}
            placeholder="Phone Number"
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            name="address"
            value={newStudent.address}
            onChange={handleInputChange}
            placeholder="Address"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  </div>
);

const EditModal = ({
  showModal,
  setShowModal,
  studentData,
  handleEditSubmit,
  handleInputChange,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg w-96">
      <h2 className="text-xl font-bold mb-4">Edit Student</h2>
      <form onSubmit={handleEditSubmit}>
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            value={studentData.name}
            onChange={handleInputChange}
            placeholder="Full Name"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="email"
            name="email"
            value={studentData.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="tel"
            name="phone"
            value={studentData.phone}
            onChange={handleInputChange}
            placeholder="Phone Number"
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            name="address"
            value={studentData.address}
            onChange={handleInputChange}
            placeholder="Address"
            className="w-full p-2 border rounded"
            required
          />
          <div>
            <label className="block text-sm font-medium mb-2">
              New Password (leave blank to keep current)
            </label>
            <input
              type="password"
              name="password"
              value={studentData.password || ""}
              onChange={handleInputChange}
              placeholder="New Password"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
);

const DataSiswa = () => {
  const [studentsData, setStudentsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "student",
  });
  const [editingStudent, setEditingStudent] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    studentId: "",
  });

  const editing = { allowDeleting: true, allowEditing: true };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get("/api/users");

      const transformedData = response.data
        .filter((user) => user.user_type.role === "student")
        .map((user, index) => ({
          id: index + 1,
          studentId: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || "No phone",
          address: user.address || "No address",
          createdAt: new Date(user.createdAt).toLocaleDateString(),
        }));

      setStudentsData(transformedData);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "An error occurred while fetching data"
      );
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditClick = (data) => {
    setEditingStudent({
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      password: "",
      studentId: data.studentId,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      // Prepare the update data
      const updateData = new FormData();
      updateData.append("name", editingStudent.name);
      updateData.append("email", editingStudent.email);
      updateData.append("phone", editingStudent.phone);
      updateData.append("address", editingStudent.address);

      // Add password only if it's provided and not empty
      if (editingStudent.password && editingStudent.password.trim() !== "") {
        updateData.append("password", editingStudent.password);
      }

      const response = await axios.put(
        `/api/users/profile/${editingStudent.studentId}`,
        updateData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setShowEditModal(false);
        await fetchData(); // Refresh the grid data
        alert("Student updated successfully!");
      }
    } catch (error) {
      console.error("Error updating student:", error);
      alert(error.response?.data?.message || "Error updating student");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (data) => {
    try {
      if (window.confirm("Are you sure you want to delete this student?")) {
        setIsLoading(true);
        const response = await axios.delete(`/api/users/${data.studentId}`);

        if (response.status === 200) {
          alert("Student deleted successfully!");
          await fetchData();
        } else {
          throw new Error("Failed to delete student");
        }
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      alert(error.response?.data?.message || "Error deleting student");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/register", newStudent);
      await fetchData();
      setShowModal(false);
      setNewStudent({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        role: "student",
      });
      alert("Student registered successfully!");
    } catch (error) {
      console.error("Error registering student:", error);
      alert(error.response?.data?.message || "Error registering student");
    }
  };

  const studentGrid = [
    {
      field: "id",
      headerText: "No.",
      width: "50",
      textAlign: "Center",
    },
    {
      field: "studentId",
      headerText: "ID Siswa",
      width: "150",
      textAlign: "Center",
    },
    {
      field: "name",
      headerText: "Nama",
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
      field: "phone",
      headerText: "No. Telepon",
      width: "150",
      textAlign: "Center",
    },
    {
      field: "address",
      headerText: "Alamat",
      width: "200",
      textAlign: "Center",
    },
    {
      field: "createdAt",
      headerText: "Tanggal Daftar",
      width: "150",
      textAlign: "Center",
    },
    {
      field: "actions",
      headerText: "Aksi",
      width: "150",
      textAlign: "Center",
      template: (data) => (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => handleEditClick(data)}
            className="px-3 py-1 text-sm text-blue-500 hover:text-blue-700"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(data)}
            className="px-3 py-1 text-sm text-red-500 hover:text-red-700"
          >
            Hapus
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Data Siswa" />

      <div className="flex justify-between items-center mb-5">
        <input
          type="text"
          placeholder="Cari berdasarkan nama atau email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent w-1/3"
        />

        <div className="flex space-x-3">
          <button
            onClick={() => alert("Report di-generate!")}
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
          >
            Report
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600"
          >
            Tambah
          </button>
        </div>
      </div>

      {showModal && (
        <RegistrationModal
          showModal={showModal}
          setShowModal={setShowModal}
          handleAdd={handleAdd}
          newStudent={newStudent}
          handleInputChange={handleInputChange}
        />
      )}

      {showEditModal && (
        <EditModal
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          studentData={editingStudent}
          handleEditSubmit={handleEditSubmit}
          handleInputChange={handleEditInputChange}
        />
      )}

      <GridComponent
        id="gridcomp"
        dataSource={studentsData}
        allowPaging
        allowSorting
        allowExcelExport
        allowPdfExport
        editSettings={editing}
        pageSettings={{ pageSize: 10 }}
        contextMenuItems={["Copy", "ExcelExport", "PdfExport"]}
      >
        <ColumnsDirective>
          {studentGrid.map((item, index) => (
            <ColumnDirective key={index} {...item} />
          ))}
        </ColumnsDirective>
        <Inject
          services={[
            Resize,
            Sort,
            ContextMenu,
            Filter,
            Page,
            ExcelExport,
            Edit,
            PdfExport,
          ]}
        />
      </GridComponent>
    </div>
  );
};

export default DataSiswa;
