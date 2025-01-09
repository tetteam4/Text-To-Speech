// client/src/pages/AdminDashboard.jsx
import React, { useEffect } from "react";
import Layout from "../components/layout/Layout";
import useStore from "../store/store";
import Table from "../components/ui/Table";
import Button from "../components/ui/Button";

function AdminDashboard() {
  const { allUsers, fetchAllUsers, loading, error, updateUser, deleteUser } =
    useStore();
  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  const columns = [
    { label: "Username", key: "username" },
    { label: "Email", key: "email" },
    {
      label: "Role",
      key: "role",
      render: (role, row) => {
        return (
          <div className="flex items-center gap-2">
            <Button
              size="small"
              onClick={() => handleChangeRole(row._id, "user")}
              variant={role === "user" ? "primary" : "secondary"}
            >
              User
            </Button>
            <Button
              size="small"
              onClick={() => handleChangeRole(row._id, "admin")}
              variant={role === "admin" ? "primary" : "secondary"}
            >
              Admin
            </Button>
          </div>
        );
      },
    },
    {
      label: "Actions",
      key: "actions",
      render: (_, row) => (
        <Button
          size="small"
          variant="secondary"
          onClick={() => handleDelete(row._id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  const handleChangeRole = async (userId, role) => {
    try {
      await updateUser(userId, role);
    } catch (error) {
      console.log("Error updating user", error);
    }
  };
  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
    } catch (error) {
      console.log("Error deleting user", error);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Admin Dashboard
        </h2>
        <p className="text-gray-700 mb-4">
          Here you can manage all the application users.
        </p>
        {loading && <p>Loading Users...</p>}
        {error && <p>Error loading user</p>}
        {allUsers && (
          <Table
            columns={columns}
            data={allUsers}
            emptyMessage="No users found"
          />
        )}
      </div>
    </Layout>
  );
}

export default AdminDashboard;
