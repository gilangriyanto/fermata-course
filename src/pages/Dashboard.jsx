import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [schedules, setSchedules] = useState([]);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsRes = await fetch('/api/students');
        const instrumentsRes = await fetch('/api/instruments');
        const teachersRes = await fetch('/api/teachers');
        const roomsRes = await fetch('/api/rooms');
        const schedulesRes = await fetch('/api/schedules');

        setStudents(await studentsRes.json());
        setInstruments(await instrumentsRes.json());
        setTeachers(await teachersRes.json());
        setRooms(await roomsRes.json());
        setSchedules(await schedulesRes.json());
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard p-6 space-y-6">
      {/* Section: Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-blue-100 p-4 rounded shadow">
          <h3 className="text-lg font-bold">Total Murid</h3>
          <p className="text-2xl">{students.length}</p>
        </div>
        <div className="card bg-green-100 p-4 rounded shadow">
          <h3 className="text-lg font-bold">Total Instrumen</h3>
          <p className="text-2xl">{instruments.length}</p>
        </div>
        <div className="card bg-yellow-100 p-4 rounded shadow">
          <h3 className="text-lg font-bold">Total Guru</h3>
          <p className="text-2xl">{teachers.length}</p>
        </div>
        <div className="card bg-red-100 p-4 rounded shadow">
          <h3 className="text-lg font-bold">Total Ruangan</h3>
          <p className="text-2xl">{rooms.length}</p>
        </div>
      </div>

      {/* Section: Schedules Table */}
      <div className="table-section bg-white p-4 rounded shadow">
        <h3 className="text-lg font-bold mb-4">Jadwal Kelas</h3>
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 p-2">No</th>
              <th className="border border-gray-200 p-2">Nama Murid</th>
              <th className="border border-gray-200 p-2">Instrumen</th>
              <th className="border border-gray-200 p-2">Guru</th>
              <th className="border border-gray-200 p-2">Ruangan</th>
              <th className="border border-gray-200 p-2">Waktu</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule, index) => (
              <tr key={index}>
                <td className="border border-gray-200 p-2 text-center">{index + 1}</td>
                <td className="border border-gray-200 p-2">{schedule.studentName}</td>
                <td className="border border-gray-200 p-2">{schedule.instrument}</td>
                <td className="border border-gray-200 p-2">{schedule.teacher}</td>
                <td className="border border-gray-200 p-2">{schedule.room}</td>
                <td className="border border-gray-200 p-2">{schedule.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;