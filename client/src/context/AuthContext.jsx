import { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance.js";
import API_PATHS from "../utils/apiPaths.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setAuthLoading(true);
        const res = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
        setUser(res.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
