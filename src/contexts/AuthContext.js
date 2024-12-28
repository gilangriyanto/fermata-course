import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
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
    localStorage.setItem("token", userData.token);
    localStorage.setItem("role", userData.role);

    const userDataToStore = {
      name: userData.name,
      email: userData.email,
      _id: userData._id,
    };
    localStorage.setItem("userData", JSON.stringify(userDataToStore));
  };


  // const updateUser = (newUserData) => {
  //   setUser(prevUser => {
  //     const updatedUser = {
  //       ...prevUser,
  //       ...newUserData,
  //       teacher_data: {
  //         ...prevUser?.teacher_data,
  //         ...newUserData?.teacher_data
  //       }
  //     };

  const updateUser = (newUserData) => {
    setUser((prevUser) => {
      // Pastikan semua data yang diperlukan termasuk dalam update
      const updatedUser = {
        ...prevUser, // Pertahankan data yang ada seperti token
        ...newUserData,
        // Pastikan role tidak hilang
        role: prevUser.role,
        teacher_data: {
          ...prevUser?.teacher_data,
          ...newUserData?.teacher_data,
        },
      };

      // Update localStorage dengan data yang lebih lengkap
      const userDataToStore = {
        name: updatedUser.name,
        email: updatedUser.email,
        _id: updatedUser._id,
        role: updatedUser.role,
        avatar: updatedUser.avatar || updatedUser.cover_image, // Handle kedua kemungkinan nama field
        phone: updatedUser.phone,
        address: updatedUser.address,
        teacher_data: updatedUser.teacher_data,
      };
      localStorage.setItem("userData", JSON.stringify(userDataToStore));
      // Update localStorage
    // localStorage.setItem('user', JSON.stringify(userData));

      return updatedUser;
    });
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
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
