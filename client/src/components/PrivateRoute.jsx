import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();

  //   If user is not logged in, navigate to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  //   If route is requesting user to be an admin
  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/notes" replace />;
  }

  return children;
};

export default PrivateRoute;
