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

// Add Schedule Modal Component
const AddScheduleModal = ({
  showAddScheduleModal,
  setShowAddScheduleModal,
  handleAddSchedule,
  scheduleFormData,
  handleScheduleInputChange,
  teachers,
  selectedPackageId,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
    <div className="bg-white rounded-lg w-full max-w-lg">
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-bold">Tambah Jadwal</h2>
      </div>

      <form onSubmit={(e) => handleAddSchedule(e, selectedPackageId)}>
        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Guru
            </label>
            <select
              name="teacher_id"
              value={scheduleFormData.teacher_id}
              onChange={handleScheduleInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Pilih Guru</option>
              {teachers.map((teacher) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tanggal
              </label>
              <input
                type="date"
                name="date"
                value={scheduleFormData.date}
                onChange={handleScheduleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Waktu
              </label>
              <input
                type="time"
                name="time"
                value={scheduleFormData.time}
                onChange={handleScheduleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Biaya Transport
              </label>
              <input
                type="number"
                name="transport_fee"
                value={scheduleFormData.transport_fee}
                onChange={handleScheduleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Biaya Guru
              </label>
              <input
                type="number"
                name="teacher_fee"
                value={scheduleFormData.teacher_fee}
                onChange={handleScheduleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ruangan
            </label>
            <input
              type="text"
              name="room"
              value={scheduleFormData.room}
              onChange={handleScheduleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => setShowAddScheduleModal(false)}
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

// / EditModal Component untuk mengedit data
const EditModal = ({
  showEditModal,
  setShowEditModal,
  handleEdit,
  editFormData,
  handleEditInputChange,
  students,
  packages,
  teachers,
  handleEditDateChange,
  handleEditScheduleChange,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
    <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-white px-6 py-4 border-b">
        <h2 className="text-xl font-bold">Edit Paket Siswa</h2>
      </div>
      <form onSubmit={handleEdit}>
        <div className="px-6 py-4 space-y-4">
          {/* Student Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Siswa
            </label>
            <select
              name="student_id"
              value={editFormData.student_id}
              onChange={handleEditInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Pilih Siswa</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>

          {/* Package Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Paket
            </label>
            <select
              name="package_id"
              value={editFormData.package_id}
              onChange={handleEditInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Pilih Paket</option>
              {packages.map((pkg) => (
                <option key={pkg._id} value={pkg._id}>
                  {pkg.name} - {pkg.instrument}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status Pembayaran
            </label>
            <select
              name="payment_status"
              value={editFormData.payment_status}
              onChange={handleEditInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="Belum Lunas">Belum Lunas</option>
              <option value="Lunas">Lunas</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Total Pembayaran
            </label>
            <input
              type="number"
              name="payment_total"
              value={editFormData.payment_total}
              onChange={handleEditInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tanggal Pembayaran
            </label>
            <input
              type="date"
              name="payment_date"
              value={editFormData.payment_date.split("T")[0]}
              onChange={handleEditInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Period Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tanggal Mulai
              </label>
              <input
                type="date"
                name="start"
                value={editFormData.date_periode[0].start.split("T")[0]}
                onChange={(e) => handleEditDateChange(e, "start")}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tanggal Selesai
              </label>
              <input
                type="date"
                name="end"
                value={editFormData.date_periode[0].end.split("T")[0]}
                onChange={(e) => handleEditDateChange(e, "end")}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          {/* Schedule Information */}
          <div className="border p-4 rounded">
            <h3 className="font-medium mb-3">Jadwal</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Guru
                </label>
                <select
                  name="teacher_id"
                  value={editFormData.schedules[0].teacher_id}
                  onChange={(e) => handleEditScheduleChange(e)}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Pilih Guru</option>
                  {teachers.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={editFormData.schedules[0].date.split("T")[0]}
                    onChange={(e) => handleEditScheduleChange(e)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Waktu
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={editFormData.schedules[0].time}
                    onChange={(e) => handleEditScheduleChange(e)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Biaya Transport
                  </label>
                  <input
                    type="number"
                    name="transport_fee"
                    value={editFormData.schedules[0].transport_fee}
                    onChange={(e) => handleEditScheduleChange(e)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Biaya Guru
                  </label>
                  <input
                    type="number"
                    name="teacher_fee"
                    value={editFormData.schedules[0].teacher_fee}
                    onChange={(e) => handleEditScheduleChange(e)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ruangan
                </label>
                <input
                  type="text"
                  name="room"
                  value={editFormData.schedules[0].room}
                  onChange={(e) => handleEditScheduleChange(e)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white px-6 py-4 border-t flex justify-end space-x-2 mt-4">
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

// StudentPackage Registration Modal Component
const PackageRegistrationModal = ({
  showModal,
  setShowModal,
  handleAdd,
  formData,
  handleInputChange,
  students,
  packages,
  teachers,
  handleDateChange,
  handleScheduleChange,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
    <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-white px-6 py-4 border-b">
        <h2 className="text-xl font-bold">Tambah Paket Siswa</h2>
      </div>

      <form onSubmit={handleAdd}>
        <div className="px-6 py-4 space-y-4">
          {/* Student Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Siswa
            </label>
            <select
              name="student_id"
              value={formData.student_id}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Pilih Siswa</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>

          {/* Package Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Paket
            </label>
            <select
              name="package_id"
              value={formData.package_id}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Pilih Paket</option>
              {packages.map((pkg) => (
                <option key={pkg._id} value={pkg._id}>
                  {pkg.name} - {pkg.instrument}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status Pembayaran
            </label>
            <select
              name="payment_status"
              value={formData.payment_status}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="Belum Lunas">Belum Lunas</option>
              <option value="Lunas">Lunas</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Total Pembayaran
            </label>
            <input
              type="number"
              name="payment_total"
              value={formData.payment_total}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tanggal Pembayaran
            </label>
            <input
              type="date"
              name="payment_date"
              value={formData.payment_date}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Period Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tanggal Mulai
              </label>
              <input
                type="date"
                name="start"
                value={formData.date_periode[0].start}
                onChange={(e) => handleDateChange(e, "start")}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tanggal Selesai
              </label>
              <input
                type="date"
                name="end"
                value={formData.date_periode[0].end}
                onChange={(e) => handleDateChange(e, "end")}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          {/* Schedule Information */}
          <div className="border p-4 rounded">
            <h3 className="font-medium mb-3">Jadwal</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Guru
                </label>
                <select
                  name="teacher_id"
                  value={formData.schedules[0].teacher_id}
                  onChange={(e) => handleScheduleChange(e)}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Pilih Guru</option>
                  {teachers.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.schedules[0].date}
                    onChange={(e) => handleScheduleChange(e)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Waktu
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.schedules[0].time}
                    onChange={(e) => handleScheduleChange(e)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Biaya Transport
                  </label>
                  <input
                    type="number"
                    name="transport_fee"
                    value={formData.schedules[0].transport_fee}
                    onChange={(e) => handleScheduleChange(e)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Biaya Guru
                  </label>
                  <input
                    type="number"
                    name="teacher_fee"
                    value={formData.schedules[0].teacher_fee}
                    onChange={(e) => handleScheduleChange(e)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ruangan
                </label>
                <input
                  type="text"
                  name="room"
                  value={formData.schedules[0].room}
                  onChange={(e) => handleScheduleChange(e)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white px-6 py-4 border-t flex justify-end space-x-2 mt-4">
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

const StudentPackage = () => {
  const [packageData, setPackageData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [packages, setPackages] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);

  const [formData, setFormData] = useState({
    student_id: "",
    package_id: "",
    payment_status: "Belum Lunas",
    payment_total: 1500000,
    payment_date: "",
    date_periode: [
      {
        start: "",
        end: "",
      },
    ],
    schedules: [
      {
        teacher_id: "",
        date: "",
        time: "",
        transport_fee: 50000,
        teacher_fee: 100000,
        room: "Ruang 1",
      },
    ],
  });

  const [editFormData, setEditFormData] = useState({
    student_id: "",
    package_id: "",
    payment_status: "",
    payment_total: 0,
    payment_date: "",
    date_periode: [
      {
        start: "",
        end: "",
      },
    ],
    schedules: [
      {
        teacher_id: "",
        date: "",
        time: "",
        transport_fee: 0,
        teacher_fee: 0,
        room: "",
      },
    ],
  });

  const [scheduleFormData, setScheduleFormData] = useState({
    teacher_id: "",
    date: "",
    time: "",
    transport_fee: 50000,
    teacher_fee: 100000,
    room: "Ruang 1",
  });

  // // New state for Add Schedule
  // const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  // const [selectedPackageId, setSelectedPackageId] = useState(null);
  // const [scheduleFormData, setScheduleFormData] = useState({
  //   teacher_id: "",
  //   date: "",
  //   time: "",
  //   transport_fee: 50000,
  //   teacher_fee: 100000,
  //   room: "Ruang 1",
  // });

  // // State baru untuk edit
  // const [showEditModal, setShowEditModal] = useState(false);
  // const [selectedPackageId, setSelectedPackageId] = useState(null);
  // const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  // const [editFormData, setEditFormData] = useState({
  //   student_id: "",
  //   package_id: "",
  //   payment_status: "",
  //   payment_total: 0,
  //   payment_date: "",
  //   date_periode: [
  //     {
  //       start: "",
  //       end: "",
  //     },
  //   ],
  //   schedules: [
  //     {
  //       teacher_id: "",
  //       date: "",
  //       time: "",
  //       transport_fee: 0,
  //       teacher_fee: 0,
  //       room: "",
  //     },
  //   ],
  // });

  const api = axios.create({
    baseURL: "",
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [
        studentPackagesResponse,
        studentsResponse,
        packagesResponse,
        teachersResponse,
      ] = await Promise.all([
        axios.get("/api/student-packages"),
        axios.get("/api/users", { params: { role: "student" } }),
        axios.get("/api/packages"),
        axios.get("/api/users", { params: { role: "teacher" } }),
      ]);

      setPackageData(studentPackagesResponse.data.data);
      setStudents(studentsResponse.data);
      setPackages(packagesResponse.data);
      setTeachers(teachersResponse.data);
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

  // // New state for Add Schedule
  // const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  // const [selectedPackageId, setSelectedPackageId] = useState(null);
  // const [scheduleFormData, setScheduleFormData] = useState({
  //   teacher_id: "",
  //   date: "",
  //   time: "",
  //   transport_fee: 50000,
  //   teacher_fee: 100000,
  //   room: "Ruang 1",
  // });

  // Handler for schedule input changes
  const handleScheduleInputChange = (e) => {
    const { name, value } = e.target;
    setScheduleFormData((prev) => ({
      ...prev,
      [name]:
        name === "transport_fee" || name === "teacher_fee"
          ? Number(value)
          : value,
    }));
  };

  // Handler for adding a new schedule
  const handleAddSchedule = async (e, packageId) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `/api/student-packages/${packageId}/schedules`,
        scheduleFormData
      );

      setShowAddScheduleModal(false);
      setScheduleFormData({
        teacher_id: "",
        date: "",
        time: "",
        transport_fee: 50000,
        teacher_fee: 100000,
        room: "Ruang 1",
      });
      await fetchData();
      alert("Jadwal berhasil ditambahkan!");
    } catch (error) {
      console.error("Error adding schedule:", error);
      alert(
        error.response?.data?.message ||
          "Terjadi kesalahan saat menambahkan jadwal"
      );
    }
  };

  // Handler for Add Schedule button click
  const handleAddScheduleClick = (packageId) => {
    setSelectedPackageId(packageId);
    setShowAddScheduleModal(true);
  };

  // Handler untuk edit
  const handleEditClick = (data) => {
    setEditFormData({
      student_id: data.student_id._id,
      package_id: data.package_id._id,
      payment_status: data.payment_status,
      payment_total: data.payment_total,
      payment_date: data.payment_date,
      date_periode: [
        {
          start: data.date_periode[0].start,
          end: data.date_periode[0].end,
        },
      ],
      schedules: [
        {
          teacher_id: data.schedules[0].teacher_id,
          date: data.schedules[0].date,
          time: data.schedules[0].time,
          transport_fee: data.schedules[0].transport_fee,
          teacher_fee: data.schedules[0].teacher_fee,
          room: data.schedules[0].room,
        },
      ],
    });
    setSelectedPackageId(data._id);
    setSelectedScheduleId(data.schedules[0]._id);
    setShowEditModal(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditDateChange = (e, field) => {
    const { value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      date_periode: [
        {
          ...prev.date_periode[0],
          [field]: value,
        },
      ],
    }));
  };

  const handleEditScheduleChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      schedules: [
        {
          ...prev.schedules[0],
          [name]:
            name === "transport_fee" || name === "teacher_fee"
              ? Number(value)
              : value,
        },
      ],
    }));
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `/api/student-packages/${selectedPackageId}/schedules/${selectedScheduleId}`,
        editFormData
      );

      setShowEditModal(false);
      await fetchData();
      alert("Paket siswa berhasil diupdate!");
    } catch (error) {
      console.error("Error updating student package:", error);
      alert(
        error.response?.data?.message ||
          "Terjadi kesalahan saat mengupdate paket siswa"
      );
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (e, field) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      date_periode: [
        {
          ...prev.date_periode[0],
          [field]: value,
        },
      ],
    }));
  };

  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      schedules: [
        {
          ...prev.schedules[0],
          [name]:
            name === "transport_fee" || name === "teacher_fee"
              ? Number(value)
              : value,
        },
      ],
    }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/student-packages", formData);

      // Reset form and close modal
      setFormData({
        student_id: "",
        package_id: "",
        payment_status: "Belum Lunas",
        payment_total: 1500000,
        payment_date: "",
        date_periode: [
          {
            start: "",
            end: "",
          },
        ],
        schedules: [
          {
            teacher_id: "",
            date: "",
            time: "",
            transport_fee: 50000,
            teacher_fee: 100000,
            room: "Ruang 1",
          },
        ],
      });
      setShowModal(false);

      // Refresh the data
      await fetchData();

      alert("Paket siswa berhasil ditambahkan!");
    } catch (error) {
      console.error("Error adding student package:", error);
      alert(
        error.response?.data?.message ||
          "Terjadi kesalahan saat menambahkan paket siswa"
      );
    }
  };

  const packageGrid = [
    {
      field: "student_id.name",
      headerText: "Nama Siswa",
      width: "150",
      textAlign: "Center",
    },
    {
      field: "package_id.name",
      headerText: "Nama Paket",
      width: "200",
      textAlign: "Center",
    },
    {
      field: "payment_status",
      headerText: "Status Pembayaran",
      width: "150",
      textAlign: "Center",
      template: (props) => (
        <div
          className={`px-2 py-1 rounded-full text-xs ${
            props.payment_status === "Lunas"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {props.payment_status}
        </div>
      ),
    },
    {
      field: "payment_total",
      headerText: "Total Pembayaran",
      width: "150",
      textAlign: "Center",
      template: (props) => `Rp ${props.payment_total.toLocaleString("id-ID")}`,
    },
    {
      field: "payment_date",
      headerText: "Tanggal Pembayaran",
      width: "150",
      textAlign: "Center",
      template: (props) =>
        new Date(props.payment_date).toLocaleDateString("id-ID"),
    },
    {
      field: "date_periode",
      headerText: "Periode",
      width: "200",
      textAlign: "Center",
      template: (props) => {
        const start = new Date(props.date_periode[0].start).toLocaleDateString(
          "id-ID"
        );
        const end = new Date(props.date_periode[0].end).toLocaleDateString(
          "id-ID"
        );
        return `${start} - ${end}`;
      },
    },
    {
      headerText: "Actions",
      width: "200",
      textAlign: "Center",
      template: (props) => (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => handleEditClick(props)}
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            onClick={() => handleAddScheduleClick(props._id)}
            className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Tambah Jadwal
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
      <Header category="Page" title="Data Paket Siswa" />

      <div className="flex justify-between items-center mb-5">
        <input
          type="text"
          placeholder="Cari berdasarkan nama siswa atau paket..."
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
          handleDateChange={handleDateChange}
          handleScheduleChange={handleScheduleChange}
          students={students}
          packages={packages}
          teachers={teachers}
        />
      )}

      {showEditModal && (
        <EditModal
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          handleEdit={handleEdit}
          editFormData={editFormData}
          handleEditInputChange={handleEditInputChange}
          handleEditDateChange={handleEditDateChange}
          handleEditScheduleChange={handleEditScheduleChange}
          students={students}
          packages={packages}
          teachers={teachers}
        />
      )}

      {showAddScheduleModal && (
        <AddScheduleModal
          showAddScheduleModal={showAddScheduleModal}
          setShowAddScheduleModal={setShowAddScheduleModal}
          handleAddSchedule={handleAddSchedule}
          scheduleFormData={scheduleFormData}
          handleScheduleInputChange={handleScheduleInputChange}
          teachers={teachers}
          selectedPackageId={selectedPackageId}
        />
      )}

      <GridComponent
        id="gridcomp"
        dataSource={packageData}
        allowPaging
        allowSorting
        allowExcelExport
        allowPdfExport
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
            PdfExport,
          ]}
        />
      </GridComponent>
    </div>
  );
};

export default StudentPackage;
