import React, { useEffect, useState } from "react";
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

const DataSiswa = () => {
  const [studentsData, setStudentsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Untuk fitur pencarian
  const editing = { allowDeleting: true, allowEditing: true };

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.example.com/students"); // Ganti dengan URL API Anda
        const data = await response.json();
        setStudentsData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Filter data berdasarkan search term
  const filteredData = studentsData.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Define columns to match the wireframe
  const studentGrid = [
    { field: "id", headerText: "No.", width: "50", textAlign: "Center" },
    { field: "studentId", headerText: "Kd Murid", width: "100", textAlign: "Center" },
    { field: "name", headerText: "Nama Pendek", width: "150", textAlign: "Center" },
    { field: "instrument", headerText: "Instrumen", width: "150", textAlign: "Center" },
    { field: "targetLessons", headerText: "Target Les", width: "100", textAlign: "Center" },
    { field: "remainingLessons", headerText: "Sisa Target", width: "100", textAlign: "Center" },
    { field: "phone", headerText: "No. Telepon", width: "150", textAlign: "Center" },
    { field: "actions", headerText: "Aksi", width: "150", textAlign: "Center", template: (data) => (
        <div>
          <button className="text-blue-500 hover:underline">Edit</button> /{" "}
          <button className="text-red-500 hover:underline">Hapus</button>
        </div>
      ) },
  ];

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Data Siswa" />

      {/* Bagian fitur di atas tabel */}
      <div className="flex justify-between items-center mb-5">
        {/* Fitur Search */}
        <input
          type="text"
          placeholder="Cari..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
        />

        {/* Tombol Report dan Tambah */}
        <div className="flex space-x-3">
          <button
            onClick={() => alert("Report di-generate!")} // Placeholder untuk fitur report
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
          >
            Report
          </button>
          <button
            onClick={() => alert("Form tambah data dibuka!")} // Placeholder untuk form tambah
            className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600"
          >
            Tambah
          </button>
        </div>
      </div>

      {/* Tabel Data Siswa */}
      <GridComponent
        id="gridcomp"
        dataSource={filteredData} // Menggunakan data yang sudah difilter
        allowPaging
        allowSorting
        allowExcelExport
        allowPdfExport
        editSettings={editing}
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
