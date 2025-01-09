// client/src/pages/Profile.jsx
import React, { useState } from "react";
import UpgradeButton from "../components/ui/UpgradeButton";
import CreditUse from "../components/ui/CreditUse";
import useStore from "../store/store";
import Button from "../components/ui/Button";

function Profile() {
  const { user, loading, error, setError, logout, updateProfile } = useStore();
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        username,
        email,
        oldPassword,
        newPassword,
      });
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err.message);
    }
  };
  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.log("error on logout", err);
    }
  };
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Profile</h2>
        <Button variant="white" size="small">
          Refresh
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white p-6 rounded">
          <div className="flex items-center mb-4">
            <span className="h-16 w-16 bg-gray-300 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl font-semibold text-gray-700">
                {user?.username.charAt(0).toUpperCase()}
              </span>
            </span>
            <div className="flex flex-col">
              <span className="text-lg font-medium text-gray-700">
                {user?.username}
              </span>
              <span className="text-gray-500 text-xs">{user?.email}</span>
            </div>
          </div>
          <div className="mb-4">
            <Button size="small" variant="white">
              Free Plan
            </Button>
          </div>
          <UpgradeButton />
        </div>
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Personal Information
            </h3>
            <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="password"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex justify-end">
                <Button variant="primary" disabled={loading}>
                  {loading ? "Loading..." : "Save Changes"}
                </Button>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </form>
          </div>
          <div className="flex items-start gap-4">
            <CreditUse
              title="Credits Usage"
              current="319"
              max="20000"
              usagePercentage={20}
            />
            <CreditUse
              title="Clone Usage"
              current="0"
              max="500"
              usagePercentage={0}
            />
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-center">
        <Button variant="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
}

export default Profile;
