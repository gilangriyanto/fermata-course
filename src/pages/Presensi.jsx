import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Inject,
  Search,
  Toolbar,
  Page,
} from "@syncfusion/ej2-react-grids";
import { Header } from "../components";
import { useAuth } from "../contexts/AuthContext";

// Modal untuk menampilkan detail presensi
const DetailPresensiModal = ({ showModal, setShowModal, presensiData }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
    <div className="bg-white rounded-lg w-full max-w-3xl">
      <div className="px-6 py-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold">Detail Presensi</h2>
        <button
          onClick={() => setShowModal(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-4">Informasi Siswa & Guru</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Siswa:</span>{" "}
                {presensiData.studentName}
              </p>
              <p>
                <span className="font-medium">Guru:</span>{" "}
                {presensiData.teacherName}
              </p>
              <p>
                <span className="font-medium">Paket:</span>{" "}
                {presensiData.packageName}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Informasi Jadwal</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Tanggal:</span>{" "}
                {presensiData.date}
              </p>
              <p>
                <span className="font-medium">Waktu:</span> {presensiData.time}
              </p>
              <p>
                <span className="font-medium">Ruangan:</span>{" "}
                {presensiData.room}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Status Presensi</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="font-medium mr-2">Status:</span>
                <span
                  className={`px-2 py-1 rounded text-sm
                    ${
                      presensiData.attendanceStatus === "Success"
                        ? "bg-green-100 text-green-800"
                        : presensiData.attendanceStatus === "Belum Berlangsung"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                >
                  {presensiData.attendanceStatus}
                </span>
              </div>
              <p>
                <span className="font-medium">Catatan:</span>{" "}
                {presensiData.note}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Foto Aktivitas</h3>
            {presensiData.activityPhoto &&
            presensiData.activityPhoto !== "-" ? (
              <img
                src={presensiData.activityPhoto}
                alt="Foto Aktivitas"
                className="w-full h-40 object-cover rounded"
              />
            ) : (
              <div className="w-full h-40 bg-gray-100 rounded flex items-center justify-center text-gray-500">
                Tidak ada foto
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 border-t pt-4">
          <h3 className="font-semibold mb-4">Informasi Biaya</h3>
          <div className="grid grid-cols-2 gap-4">
            <p>
              <span className="font-medium">Biaya Transport:</span> Rp{" "}
              {presensiData.transportFee?.toLocaleString("id-ID")}
            </p>
            <p>
              <span className="font-medium">Biaya Guru:</span> Rp{" "}
              {presensiData.teacherFee?.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Presensi = () => {
  const [presensiData, setPresensiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [viewType, setViewType] = useState("student");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPresensi, setSelectedPresensi] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const getUserRole = () => {
    return user?.role || "student";
  };

  const isAdmin = getUserRole() === "admin";
  const toolbarOptions = ["Search"];

  // Transform presensi data
  const transformPresensiData = (rawData, viewAs = viewType) => {
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
            studentName: packageItem.student_id?.name || "N/A",
            packageName: packageItem.package_id?.name || "N/A",
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
        teacherName: schedule?.teacher_id?.name || "N/A",
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

  // Fetch data
  const fetchPresensiData = async () => {
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
        let transformedData = transformPresensiData(response.data.data);

        // Filter berdasarkan status jika dipilih
        if (filterStatus !== "all") {
          transformedData = transformedData.filter(
            (item) => item.attendanceStatus === filterStatus
          );
        }

        setPresensiData(transformedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPresensiData();
    }
  }, [user, viewType, filterStatus]);

  const handleDetailClick = (data) => {
    setSelectedPresensi(data);
    setShowDetailModal(true);
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
          Student Attendance
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            viewType === "teacher"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setViewType("teacher")}
        >
          Teacher Attendance
        </button>
      </div>
    );
  };

  // Definisi kolom
  const columns = [
    {
      field: "studentName",
      headerText: "Nama Siswa",
      width: "150",
      textAlign: "Left",
    },
    {
      field: "teacherName",
      headerText: "Nama Guru",
      width: "150",
      textAlign: "Left",
    },
    {
      field: "packageName",
      headerText: "Paket",
      width: "150",
      textAlign: "Left",
    },
    {
      field: "date",
      headerText: "Tanggal",
      width: "120",
      textAlign: "Center",
    },
    {
      field: "time",
      headerText: "Waktu",
      width: "100",
      textAlign: "Center",
    },
    {
      field: "attendanceStatus",
      headerText: "Status",
      width: "130",
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
      headerText: "Action",
      width: "120",
      textAlign: "Center",
      template: (rowData) => (
        <button
          onClick={() => handleDetailClick(rowData)}
          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Detail
        </button>
      ),
    },
  ];

  if (!user || !localStorage.getItem("token")) {
    return (
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
        <div className="text-center">
          Please login to view attendance records
        </div>
      </div>
    );
  }

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header
        category="Page"
        title={
          isAdmin
            ? "Presensi"
            : `${getUserRole() === "student" ? "Student" : "Teacher"} Presensi`
        }
      />

      {renderAdminToggle()}

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border p-2 rounded-lg"
          >
            <option value="all">Semua Status</option>
            <option value="Success">Success</option>
            <option value="Belum Berlangsung">Belum Berlangsung</option>
          </select>
        </div>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={() => alert("Generate Report")}
        >
          Report
        </button>
      </div>

      {showDetailModal && selectedPresensi && (
        <DetailPresensiModal
          showModal={showDetailModal}
          setShowModal={setShowDetailModal}
          presensiData={selectedPresensi}
        />
      )}

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <GridComponent
          dataSource={presensiData}
          allowPaging
          pageSettings={{ pageSize: 10 }}
          toolbar={toolbarOptions}
          allowSorting
        >
          <ColumnsDirective>
            {columns.map((col, index) => (
              <ColumnDirective key={index} {...col} />
            ))}
          </ColumnsDirective>
          <Inject services={[Search, Toolbar, Page]} />
        </GridComponent>
      )}
    </div>
  );
};

export default Presensi;
