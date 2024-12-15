// src/pages/Dashboard/index.jsx
import React, { useState, useEffect } from 'react';
import DashboardService from './DashboardService';
import { FiUsers, FiBookOpen, FiCheckCircle } from 'react-icons/fi';
import { GiTeacher } from 'react-icons/gi';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    studentsCount: 0,
    teachersCount: 0,
    activeClasses: 0,
    todayAttendance: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [
          studentsCount,
          teachersCount,
          activeClasses,
          todayAttendance
        ] = await Promise.all([
          DashboardService.getStudentsCount(),
          DashboardService.getTeachersCount(),
          DashboardService.getActiveClassesCount(),
          DashboardService.getTodayAttendance()
        ]);

        setDashboardData({
          studentsCount: studentsCount.total,
          teachersCount: teachersCount.total,
          activeClasses: activeClasses.total,
          todayAttendance: todayAttendance.total
        });
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        {error}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Siswa',
      value: dashboardData.studentsCount,
      icon: <FiUsers className="h-8 w-8 text-blue-500" />,
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Guru',
      value: dashboardData.teachersCount,
      icon: <GiTeacher className="h-8 w-8 text-green-500" />,
      bgColor: 'bg-green-100'
    },
    {
      title: 'Kelas Aktif',
      value: dashboardData.activeClasses,
      icon: <FiBookOpen className="h-8 w-8 text-purple-500" />,
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Presensi Hari Ini',
      value: dashboardData.todayAttendance,
      icon: <FiCheckCircle className="h-8 w-8 text-yellow-500" />,
      bgColor: 'bg-yellow-100'
    }
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, index) => (
          <div 
            key={index}
            className={`${card.bgColor} rounded-lg p-4 shadow-sm`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">{card.title}</p>
                <h3 className="text-2xl font-bold mt-2">{card.value}</h3>
              </div>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Additional sections can be added here */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Aktivitas Terkini</h2>
          {/* Add recent activity content */}
          <p className="text-gray-600">Belum ada aktivitas terkini</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Jadwal Hari Ini</h2>
          {/* Add today's schedule content */}
          <p className="text-gray-600">Belum ada jadwal untuk hari ini</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;