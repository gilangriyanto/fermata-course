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

// ViewDetailModal Component
const ViewDetailModal = ({ showModal, setShowModal, salaryData }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
    <div className="bg-white rounded-lg w-full max-w-4xl">
      <div className="px-6 py-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold">Detail Slip Gaji</h2>
        <button 
          onClick={() => setShowModal(false)}
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
      </div>

      <div className="px-6 py-4">
        {/* Header Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-600">Guru: <span className="font-semibold text-gray-800">{salaryData.teacher_id?.name || 'N/A'}</span></p>
            <p className="text-gray-600">Periode: <span className="font-semibold text-gray-800">{`${salaryData.month}/${salaryData.year}`}</span></p>
          </div>
          <div className="text-right">
            <p className="text-gray-600">Total Gaji: <span className="font-semibold text-gray-800">Rp {salaryData.total_salary?.toLocaleString()}</span></p>
          </div>
        </div>

        {/* Details Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-4 py-2 text-left">Siswa</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Instrumen</th>
                <th className="border border-gray-200 px-4 py-2 text-center">Tanggal</th>
                <th className="border border-gray-200 px-4 py-2 text-center">Ruangan</th>
                <th className="border border-gray-200 px-4 py-2 text-center">Status</th>
                <th className="border border-gray-200 px-4 py-2 text-right">Transport</th>
                <th className="border border-gray-200 px-4 py-2 text-right">Fee Kelas</th>
                <th className="border border-gray-200 px-4 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {salaryData.details.map((detail, index) => (
                <tr key={detail._id || index} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2">{detail.student_name}</td>
                  <td className="border border-gray-200 px-4 py-2">{detail.instrument}</td>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    {new Date(detail.date).toLocaleDateString("id-ID")}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center">{detail.room}</td>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    <span className={`inline-block px-2 py-1 rounded-full text-sm
                      ${detail.attendance_status === "Success"
                        ? "bg-green-100 text-green-800"
                        : detail.attendance_status === "Belum Berlangsung"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {detail.attendance_status || 'Belum Berlangsung'}
                    </span>
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-right">
                    Rp {detail.fee_transport?.toLocaleString()}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-right">
                    Rp {detail.fee_class?.toLocaleString()}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-right">
                    Rp {detail.total_fee?.toLocaleString()}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-semibold">
                <td colSpan="7" className="border border-gray-200 px-4 py-2 text-right">Total Gaji:</td>
                <td className="border border-gray-200 px-4 py-2 text-right">
                  Rp {salaryData.total_salary?.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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

const SalarySlip = () => {
  // State Management
  const [salaryData, setSalaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Auth Context
  const { user } = useAuth();

  // Grid Configuration
  const toolbarOptions = ["Search"];

  // Data Transformation
  const transformSalaryData = (rawData) => {
    return rawData.map((salary) => ({
      id: salary._id,
      teacherName: salary.teacher_id?.name || 'N/A',
      month: salary.month,
      year: salary.year,
      period: `${salary.month}/${salary.year}`,
      totalSalary: salary.total_salary,
      numberOfClasses: salary.details?.length || 0,
      details: salary.details,
      teacher_id: salary.teacher_id,
    }));
  };

  // Fetch Data
  const fetchSalaryData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/api/salary-slips', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        const transformedData = transformSalaryData(response.data.data);
        setSalaryData(transformedData);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch salary data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk mendownload slip gaji
  const handleDownloadSalary = async (teacherId, month, year, teacherName) => {
    try {
      setIsDownloading(true);
  
      const response = await axios.get(
        `/api/salary-slips/download/${teacherId}/${month}/${year}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          responseType: 'blob',
        }
      );
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Gunakan teacherName dalam nama file
      const filename = `slip_gaji_${teacherName}_${month}_${year}.pdf`;
      link.setAttribute('download', filename);
      
      document.body.appendChild(link);
      link.click();
      
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
  
      alert('File berhasil didownload!');
    } catch (error) {
      console.error('Error downloading salary slip:', error);
      alert(error.response?.data?.message || 'Gagal mengunduh slip gaji');
    } finally {
      setIsDownloading(false);
    }
  };
  

  useEffect(() => {
    if (user) {
      fetchSalaryData();
    }
  }, [user]);

  // Column Definitions
  const columns = [
    {
      field: "teacherName",
      headerText: "Nama Guru",
      width: "200",
      textAlign: "Left",
    },
    {
      field: "period",
      headerText: "Periode",
      width: "120",
      textAlign: "Center",
    },
    {
      field: "numberOfClasses",
      headerText: "Jumlah Kelas",
      width: "130",
      textAlign: "Center",
    },
    {
      field: "totalSalary",
      headerText: "Total Gaji",
      width: "150",
      textAlign: "Right",
      template: (rowData) => (
        <div>Rp {rowData.totalSalary.toLocaleString()}</div>
      ),
    },
    {
      field: "actions",
      headerText: "Actions",
      width: "200",
      textAlign: "Center",
      template: (rowData) => (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => {
              setSelectedSalary(rowData);
              setShowViewModal(true);
            }}
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Detail
          </button>
          <button
            onClick={() => handleDownloadSalary(
              rowData.teacher_id?._id,
              rowData.month,
              rowData.year,
              rowData.teacherName
            )}
            disabled={isDownloading}
            className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
          >
            {isDownloading ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download</span>
              </>
            )}
          </button>
        </div>
      ),
    },
  ];

  // Authentication check
  if (!user || !localStorage.getItem("token")) {
    return (
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
        <div className="text-center">Please login to view salary slips</div>
      </div>
    );
  }

  // Render
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <div className="flex justify-between items-center mb-6">
        <Header category="Finance" title="Slip Gaji" />
        {loading && (
          <div className="flex items-center text-blue-500">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-2" />
            Loading...
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <GridComponent
          dataSource={salaryData}
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

      {showViewModal && selectedSalary && (
        <ViewDetailModal
          showModal={showViewModal}
          setShowModal={setShowViewModal}
          salaryData={selectedSalary}
        />
      )}
    </div>
  );
};

export default SalarySlip;