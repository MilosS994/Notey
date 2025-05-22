import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";
import axiosInstance from "./utils/axiosInstance.js";
import API_PATHS from "./utils/apiPaths.js";

// Protect routes
const PrivateRoute = ({ user, children }) => {
  if (user === null) return null;
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  const [user, setUser] = useState(null);

  const getUser = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
      setUser(response.data);
    } catch (error) {
      setUser(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute user={user}>
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="*"
          element={
            user ? (
              <NotFound />
            ) : user === false ? (
              <Navigate to="/login" />
            ) : null
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
