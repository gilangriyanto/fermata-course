import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await api.post('/api/users/login', credentials);
      const userData = response.data;
      login(userData);
      
      switch (userData.role) {
        case 'admin':
          navigate('/dashboard');
          break;
        case 'teacher':
          navigate('/teacher-dashboard');
          break;
        case 'student':
          navigate('/student-dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5FF]">
      <div className="w-full max-w-6xl grid grid-cols-2 bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* Left side - Form */}
        <div className="p-12">
          <div className="mb-12">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-[#6366F1] rounded"></div>
              <span className="font-bold text-xl">Fermata Music Course</span>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-5xl font-bold mb-4">Get started</h1>
            <p className="text-gray-600">
              Already have an account?{" "}
              <a href="#" className="text-[#6366F1] font-semibold">
                Sign in
              </a>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#6366F1]"
                placeholder="Enter your email"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#6366F1]"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#6366F1] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#5457E5] transition-colors"
            >
              Sign in
            </button>
          </form>
        </div>

        {/* Right side - Illustration */}
        <div className="bg-[#6366F1] p-12 flex items-center justify-center relative">
          <div className="text-white text-center relative z-10">
            <h2 className="text-3xl font-bold mb-4">Welcome to the Fermata Music Course website</h2>
            <div className="flex justify-center gap-1 mt-4">
              <span className="h-2 w-2 rounded-full bg-white opacity-50"></span>
              <span className="h-2 w-2 rounded-full bg-white"></span>
              <span className="h-2 w-2 rounded-full bg-white opacity-50"></span>
            </div>
          </div>

          {/* Stars background */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5 + 0.25
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;