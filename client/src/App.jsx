import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

import LoaderOverlay from "./components/LoaderOverlay";
import { useAuth } from "./context/AuthContext";

import Admin from "./pages/Admin";
import Notes from "./pages/Notes";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  const { user, authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => (document.body.style.overflow = "");
  }, [authLoading]);

  if (authLoading) {
    return <LoaderOverlay />;
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/notes" /> : <Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/notes"
        element={
          <PrivateRoute>
            <Notes />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateRoute adminOnly={true}>
            <Admin />
          </PrivateRoute>
        }
      />
      <Route
        path="*"
        element={user ? <NotFound /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

export default App;
