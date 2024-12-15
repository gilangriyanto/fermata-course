import React, { useState, useEffect } from "react";
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

const DataGuru = () => {
  const [guruData, setGuruData] = useState([]);
  const [loading, setLoading] = useState(true);

  const toolbarOptions = ["Search"]; // Toolbar search

  const editing = {
    allowDeleting: true,
    allowEditing: true,
    allowAdding: false,
  };

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.example.com/guru"); // Ganti dengan endpoint API Anda
        const data = await response.json();
        setGuruData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Kolom untuk tabel
  const guruColumns = [
    {
      field: "kode_guru",
      headerText: "Kd Guru",
      width: "120",
      textAlign: "Center",
    },
    {
      field: "nama_guru",
      headerText: "Nama Pendek",
      width: "150",
      textAlign: "Center",
    },
    {
      field: "instrumen",
      headerText: "Instrumen",
      width: "150",
      textAlign: "Center",
    },
    {
      field: "username",
      headerText: "Username",
      width: "150",
      textAlign: "Center",
    },
    {
      field: "telepon",
      headerText: "No. Telepon",
      width: "150",
      textAlign: "Center",
    },
    {
      field: "id",
      headerText: "Aksi",
      textAlign: "Center",
      width: "150",
      template: (rowData) => (
        <div className="flex justify-center gap-2">
          <button
            className="text-white bg-blue-500 px-2 py-1 rounded"
            onClick={() => alert(`Edit ${rowData.kode_guru}`)}
          >
            Edit
          </button>
          <button
            className="text-white bg-red-500 px-2 py-1 rounded"
            onClick={() => alert(`Hapus ${rowData.kode_guru}`)}
          >
            Hapus
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Data Guru" />
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          className="border p-2 rounded-lg w-1/3"
          placeholder="Cari..."
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
            onClick={() => alert("Tambah Data Guru")}
          >
            Tambah
          </button>
        </div>
      </div>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <GridComponent
          dataSource={guruData}
          allowPaging
          pageSettings={{ pageSize: 5 }}
          toolbar={toolbarOptions}
          allowSorting
          editSettings={editing}
        >
          <ColumnsDirective>
            {guruColumns.map((col, index) => (
              <ColumnDirective key={index} {...col} />
            ))}
          </ColumnsDirective>
          <Inject services={[Search, Toolbar, Edit, Page]} />
        </GridComponent>
      )}
    </div>
  );
};

export default DataGuru;
