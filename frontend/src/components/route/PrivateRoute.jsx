// client/src/components/route/PrivateRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useStore from "../../store/store";

function PrivateRoute({ children }) {
  const { isAuthenticated, user } = useStore();
  console.log("PrivateRoute - isAuthenticated:", isAuthenticated, "user", user);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;
