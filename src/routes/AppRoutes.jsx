// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Lazy load components sesuai struktur folder Anda
const Login = React.lazy(() => import("../pages/Login")); // Lazy load halaman Login
const Profile = React.lazy(() => import("../components/Profile")); // Lazy load halaman Login
const Dashboard = React.lazy(() => import("../pages/Dashboard"));
const DataSiswa = React.lazy(() => import("../pages/DataSiswa"));
const DataGuru = React.lazy(() => import("../pages/DataGuru")); // Sesuaikan dengan nama file yang benar
const DataAdmin = React.lazy(() => import("../pages/DataAdmin")); // Sesuaikan dengan nama file yang benar
// const DataInstrument = React.lazy(() => import("../pages/DataInstrument")); // Sesuaikan dengan nama file yang benar
const Package = React.lazy(() => import("../pages/Package")); // Sesuaikan dengan nama file yang benar
const StudentPackage = React.lazy(() => import("../pages/StudentPackage")); // Sesuaikan dengan nama file yang benar
const Jadwal = React.lazy(() => import("../pages/Jadwal")); // Sesuaikan dengan nama file yang benar
const Presensi = React.lazy(() => import("../pages/Presensi")); // Sesuaikan dengan nama file yang benar

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
  </div>
);

const AppRoutes = () => {
  return (
    <React.Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/data-siswa"
          element={
            <ProtectedRoute allowedRoles={["admin", "teacher"]}>
              <DataSiswa />
            </ProtectedRoute>
          }
        />

        <Route
          path="/data-guru"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DataGuru />
            </ProtectedRoute>
          }
        />
        <Route
          path="/data-admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DataAdmin />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/data-instrument"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DataInstrument />
            </ProtectedRoute>
          }
        /> */}

        <Route
          path="/package"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Package />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-package"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <StudentPackage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jadwal"
          element={
            <ProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
              <Jadwal />
            </ProtectedRoute>
          }
        />

        <Route
          path="/presensi"
          element={
            <ProtectedRoute allowedRoles={["admin", "teacher"]}>
              <Presensi />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </React.Suspense>
  );
};

export default AppRoutes;
