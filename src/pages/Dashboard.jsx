import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from '../api/axios';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/statistics', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setStats(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="m-4 p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-4 p-8">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="dashboard p-6 space-y-6">
      {/* Summary Cards Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-blue-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-bold text-blue-800">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
          <div className="mt-2 text-sm text-blue-600">
            Active members in our system
          </div>
        </div>
        
        <div className="card bg-green-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-bold text-green-800">Active Packages</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalActivePackages}</p>
          <div className="mt-2 text-sm text-green-600">
            Currently running packages
          </div>
        </div>
        
        <div className="card bg-yellow-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-bold text-yellow-800">Total Revenue</h3>
          <p className="text-3xl font-bold text-yellow-600">
            Rp {stats.totalRevenue.toLocaleString()}
          </p>
          <div className="mt-2 text-sm text-yellow-600">
            Overall revenue generated
          </div>
        </div>
        
        <div className="card bg-purple-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-bold text-purple-800">Success Classes</h3>
          <p className="text-3xl font-bold text-purple-600">
            {stats.scheduleStatusCount.find(s => s._id === 'Success')?.count || 0}
          </p>
          <div className="mt-2 text-sm text-purple-600">
            Completed class sessions
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Distribution Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-4">User Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.usersByRole}
                  dataKey="count"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {stats.usersByRole.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Status Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-4">Payment Status</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.paymentStatusCount}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Active Packages Table */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-bold mb-4">Active Packages</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sessions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Instrument</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.activePackages.map((pkg) => (
                <tr key={pkg._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{pkg.name}</td>
                  <td className="px-6 py-4">{pkg.description}</td>
                  <td className="px-6 py-4">Rp {pkg.price.toLocaleString()}</td>
                  <td className="px-6 py-4">{pkg.sessionCount}</td>
                  <td className="px-6 py-4">{pkg.instrument}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Latest Payments Table */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-bold mb-4">Latest Payments</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Package</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.latestPayments.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{payment.student_id.name}</td>
                  <td className="px-6 py-4">{payment.package_id?.name || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${payment.payment_status === 'Lunas' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {payment.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4">Rp {payment.payment_total.toLocaleString()}</td>
                  <td className="px-6 py-4">{new Date(payment.payment_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* // Tambahkan setelah Latest Payments Table */}
      {/* Schedule Status Chart */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-bold mb-4">Class Schedule Status</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.scheduleStatusCount}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="count" 
                fill="#8884d8"
                name="Number of Classes"
              >
                {stats.scheduleStatusCount.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={
                      entry._id === "Success" ? "#10B981" :
                      entry._id === "Belum Berlangsung" ? "#FBBF24" :
                      "#9CA3AF"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Latest Users Table */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-bold mb-4">Latest Users</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.latestUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${user.user_type.role === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : user.user_type.role === 'teacher'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'}`}>
                      {user.user_type.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(user.createdAt).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Summary Cards for Schedule Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {stats.scheduleStatusCount.map((status) => (
          <div key={status._id || 'pending'} 
              className={`p-6 rounded-lg shadow-lg
              ${status._id === "Success" ? 'bg-green-100' :
                status._id === "Belum Berlangsung" ? 'bg-yellow-100' :
                'bg-gray-100'}`}>
            <h3 className="text-lg font-bold mb-2">
              {status._id || 'Pending'} Classes
            </h3>
            <p className="text-3xl font-bold">
              {status.count}
            </p>
            <p className="text-sm mt-2">
              Total classes with {status._id?.toLowerCase() || 'pending'} status
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;