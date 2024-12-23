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

// EditAttendanceModal Component yang diperbarui
const EditAttendanceModal = ({
  showModal,
  setShowModal,
  handleEditSubmit,
  editData,
  setEditData,
  selectedSchedule,
  handleImageChange, // Tambah prop untuk handle perubahan gambar
  imagePreview, // Tambah prop untuk preview gambar
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
    <div className="bg-white rounded-lg w-full max-w-lg">
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-bold">Edit Presensi</h2>
      </div>

      <form
        onSubmit={(e) =>
          handleEditSubmit(
            e,
            selectedSchedule.packageId,
            selectedSchedule.scheduleId
          )
        }
      >
        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status Presensi
            </label>
            <select
              name="attendance_status"
              value={editData.attendance_status}
              onChange={(e) =>
                setEditData({ ...editData, attendance_status: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Pilih Status</option>
              <option value="Success">Success</option>
              <option value="Belum Berlangsung">Belum Berlangsung</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Foto Aktivitas
            </label>
            <input
              type="file"
              name="activity_photo"
              onChange={handleImageChange}
              className="w-full p-2 border rounded"
              accept="image/*"
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-full h-40 object-cover rounded"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Catatan
            </label>
            <textarea
              name="note"
              value={editData.note}
              onChange={(e) =>
                setEditData({ ...editData, note: e.target.value })
              }
              className="w-full p-2 border rounded"
              rows="3"
              required
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  </div>
);

const Jadwal = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [viewType, setViewType] = useState("student");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editData, setEditData] = useState({
    attendance_status: "",
    activity_photo: "",
    note: "",
  });

  // Fungsi helper untuk mengecek role
  const getUserRole = () => {
    return user?.role || "student";
  };

  const isAdmin = getUserRole() === "admin";

  const toolbarOptions = ["Search"];
  const editing = {
    allowDeleting: true,
    allowEditing: true,
    allowAdding: false,
  };

  // // Fungsi untuk menangani edit presensi
  // const handleEditAttendance = (packageId, scheduleId) => {
  //   const schedule = scheduleData.find((item) => item.id === scheduleId);
  //   setSelectedSchedule({ packageId, scheduleId });
  //   setEditData({
  //     attendance_status: schedule.attendanceStatus,
  //     activity_photo: schedule.activityPhoto || "",
  //     note: schedule.note || "",
  //   });
  //   setShowEditModal(true);
  // };

  // Update fungsi handleEditAttendance
  const handleEditAttendance = (packageId, scheduleId) => {
    const schedule = scheduleData.find((item) => item.id === scheduleId);
    setSelectedSchedule({ packageId, scheduleId });
    setEditData({
      attendance_status: schedule.attendanceStatus,
      note: schedule.note || "",
    });
    // Set preview jika ada foto aktivitas sebelumnya
    if (schedule.activityPhoto && schedule.activityPhoto !== "-") {
      setImagePreview(schedule.activityPhoto);
    } else {
      setImagePreview(null);
    }
    setSelectedImage(null);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e, packageId, scheduleId) => {
    e.preventDefault();
    try {
      // Buat FormData untuk mengirim file
      const formData = new FormData();
      formData.append("attendance_status", editData.attendance_status);
      formData.append("note", editData.note);
      if (selectedImage) {
        formData.append("activity_photo", selectedImage);
      }

      const response = await axios.put(
        `/api/student-packages/${packageId}/schedules/${scheduleId}/attendance`,
        editData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setShowEditModal(false);
        setImagePreview(null);
        setSelectedImage(null);
        await fetchScheduleData();
        alert("Presensi berhasil diupdate!");
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
      alert("Terjadi kesalahan saat mengupdate presensi");
    }
  };

  // Handle perubahan file gambar
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Preview gambar
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setSelectedImage(file);
    }
  };

  // Transform schedule data sesuai dengan role/view
  const transformScheduleData = (rawData, viewAs = viewType) => {
    if (!rawData) return [];

    if (viewAs === "student") {
      const flattenedData = [];
      rawData.forEach((packageItem) => {
        if (!packageItem?.schedules) return;

        packageItem.schedules.forEach((schedule) => {
          if (!schedule) return;

          const date = new Date(schedule.date);
          const formattedDate = date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });

          flattenedData.push({
            packageId: packageItem._id,
            packageName: packageItem.package_id?.name || "N/A",
            packageDescription: packageItem.package_id?.description || "N/A",
            teacherName: schedule.teacher_id?.name || "N/A",
            date: formattedDate,
            time: schedule.time || "N/A",
            transportFee: schedule.transport_fee || 0,
            teacherFee: schedule.teacher_fee || 0,
            room: schedule.room || "N/A",
            attendanceStatus: schedule.attendance_status || "Belum Berlangsung",
            note: schedule.note || "-",
            activityPhoto: schedule.activity_photo || "-",
            id: schedule._id,
          });
        });
      });
      return flattenedData;
    } else {
      return rawData.map((schedule) => ({
        packageId: schedule?.package_id?._id,
        studentName: schedule?.student_id?.name || "N/A",
        packageName: schedule?.package_id?.name || "N/A",
        date: schedule?.date
          ? new Date(schedule.date).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "N/A",
        time: schedule?.time || "N/A",
        transportFee: schedule?.transport_fee || 0,
        teacherFee: schedule?.teacher_fee || 0,
        room: schedule?.room || "N/A",
        attendanceStatus: schedule?.attendance_status || "Belum Berlangsung",
        note: schedule?.note || "-",
        activityPhoto: schedule?.activity_photo || "-",
        id: schedule?._id,
      }));
    }
  };

  // Fetch data function
  const fetchScheduleData = async () => {
    try {
      setLoading(true);
      const endpoint = isAdmin
        ? viewType === "student"
          ? "/api/student-packages/schedules/student"
          : "/api/student-packages/schedules/teacher"
        : getUserRole() === "student"
        ? "/api/student-packages/schedules/student"
        : "/api/student-packages/schedules/teacher";

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        const transformedData = transformScheduleData(response.data.data);
        setScheduleData(transformedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchScheduleData();
    }
  }, [user, viewType]); // Refetch ketika view type berubah

  // CRUD operations dengan token
  const handleAdd = async (newData) => {
    try {
      const endpoint = isAdmin
        ? viewType === "student"
          ? "/api/student-packages/schedules/student"
          : "/api/student-packages/schedules/teacher"
        : getUserRole() === "student"
        ? "/api/student-packages/schedules/student"
        : "/api/student-packages/schedules/teacher";

      const response = await axios.post(endpoint, newData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        await fetchScheduleData();
      }
    } catch (error) {
      console.error("Error adding schedule:", error);
    }
  };

  const handleEdit = async (id, updatedData) => {
    try {
      const userRole = getUserRole();
      const endpoint =
        userRole === "student"
          ? `/api/student-packages/schedules/student/${id}`
          : `/api/student-packages/schedules/teacher/${id}`;

      const response = await axios.put(endpoint, updatedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        await fetchScheduleData();
      }
    } catch (error) {
      console.error("Error updating schedule:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const userRole = getUserRole();
      const endpoint =
        userRole === "student"
          ? `/api/student-packages/schedules/student/${id}`
          : `/api/student-packages/schedules/teacher/${id}`;

      const response = await axios.delete(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        await fetchScheduleData();
      }
    } catch (error) {
      console.error("Error deleting schedule:", error);
    }
  };

  // Render toggle view untuk admin
  const renderAdminToggle = () => {
    if (!isAdmin) return null;

    return (
      <div className="mb-4 flex space-x-2">
        <button
          className={`px-4 py-2 rounded-lg ${
            viewType === "student"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setViewType("student")}
        >
          Student Schedule
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            viewType === "teacher"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setViewType("teacher")}
        >
          Teacher Schedule
        </button>
      </div>
    );
  };

  const getActionColumn = () => ({
    field: "actions",
    headerText: "Actions",
    width: "120",
    textAlign: "Center",
    template: (rowData) => (
      <div className="flex justify-center">
        {(getUserRole() === "teacher" || getUserRole() === "admin") && (
          <button
            onClick={() => handleEditAttendance(rowData.packageId, rowData.id)}
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Edit Presensi
          </button>
        )}
      </div>
    ),
  });

  // Kolom untuk siswa dan guru
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
          className={`px-2 py-1 rounded text-center
          ${
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
    {
      field: "activityPhoto",
      headerText: "Activity Photo",
      width: "150",
      textAlign: "Center",
    },
    getActionColumn(),
  ];

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
          className={`px-2 py-1 rounded text-center
          ${
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
    {
      field: "activityPhoto",
      headerText: "Activity Photo",
      width: "150",
      textAlign: "Center",
    },
    getActionColumn(),
  ];

  // Pilih kolom berdasarkan view type untuk admin atau role untuk user biasa
  const columns = isAdmin
    ? viewType === "student"
      ? studentColumns
      : teacherColumns
    : getUserRole() === "student"
    ? studentColumns
    : teacherColumns;

  if (!user || !localStorage.getItem("token")) {
    return (
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
        <div className="text-center">Please login to view your schedule</div>
      </div>
    );
  }

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header
        category="Page"
        title={
          isAdmin
            ? "All Schedules"
            : `${getUserRole() === "student" ? "Student" : "Teacher"} Schedule`
        }
      />

      {/* Render toggle untuk admin */}
      {renderAdminToggle()}

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
            onClick={() => handleAdd({})}
          >
            Add New
          </button>
        </div>
      </div>

      {showEditModal && (
        <EditAttendanceModal
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          handleEditSubmit={handleEditSubmit}
          editData={editData}
          setEditData={setEditData}
          selectedSchedule={selectedSchedule}
          handleImageChange={handleImageChange}
          imagePreview={imagePreview}
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
