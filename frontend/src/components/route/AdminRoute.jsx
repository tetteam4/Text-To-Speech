// client/src/components/route/AdminRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useStore from "../../store/store";

function AdminRoute({ children }) {
  const { user } = useStore();
  console.log("AdminRoute user:", user);
  return user && user.role === "admin" ? <Outlet /> : <Navigate to="/login" />;
}

export default AdminRoute;
