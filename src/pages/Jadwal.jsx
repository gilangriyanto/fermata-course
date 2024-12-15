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

const Jadwal = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);

  const toolbarOptions = ["Search"];

  const editing = {
    allowDeleting: true,
    allowEditing: true,
    allowAdding: false,
  };

  // Transform the nested data into a flat structure for the grid
  const transformScheduleData = (rawData) => {
    const flattenedData = [];

    rawData.forEach((packageItem) => {
      packageItem.schedules.forEach((schedule) => {
        // Format date without date-fns
        const date = new Date(schedule.date);
        const formattedDate = date.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

        flattenedData.push({
          packageName: packageItem.package_id.name,
          packageDescription: packageItem.package_id.description,
          teacherName: schedule.teacher_id.name,
          date: formattedDate,
          time: schedule.time,
          transportFee: schedule.transport_fee,
          teacherFee: schedule.teacher_fee,
          room: schedule.room,
          attendanceStatus: schedule.attendance_status,
          note: schedule.note || "-",
          activityPhoto: schedule.activity_photo || "-",
          id: schedule._id,
        });
      });
    });

    return flattenedData;
  };

  // Fetch data function
  const fetchScheduleData = async () => {
    try {
      const response = await axios.get(
        "/api/student-packages/schedules/student"
      );
      if (response.data.success) {
        const transformedData = transformScheduleData(response.data.data);
        setScheduleData(transformedData);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
      } else if (error.request) {
        console.error("Error request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchScheduleData();
  }, []);

  // CRUD operations
  const handleAdd = async (newData) => {
    try {
      const response = await axios.post(
        "/api/student-packages/schedules/student",
        newData
      );
      if (response.data.success) {
        fetchScheduleData(); // Refresh data after successful addition
      }
    } catch (error) {
      console.error("Error adding schedule:", error);
    }
  };

  const handleEdit = async (id, updatedData) => {
    try {
      const response = await axios.put(
        `/api/student-packages/schedules/student/${id}`,
        updatedData
      );
      if (response.data.success) {
        fetchScheduleData(); // Refresh data after successful edit
      }
    } catch (error) {
      console.error("Error updating schedule:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `/api/student-packages/schedules/student/${id}`
      );
      if (response.data.success) {
        fetchScheduleData(); // Refresh data after successful deletion
      }
    } catch (error) {
      console.error("Error deleting schedule:", error);
    }
  };

  const scheduleColumns = [
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
      field: "id",
      headerText: "Actions",
      textAlign: "Center",
      width: "150",
      template: (rowData) => (
        <div className="flex justify-center gap-2">
          <button
            className="text-white bg-blue-500 px-2 py-1 rounded"
            onClick={() => handleEdit(rowData.id, rowData)}
          >
            Edit
          </button>
          <button
            className="text-white bg-red-500 px-2 py-1 rounded"
            onClick={() => handleDelete(rowData.id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Schedule" />
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          className="border p-2 rounded-lg w-1/3"
          placeholder="Search..."
        />
        <div className="flex gap-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={() => alert("Generate Report")}
          >
            Report
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
            onClick={() => handleAdd({})}
          >
            Add New
          </button>
        </div>
      </div>
      {loading ? (
        <div className="text-center">Loading...</div>
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
            {scheduleColumns.map((col, index) => (
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
