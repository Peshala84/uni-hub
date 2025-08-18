import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContexts";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // or a spinner
  }

  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
