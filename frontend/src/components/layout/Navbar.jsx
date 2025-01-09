import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import useStore from "../../store/store";

function Navbar() {
  const { isAuthenticated, logout, user } = useStore();
  const navigate = useNavigate();

  console.log(
    "Navbar render - isAuthenticated:",
    isAuthenticated,
    "user:",
    user
  ); // Added console log

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.log("Error on logout", error);
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b">
      <div className="flex items-center">
        <Link to="/" className="font-bold text-2xl text-gray-800 mr-6">
          TET TTS
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard">
              <Button variant="white" size="small">
                Dashboard
              </Button>
            </Link>
            <Button variant="secondary" size="small" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <Button variant="secondary" size="small">
            Login
          </Button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
