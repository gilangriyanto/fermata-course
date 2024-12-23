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

const DataGuru = () => {
  const [teacherData, setTeacherData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    instruments: [""],
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
        .filter((user) => user.user_type.role === "teacher")
        .map((user, index) => ({
          id: index + 1,
          teacherId: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || "No phone",
          address: user.address || "No address",
          instruments:
            user.user_type.teacher_data.instruments.join(", ") ||
            "No instruments",
          createdAt: new Date(user.createdAt).toLocaleDateString(),
        }));

      setTeacherData(transformedData);
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

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const filteredInstruments = formData.instruments.filter(
        (instrument) => instrument.trim() !== ""
      );
      const teacherData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        role: "teacher",
        teacher_data: {
          instruments: filteredInstruments,
        },
      };

      const response = await axios.post(`/api/users/register`, teacherData);

      // Reset form and close modal
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        instruments: [""],
      });
      setIsModalOpen(false);

      // Refresh the data
      await fetchData();

      // Show success message
      alert("Guru berhasil ditambahkan!");

      return response.data;
    } catch (error) {
      console.error("Error adding teacher:", error);
      alert(
        error.response?.data?.message ||
          "Terjadi kesalahan saat menambahkan guru"
      );
      throw error;
    }
  };

  const handleEdit = async (data) => {
    try {
      const response = await api.put(`/api/users/${data.teacherId}`, {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        user_type: {
          role: "teacher",
          teacher_data: {
            instruments: data.instruments.split(", "),
          },
        },
      });
      await fetchData();
      return response.data;
    } catch (error) {
      console.error("Error updating teacher:", error);
      throw error;
    }
  };

  const handleDelete = async (data) => {
    try {
      if (window.confirm("Are you sure you want to delete this student?")) {
        setIsLoading(true);
        const response = await axios.delete(`/api/users/${data.teacherId}`);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInstrumentChange = (index, value) => {
    const newInstruments = [...formData.instruments];
    newInstruments[index] = value;
    setFormData((prev) => ({
      ...prev,
      instruments: newInstruments,
    }));
  };

  const addInstrument = () => {
    setFormData((prev) => ({
      ...prev,
      instruments: [...prev.instruments, ""],
    }));
  };

  const removeInstrument = (index) => {
    setFormData((prev) => ({
      ...prev,
      instruments: prev.instruments.filter((_, i) => i !== index),
    }));
  };

  const filteredData = teacherData.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.instruments.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const teacherGrid = [
    {
      field: "id",
      headerText: "No.",
      width: "50",
      textAlign: "Center",
    },
    {
      field: "name",
      headerText: "Nama Guru",
      width: "150",
      textAlign: "Center",
    },
    {
      field: "instruments",
      headerText: "Instrumen",
      width: "200",
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
      headerText: "Tanggal Bergabung",
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
      <Header category="Page" title="Data Guru" />

      <div className="flex justify-between items-center mb-5">
        <input
          type="text"
          placeholder="Cari berdasarkan nama, email, atau instrumen..."
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
            onClick={() => setIsModalOpen(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600"
          >
            Tambah
          </button>
        </div>
      </div>

      {/* Modal Registrasi Guru */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-semibold mb-4">Registrasi Guru Baru</h2>
            <form onSubmit={handleAdd}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nama
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    No. Telepon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Alamat
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Instrumen
                  </label>
                  {formData.instruments.map((instrument, index) => (
                    <div key={index} className="flex mt-2">
                      <input
                        type="text"
                        value={instrument}
                        onChange={(e) =>
                          handleInstrumentChange(index, e.target.value)
                        }
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                        placeholder="Nama instrumen"
                        required
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeInstrument(index)}
                          className="ml-2 px-2 py-1 text-red-500 hover:text-red-700"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addInstrument}
                    className="mt-2 text-sm text-purple-600 hover:text-purple-800"
                  >
                    + Tambah Instrumen
                  </button>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <GridComponent
        id="gridcomp"
        dataSource={filteredData}
        allowPaging
        allowSorting
        allowExcelExport
        allowPdfExport
        editSettings={editing}
        pageSettings={{ pageSize: 10 }}
        contextMenuItems={["Copy", "ExcelExport", "PdfExport"]}
      >
        <ColumnsDirective>
          {teacherGrid.map((item, index) => (
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

export default DataGuru;
