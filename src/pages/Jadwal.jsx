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
} from "@syncfusion/ej2-react-grids";
import { Header } from "../components";
import { useAuth } from "../contexts/AuthContext";

// EditAttendanceModal Component
const EditAttendanceModal = ({
  showModal,
  setShowModal,
  handleEditSubmit,
  editData,
  setEditData,
  selectedSchedule,
  handleImageChange,
  imagePreview,
  setImagePreview,
  isSubmitting,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
    <div className="bg-white rounded-lg w-full max-w-lg">
      <div className="px-6 py-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold">Edit Presensi</h2>
        <button
          onClick={() => setShowModal(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      <form
        onSubmit={(e) => {
          console.log("Form submit with IDs:", {
            studentPackageId: selectedSchedule.studentPackageId,
            scheduleId: selectedSchedule.scheduleId,
          });
          handleEditSubmit(
            e,
            selectedSchedule.studentPackageId,
            selectedSchedule.scheduleId
          );
        }}
      >
        {/* Form content remains the same */}
        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status Presensi
            </label>
            <select
              name="attendance_status"
              value={editData.attendance_status}
              onChange={(e) =>
                setEditData({ ...editData, attendance_status: e.target.value })
              }
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Pilih Status</option>
              <option value="Success">Success</option>
              <option value="Belum Berlangsung">Belum Berlangsung</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catatan
            </label>
            <textarea
              name="note"
              value={editData.note}
              onChange={(e) =>
                setEditData({ ...editData, note: e.target.value })
              }
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Foto Aktivitas
            </label>
            <div className="mt-1 flex items-center">
              <input
                type="file"
                name="activity_photo"
                onChange={handleImageChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                accept="image/*"
              />
            </div>
            {imagePreview && (
              <div className="mt-2 relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-full h-40 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setEditData({ ...editData, activity_photo: null });
                    setImagePreview(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
            disabled={isSubmitting}
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Menyimpan...
              </>
            ) : (
              "Simpan"
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
);

const Jadwal = () => {
  // State Management
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewType, setViewType] = useState("all");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editData, setEditData] = useState({
    attendance_status: "",
    note: "",
    activity_photo: null,
  });

  // Auth Context
  const { user } = useAuth();
  const getUserRole = () => user?.role || "student";
  const isAdmin = getUserRole() === "admin";

  // Grid Configuration
  const toolbarOptions = ["Search"];
  const editing = {
    allowDeleting: true,
    allowEditing: true,
    allowAdding: false,
  };

  // Update state untuk view modal
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);

  // Utility Functions
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setImagePreview(null);
    setSelectedImage(null);
    setEditData({
      attendance_status: "",
      note: "",
      activity_photo: null,
    });
  };

  // Data Transformation Functions
  // Perbaikan pada transformScheduleData untuk memastikan ID di-map dengan benar
  // Update fungsi transformScheduleData untuk menangani package_id null
  const transformScheduleData = (rawData, currentViewType) => {
    if (!rawData) return [];

    const flattenedData = [];

    rawData.forEach((studentPackage) => {
      // Pastikan studentPackage._id ada sebelum memproses schedules
      if (
        !studentPackage._id ||
        !studentPackage.schedules ||
        !Array.isArray(studentPackage.schedules)
      ) {
        return;
      }

      studentPackage.schedules.forEach((schedule) => {
        flattenedData.push({
          id: schedule._id,
          studentPackageId: studentPackage._id, // ID dari level teratas
          packageId: studentPackage.package_id?._id,
          studentName: studentPackage.student_id?.name || "N/A",
          packageName: studentPackage.package_id?.name || "No Package",
          teacherName: schedule.teacher_id?.name || "N/A",
          date: new Date(schedule.date).toLocaleDateString("id-ID"),
          time: schedule.time || "N/A",
          transportFee: schedule.transport_fee || 0,
          teacherFee: schedule.teacher_fee || 0,
          room: schedule.room || "N/A",
          attendanceStatus: schedule.attendance_status || "Belum Berlangsung",
          note: schedule.note || "-",
          activityPhoto: schedule.activity_photo || "-",
        });
      });
    });

    // Debug log untuk memastikan data sudah benar
    console.log(
      "Transformed Data with correct studentPackageId:",
      flattenedData
    );
    return flattenedData;
  };

  // Update handleEditAttendance untuk menangani studentPackageId dengan benar
  // Update handleEditAttendance untuk menerima studentPackageId
  const handleEditAttendance = (studentPackageId, scheduleId) => {
    console.log("Debug IDs:", { studentPackageId, scheduleId });

    const schedule = scheduleData.find((item) => item.id === scheduleId);

    if (!schedule) {
      console.error("Schedule not found");
      alert("Data jadwal tidak ditemukan");
      return;
    }

    // Gunakan studentPackageId yang diterima dari parameter
    if (!studentPackageId) {
      console.error("Student Package ID not found", {
        studentPackageId,
        schedule,
      });
      alert("Student Package ID tidak ditemukan");
      return;
    }

    setSelectedSchedule({
      studentPackageId: studentPackageId,
      scheduleId: scheduleId,
    });

    setEditData({
      attendance_status: schedule.attendanceStatus || "",
      note: schedule.note || "",
      activity_photo: schedule.activityPhoto || null,
    });

    if (schedule.activityPhoto && schedule.activityPhoto !== "-") {
      setImagePreview(schedule.activityPhoto);
    } else {
      setImagePreview(null);
    }

    setSelectedImage(null);
    setShowEditModal(true);
  };

  // Update handleEditSubmit untuk menggunakan endpoint dengan studentPackageId yang benar
  const handleEditSubmit = async (e, studentPackageId, scheduleId) => {
    e.preventDefault();

    console.log("Submit with IDs:", { studentPackageId, scheduleId });

    if (!studentPackageId || !scheduleId) {
      console.error("Missing IDs in submission:", {
        studentPackageId,
        scheduleId,
      });
      alert("Data ID tidak lengkap");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("attendance_status", editData.attendance_status);
      formData.append("note", editData.note);

      if (selectedImage) {
        formData.append("activity_photo", selectedImage);
      }

      console.log(
        "Sending request to:",
        `/api/student-packages/${studentPackageId}/schedules/${scheduleId}/attendance`
      );
      console.log("With data:", {
        attendance_status: editData.attendance_status,
        note: editData.note,
        hasImage: !!selectedImage,
      });

      const response = await axios.put(
        `/api/student-packages/${studentPackageId}/schedules/${scheduleId}/attendance`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        handleCloseModal();
        await fetchScheduleData();
        alert("Presensi berhasil diupdate!");
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
      alert(
        error.response?.data?.message ||
          "Terjadi kesalahan saat mengupdate presensi"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Data Fetching
  const fetchScheduleData = async () => {
    try {
      setLoading(true);
      setError(null);

      let endpoint = "/api/student-packages/schedules/";
      endpoint += isAdmin
        ? "all"
        : getUserRole() === "student"
        ? "student"
        : "teacher";

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        const transformedData = transformScheduleData(
          response.data.data,
          viewType
        );
        setScheduleData(transformedData);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch schedule data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchScheduleData();
    }
  }, [user, viewType]);

  // Column Definitions
  // Perbaikan pada getActionColumn untuk memastikan passing ID yang benar
  const getActionColumn = () => ({
    field: "actions",
    headerText: "Actions",
    width: "120",
    textAlign: "Center",
    template: (rowData) => {
      console.log("Action column rowData:", rowData);

      return (
        <div className="flex justify-center">
          {(getUserRole() === "teacher" || getUserRole() === "admin") && (
            <button
              onClick={() => {
                console.log("Clicking edit with IDs:", {
                  studentPackageId: rowData.studentPackageId, // Gunakan studentPackageId langsung
                  scheduleId: rowData.id,
                });
                handleEditAttendance(rowData.studentPackageId, rowData.id); // Ubah parameter pertama ke studentPackageId
              }}
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Edit Presensi
            </button>
          )}
        </div>
      );
    },
  });

  const getActivityPhotoColumn = () => ({
    field: "activityPhoto",
    headerText: "Activity Photo",
    width: "150",
    textAlign: "Center",
    template: (rowData) => {
      if (!rowData.activityPhoto || rowData.activityPhoto === "-") {
        return <div>-</div>;
      }

      return (
        <button
          onClick={() => {
            setSelectedAttendance(rowData);
            setShowViewModal(true);
          }}
          className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Lihat Presensi
        </button>
      );
    },
  });

  // Buat komponen ViewAttendanceModal
  const ViewAttendanceModal = ({ showModal, setShowModal, attendanceData }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-auto my-8 h-auto max-h-[90vh] flex flex-col">
        <div className="px-4 sm:px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-bold">Detail Presensi</h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-gray-700 text-2xl focus:outline-none"
          >
            ×
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-grow">
          {/* Info Section */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-700">Informasi Jadwal</h3>
              <div className="mt-2 space-y-2">
                <p>
                  <span className="text-gray-600">Tanggal:</span>{" "}
                  {attendanceData.date}
                </p>
                <p>
                  <span className="text-gray-600">Waktu:</span>{" "}
                  {attendanceData.time}
                </p>
                <p>
                  <span className="text-gray-600">Ruangan:</span>{" "}
                  {attendanceData.room}
                </p>
                <p>
                  <span className="text-gray-600">Pengajar:</span>{" "}
                  {attendanceData?.teacher_id?.name}
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Status Presensi</h3>
              <div className="mt-2">
                <div
                  className={`inline-block px-3 py-1 rounded-full text-sm
                ${
                  attendanceData.attendanceStatus === "Success"
                    ? "bg-green-100 text-green-800"
                    : attendanceData.attendanceStatus === "Belum Berlangsung"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
                >
                  {attendanceData.attendanceStatus}
                </div>
              </div>
            </div>
          </div>

          {/* Note Section */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Catatan</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              {attendanceData.note || "-"}
            </div>
          </div>

          {/* Photo Section */}
          {attendanceData.activityPhoto &&
            attendanceData.activityPhoto !== "-" && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Foto Aktivitas
                </h3>
                <div className="relative">
                  <img
                    src={attendanceData.activityPhoto}
                    alt="Activity"
                    className="rounded-lg w-full max-h-[400px] object-contain bg-gray-100"
                  />
                  <a
                    href={attendanceData.activityPhoto}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 text-sm"
                  >
                    Buka Gambar
                  </a>
                </div>
              </div>
            )}
        </div>

        <div className="px-6 py-4 border-t flex justify-end">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );

  // Update studentColumns
  const studentColumns = [
    {
      field: "packageName",
      headerText: "Package Name",
      width: "200",
      textAlign: "Left",
    },
    {
      field: "teacherName",
      headerText: "Teacher",
      width: "150",
      textAlign: "Center",
    },
    {
      field: "date",
      headerText: "Date",
      width: "120",
      textAlign: "Center",
    },
    {
      field: "time",
      headerText: "Time",
      width: "100",
      textAlign: "Center",
    },
    {
      field: "room",
      headerText: "Room",
      width: "120",
      textAlign: "Center",
    },
    {
      field: "attendanceStatus",
      headerText: "Status",
      width: "150",
      textAlign: "Center",
      template: (rowData) => (
        <div
          className={`px-2 py-1 rounded text-center ${
            rowData.attendanceStatus === "Success"
              ? "bg-green-100 text-green-800"
              : rowData.attendanceStatus === "Belum Berlangsung"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {rowData.attendanceStatus}
        </div>
      ),
    },
    {
      field: "transportFee",
      headerText: "Transport Fee",
      width: "150",
      textAlign: "Right",
      template: (rowData) => (
        <div>Rp {rowData.transportFee.toLocaleString()}</div>
      ),
    },
    {
      field: "teacherFee",
      headerText: "Teacher Fee",
      width: "150",
      textAlign: "Right",
      template: (rowData) => (
        <div>Rp {rowData.teacherFee.toLocaleString()}</div>
      ),
    },
    {
      field: "note",
      headerText: "Note",
      width: "200",
      textAlign: "Left",
    },
    getActivityPhotoColumn(), // Gunakan fungsi untuk kolom activity photo
    getActionColumn(),
  ];

  // Update teacherColumns dengan cara yang sama
  const teacherColumns = [
    {
      field: "studentName",
      headerText: "Student Name",
      width: "150",
      textAlign: "Center",
    },
    {
      field: "packageName",
      headerText: "Package",
      width: "200",
      textAlign: "Left",
    },
    {
      field: "date",
      headerText: "Date",
      width: "120",
      textAlign: "Center",
    },
    {
      field: "time",
      headerText: "Time",
      width: "100",
      textAlign: "Center",
    },
    {
      field: "room",
      headerText: "Room",
      width: "120",
      textAlign: "Center",
    },
    {
      field: "attendanceStatus",
      headerText: "Status",
      width: "150",
      textAlign: "Center",
      template: (rowData) => (
        <div
          className={`px-2 py-1 rounded text-center ${
            rowData.attendanceStatus === "Success"
              ? "bg-green-100 text-green-800"
              : rowData.attendanceStatus === "Belum Berlangsung"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {rowData.attendanceStatus}
        </div>
      ),
    },
    {
      field: "transportFee",
      headerText: "Transport Fee",
      width: "150",
      textAlign: "Right",
      template: (rowData) => (
        <div>Rp {rowData.transportFee.toLocaleString()}</div>
      ),
    },
    {
      field: "teacherFee",
      headerText: "Teacher Fee",
      width: "150",
      textAlign: "Right",
      template: (rowData) => (
        <div>Rp {rowData.teacherFee.toLocaleString()}</div>
      ),
    },
    {
      field: "note",
      headerText: "Note",
      width: "200",
      textAlign: "Left",
    },
    getActivityPhotoColumn(), // Gunakan fungsi yang sama untuk kolom activity photo
    getActionColumn(),
  ];

  // UI Components
  const renderViewSelector = () => {
    if (!isAdmin) return null;

    return (
      <div className="mb-6 flex items-center gap-4">
        <select
          value={viewType}
          onChange={(e) => setViewType(e.target.value)}
          className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Schedules</option>
          <option value="student">Student View</option>
          <option value="teacher">Teacher View</option>
        </select>
        <span className="text-sm text-gray-600">
          {scheduleData.length} schedules found
        </span>
      </div>
    );
  };

  const renderError = () => {
    if (!error) return null;

    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  };

  // Choose columns based on view type
  const columns = isAdmin
    ? viewType === "student"
      ? studentColumns
      : teacherColumns
    : getUserRole() === "student"
    ? studentColumns
    : teacherColumns;

  // Authentication check
  if (!user || !localStorage.getItem("token")) {
    return (
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
        <div className="text-center">Please login to view your schedule</div>
      </div>
    );
  }

  // Main Render
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <div className="flex justify-between items-center mb-6">
        <Header
          category="Schedule Management"
          title={
            isAdmin
              ? "All Schedules"
              : `${
                  getUserRole() === "student" ? "Student" : "Teacher"
                } Schedule`
          }
        />
        {loading && (
          <div className="flex items-center text-blue-500">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-2" />
            Loading...
          </div>
        )}
      </div>

      {renderViewSelector()}
      {renderError()}

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          className="border p-2 rounded-lg w-1/3"
          placeholder={`Search ${
            isAdmin ? viewType : getUserRole()
          } schedule...`}
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
            onClick={() => alert("Add New Schedule")}
          >
            Add New
          </button>
        </div>
      </div>

      {showEditModal && (
        <EditAttendanceModal
          showModal={showEditModal}
          setShowModal={handleCloseModal}
          handleEditSubmit={handleEditSubmit}
          editData={editData}
          setEditData={setEditData}
          selectedSchedule={selectedSchedule}
          handleImageChange={handleImageChange}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          isSubmitting={isSubmitting}
        />
      )}

      {showViewModal && selectedAttendance && (
        <ViewAttendanceModal
          showModal={showViewModal}
          setShowModal={setShowViewModal}
          attendanceData={selectedAttendance}
        />
      )}

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <GridComponent
          dataSource={scheduleData}
          allowPaging
          pageSettings={{ pageSize: 10 }}
          toolbar={toolbarOptions}
          allowSorting
          editSettings={editing}
        >
          <ColumnsDirective>
            {columns.map((col, index) => (
              <ColumnDirective key={index} {...col} />
            ))}
          </ColumnsDirective>
          <Inject services={[Search, Toolbar, Edit, Page]} />
        </GridComponent>
      )}
    </div>
  );
};

export default Jadwal;
