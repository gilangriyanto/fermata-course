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

// Registration Modal Component
const RegistrationModal = ({
  showModal,
  setShowModal,
  handleAdd,
  formData,
  handleInputChange,
  handleInstrumentChange,
  addInstrument,
  removeInstrument,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Register New Teacher</h2>
      <form onSubmit={handleAdd}>
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Full Name"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Phone Number"
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Address"
            className="w-full p-2 border rounded"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instruments
            </label>
            {formData.instruments.map((instrument, index) => (
              <div key={index} className="flex mt-2">
                <select
                  value={instrument}
                  onChange={(e) =>
                    handleInstrumentChange(index, e.target.value)
                  }
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                >
                  <option value="">Select Instrument</option>
                  <option value="Piano">Piano</option>
                  <option value="Vokal">Vokal</option>
                  <option value="Drum">Drum</option>
                  <option value="Gitar">Gitar</option>
                  <option value="Biola">Biola</option>
                  <option value="Bass">Bass</option>
                </select>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeInstrument(index)}
                    className="ml-2 px-2 py-1 text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addInstrument}
              className="mt-2 text-sm text-purple-600 hover:text-purple-800"
            >
              + Add Instrument
            </button>
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
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  </div>
);

// Edit Modal Component
const EditModal = ({
  showModal,
  setShowModal,
  teacherData,
  handleEditSubmit,
  handleInputChange,
  handleInstrumentChange,
  addInstrument,
  removeInstrument,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Edit Teacher</h2>
      <form onSubmit={handleEditSubmit}>
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            value={teacherData.name}
            onChange={handleInputChange}
            placeholder="Full Name"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="email"
            name="email"
            value={teacherData.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="tel"
            name="phone"
            value={teacherData.phone}
            onChange={handleInputChange}
            placeholder="Phone Number"
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            name="address"
            value={teacherData.address}
            onChange={handleInputChange}
            placeholder="Address"
            className="w-full p-2 border rounded"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instruments
            </label>
            {teacherData.instruments.map((instrument, index) => (
              <div key={index} className="flex mt-2">
                <select
                  value={instrument}
                  onChange={(e) =>
                    handleInstrumentChange(index, e.target.value)
                  }
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                >
                  <option value="">Select Instrument</option>
                  <option value="Piano">Piano</option>
                  <option value="Vokal">Vokal</option>
                  <option value="Drum">Drum</option>
                  <option value="Gitar">Gitar</option>
                  <option value="Biola">Biola</option>
                  <option value="Bass">Bass</option>
                </select>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeInstrument(index)}
                    className="ml-2 px-2 py-1 text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addInstrument}
              className="mt-2 text-sm text-purple-600 hover:text-purple-800"
            >
              + Add Instrument
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              New Password (leave blank to keep current)
            </label>
            <input
              type="password"
              name="password"
              value={teacherData.password || ""}
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

// Main DataGuru Component
const DataGuru = () => {
  const [teacherData, setTeacherData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    instruments: [""],
    role: "teacher",
  });
  const [editingTeacher, setEditingTeacher] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    teacherId: "",
    instruments: [""],
  });

  const editing = { allowDeleting: true, allowEditing: true };

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingTeacher((prev) => ({
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

  const handleEditInstrumentChange = (index, value) => {
    const newInstruments = [...editingTeacher.instruments];
    newInstruments[index] = value;
    setEditingTeacher((prev) => ({
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

  const addEditInstrument = () => {
    setEditingTeacher((prev) => ({
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

  const removeEditInstrument = (index) => {
    setEditingTeacher((prev) => ({
      ...prev,
      instruments: prev.instruments.filter((_, i) => i !== index),
    }));
  };

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

      console.log("Sending registration data:", teacherData);

      const response = await axios.post("/api/auth/register", teacherData);

      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        instruments: [""],
        role: "teacher",
      });

      setShowModal(false);
      await fetchData();
      alert("Teacher registered successfully!");
      console.log("Registration response:", response.data);
    } catch (error) {
      console.error("Error registering teacher:", error);
      alert(error.response?.data?.message || "Error registering teacher");
    }
  };

  const handleEditClick = (data) => {
    setEditingTeacher({
      name: data.name,
      email: data.email,
      phone: data.phone === "No phone" ? "" : data.phone,
      address: data.address === "No address" ? "" : data.address,
      password: "",
      teacherId: data.teacherId,
      instruments:
        data.instruments === "No instruments"
          ? [""]
          : data.instruments.split(", "),
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const updateData = {
        name: editingTeacher.name,
        email: editingTeacher.email,
        phone: editingTeacher.phone,
        address: editingTeacher.address,
        role: "teacher",
        teacher_data: {
          instruments: editingTeacher.instruments.filter(
            (i) => i.trim() !== ""
          ),
        },
      };

      if (editingTeacher.password && editingTeacher.password.trim() !== "") {
        updateData.password = editingTeacher.password;
      }

      const response = await axios.put(
        `/api/users/profile/${editingTeacher.teacherId}`,
        updateData
      );

      if (response.status === 200) {
        setShowEditModal(false);
        await fetchData();
        alert("Teacher updated successfully!");
      }
    } catch (error) {
      console.error("Error updating teacher:", error);
      alert(error.response?.data?.message || "Error updating teacher");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (data) => {
    try {
      if (window.confirm("Are you sure you want to delete this teacher?")) {
        setIsLoading(true);
        const response = await axios.delete(`/api/users/${data.teacherId}`);

        if (response.status === 200) {
          alert("Teacher deleted successfully!");
          await fetchData();
        } else {
          throw new Error("Failed to delete teacher");
        }
      }
    } catch (error) {
      console.error("Error deleting teacher:", error);
      alert(error.response?.data?.message || "Error deleting teacher");
    } finally {
      setIsLoading(false);
    }
  };

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

  const filteredData = teacherData.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.instruments.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            onClick={() => setShowModal(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600"
          >
            Tambah
          </button>
        </div>
      </div>

      {/* Registration Modal */}
      {showModal && (
        <RegistrationModal
          showModal={showModal}
          setShowModal={setShowModal}
          handleAdd={handleAdd}
          formData={formData}
          handleInputChange={handleInputChange}
          handleInstrumentChange={handleInstrumentChange}
          addInstrument={addInstrument}
          removeInstrument={removeInstrument}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <EditModal
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          teacherData={editingTeacher}
          handleEditSubmit={handleEditSubmit}
          handleInputChange={handleEditInputChange}
          handleInstrumentChange={handleEditInstrumentChange}
          addInstrument={addEditInstrument}
          removeInstrument={removeEditInstrument}
        />
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
