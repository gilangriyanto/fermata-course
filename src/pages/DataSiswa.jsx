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

// Memindahkan RegistrationModal ke luar komponen utama
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

const DataSiswa = () => {
  const [studentsData, setStudentsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "student",
  });

  const editing = { allowDeleting: true, allowEditing: true };

  const api = axios.create({
    baseURL: "/api/users",
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
    },
  });

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
          instrument: "Not specified",
          targetLessons: "Not specified",
          remainingLessons: "Not specified",
          phone: user.phone || "No phone",
          email: user.email,
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

  const handleEdit = async (data) => {
    try {
      const response = await api.put(`/api/users/${data.studentId}`, {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
      });
      await fetchData(); // Refresh data setelah edit
      return response.data;
    } catch (error) {
      console.error("Error updating student:", error);
      throw error;
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
      const response = await axios.post("/api/users/register", newStudent);
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
            onClick={() => handleEdit(data)}
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
