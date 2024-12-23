// src/config/menuConfig.js
import {
  FiHome,
  FiUsers,
  FiBookOpen,
  FiClock,
  FiCheckSquare,
  FiDollarSign,
  FiMusic,
} from "react-icons/fi";

export const menuConfig = [
  {
    title: "Dashboard",
    links: [
      {
        name: "Dashboard",
        path: "dashboard",
        icon: <FiHome />,
        allowedRoles: ["admin", "teacher", "student"],
      },
    ],
  },
  {
    title: "Data Master",
    links: [
      {
        name: "Data Siswa",
        path: "data-siswa",
        icon: <FiUsers />,
        allowedRoles: ["admin", "teacher"],
      },
      {
        name: "Data Guru",
        path: "data-guru",
        icon: <FiUsers />,
        allowedRoles: ["admin"],
      },
      {
        name: "Data Instrument",
        path: "data-instrument",
        icon: <FiMusic />,
        allowedRoles: ["admin"],
      },
      {
        name: "Data Ruangan",
        path: "data-ruangan",
        icon: <FiBookOpen />,
        allowedRoles: ["admin"],
      },
      {
        name: "Data Admin",
        path: "data-admin",
        icon: <FiUsers />,
        allowedRoles: ["admin"],
      },
    ],
  },
  {
    title: "Pembelajaran",
    links: [
      {
        name: "Package",
        path: "package",
        icon: <FiClock />,
        allowedRoles: ["admin", "teacher", "student"],
      },
      {
        name: "Student Package",
        path: "student-package",
        icon: <FiClock />,
        allowedRoles: ["admin", "teacher", "student"],
      },
      {
        name: "Jadwal",
        path: "jadwal",
        icon: <FiClock />,
        allowedRoles: ["admin", "teacher", "student"],
      },
      {
        name: "Presensi",
        path: "presensi",
        icon: <FiCheckSquare />,
        allowedRoles: ["admin", "teacher"],
      },
    ],
  },
  {
    title: "Keuangan",
    links: [
      {
        name: "Pembayaran Les",
        path: "pembayaran-les",
        icon: <FiDollarSign />,
        allowedRoles: ["admin"],
      },
      {
        name: "Slip Gaji Guru",
        path: "slip-gaji-guru",
        icon: <FiDollarSign />,
        allowedRoles: ["admin", "teacher"],
      },
    ],
  },
];
