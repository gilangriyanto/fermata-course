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

// Package Registration Modal Component
const PackageRegistrationModal = ({
  showModal,
  setShowModal,
  handleAdd,
  formData,
  handleInputChange,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg w-96">
      <h2 className="text-xl font-bold mb-4">Tambah Paket Baru</h2>
      <form onSubmit={handleAdd}>
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Nama Paket"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="instrument"
            value={formData.instrument}
            onChange={handleInputChange}
            placeholder="Instrumen"
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Deskripsi"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            placeholder="Durasi (menit)"
            className="w-full p-2 border rounded"
            required
            min="1"
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Harga"
            className="w-full p-2 border rounded"
            required
            min="0"
          />
          <input
            type="number"
            name="sessionCount"
            value={formData.sessionCount}
            onChange={handleInputChange}
            placeholder="Jumlah Sesi"
            className="w-full p-2 border rounded"
            required
            min="1"
          />
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  </div>
);

// Package Edit Modal Component
const PackageEditModal = ({
  showEditModal,
  setShowEditModal,
  editFormData,
  handleEditSubmit,
  handleEditInputChange,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg w-96">
      <h2 className="text-xl font-bold mb-4">Edit Paket</h2>
      <form onSubmit={handleEditSubmit}>
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            value={editFormData.name}
            onChange={handleEditInputChange}
            placeholder="Nama Paket"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="instrument"
            value={editFormData.instrument}
            onChange={handleEditInputChange}
            placeholder="Instrumen"
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            name="description"
            value={editFormData.description}
            onChange={handleEditInputChange}
            placeholder="Deskripsi"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            name="duration"
            value={editFormData.duration}
            onChange={handleEditInputChange}
            placeholder="Durasi (menit)"
            className="w-full p-2 border rounded"
            required
            min="1"
          />
          <input
            type="number"
            name="price"
            value={editFormData.price}
            onChange={handleEditInputChange}
            placeholder="Harga"
            className="w-full p-2 border rounded"
            required
            min="0"
          />
          <input
            type="number"
            name="sessionCount"
            value={editFormData.sessionCount}
            onChange={handleEditInputChange}
            placeholder="Jumlah Sesi"
            className="w-full p-2 border rounded"
            required
            min="1"
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={editFormData.isActive}
              onChange={handleEditInputChange}
              className="mr-2"
            />
            <label>Aktif</label>
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            type="button"
            onClick={() => setShowEditModal(false)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  </div>
);

const Package = () => {
  const [packageData, setPackageData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: 30,
    price: 0,
    sessionCount: 12,
    instrument: "",
  });
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    duration: 30,
    price: 0,
    sessionCount: 12,
    instrument: "",
    isActive: true,
    _id: null,
  });

  const editing = { allowDeleting: true, allowEditing: true };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get("/api/packages");
      setPackageData(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "An error occurred while fetching data"
      );
      console.error("Error fetching packages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "duration" || name === "sessionCount"
          ? Number(value)
          : value,
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "price" || name === "duration" || name === "sessionCount"
          ? Number(value)
          : value,
    }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/packages", formData);
      await fetchData();
      setShowModal(false);
      setFormData({
        name: "",
        description: "",
        duration: 30,
        price: 0,
        sessionCount: 12,
        instrument: "",
      });
      alert("Paket berhasil ditambahkan!");
    } catch (error) {
      console.error("Error adding package:", error);
      alert(error.response?.data?.message || "Error menambahkan paket");
    }
  };

  const handleEditClick = (data) => {
    setEditFormData({
      _id: data._id,
      name: data.name,
      description: data.description,
      duration: data.duration,
      price: data.price,
      sessionCount: data.sessionCount,
      instrument: data.instrument,
      isActive: data.isActive,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/packages/${editFormData._id}`, {
        name: editFormData.name,
        description: editFormData.description,
        duration: editFormData.duration,
        price: editFormData.price,
        sessionCount: editFormData.sessionCount,
        instrument: editFormData.instrument,
        isActive: editFormData.isActive,
      });

      if (response.status === 200) {
        alert("Paket berhasil diperbarui!");
        await fetchData();
        setShowEditModal(false);
      } else {
        throw new Error("Gagal memperbarui paket");
      }
    } catch (error) {
      console.error("Error updating package:", error);
      alert(error.response?.data?.message || "Error memperbarui paket");
    }
  };

  const handleDelete = async (data) => {
    try {
      if (window.confirm("Apakah anda yakin ingin menghapus paket ini?")) {
        setIsLoading(true);
        const response = await axios.delete(`/api/packages/${data._id}`);

        if (response.status === 200) {
          alert("Paket berhasil dihapus!");
          await fetchData();
        } else {
          throw new Error("Gagal menghapus paket");
        }
      }
    } catch (error) {
      console.error("Error deleting package:", error);
      alert(error.response?.data?.message || "Error menghapus paket");
    } finally {
      setIsLoading(false);
    }
  };

  const packageGrid = [
    {
      field: "name",
      headerText: "Nama Paket",
      width: "200",
      textAlign: "Center",
    },
    {
      field: "instrument",
      headerText: "Instrumen",
      width: "150",
      textAlign: "Center",
    },
    {
      field: "description",
      headerText: "Deskripsi",
      width: "250",
      textAlign: "Center",
    },
    {
      field: "duration",
      headerText: "Durasi (menit)",
      width: "150",
      textAlign: "Center",
    },
    {
      field: "price",
      headerText: "Harga",
      width: "150",
      textAlign: "Center",
      format: "C2",
      template: (props) => {
        return `Rp ${props.price.toLocaleString("id-ID")}`;
      },
    },
    {
      field: "sessionCount",
      headerText: "Jumlah Sesi",
      width: "150",
      textAlign: "Center",
    },
    {
      field: "isActive",
      headerText: "Status",
      width: "120",
      textAlign: "Center",
      template: (props) => (
        <div
          className={`px-2 py-1 rounded-full text-xs ${
            props.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {props.isActive ? "Aktif" : "Nonaktif"}
        </div>
      ),
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
      <Header category="Page" title="Data Paket" />

      <div className="flex justify-between items-center mb-5">
        <input
          type="text"
          placeholder="Cari berdasarkan nama paket, instrumen, atau deskripsi..."
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
        <PackageRegistrationModal
          showModal={showModal}
          setShowModal={setShowModal}
          handleAdd={handleAdd}
          formData={formData}
          handleInputChange={handleInputChange}
        />
      )}

      {showEditModal && (
        <PackageEditModal
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          editFormData={editFormData}
          handleEditSubmit={handleEditSubmit}
          handleEditInputChange={handleEditInputChange}
        />
      )}

      <GridComponent
        id="gridcomp"
        dataSource={packageData}
        allowPaging
        allowSorting
        allowExcelExport
        allowPdfExport
        editSettings={editing}
        pageSettings={{ pageSize: 10 }}
        contextMenuItems={["Copy", "ExcelExport", "PdfExport"]}
      >
        <ColumnsDirective>
          {packageGrid.map((item, index) => (
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

export default Package;
