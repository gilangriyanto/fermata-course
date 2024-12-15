import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Inisialisasi state dengan memeriksa localStorage untuk semua data user
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const userData = localStorage.getItem("userData");

    if (token && role && userData) {
      return {
        token,
        role,
        ...JSON.parse(userData),
      };
    }
    return null;
  });

  const login = (userData) => {
    setUser(userData);
    // Simpan token dan role seperti sebelumnya
    localStorage.setItem("token", userData.token);
    localStorage.setItem("role", userData.role);

    // Simpan data user lainnya
    const userDataToStore = {
      name: userData.name,
      email: userData.email,
      _id: userData._id,
    };
    localStorage.setItem("userData", JSON.stringify(userDataToStore));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userData");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const userData = localStorage.getItem("userData");

    if (token && role && userData && !user) {
      setUser({
        token,
        role,
        ...JSON.parse(userData),
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
