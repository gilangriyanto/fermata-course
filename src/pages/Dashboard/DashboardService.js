// src/pages/Dashboard/DashboardService.js
import api from "../../api/axios";

const DashboardService = {
  // Mengambil jumlah total siswa
  getStudentsCount: async () => {
    try {
      const response = await api.get("/api/packages");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mengambil jumlah total guru
  getTeachersCount: async () => {
    try {
      const response = await api.get("/api/dashboard/teachers-count");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mengambil total kelas aktif
  getActiveClassesCount: async () => {
    try {
      const response = await api.get("/api/dashboard/active-classes");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mengambil data presensi hari ini
  getTodayAttendance: async () => {
    try {
      const response = await api.get("/api/dashboard/today-attendance");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default DashboardService;
