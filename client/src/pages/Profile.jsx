import { useEffect, useState } from "react";
import {
  apiRequest,
  logoutRequest,
  updateProfileRequest,
  changePasswordRequest,
} from "../api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [newFullName, setNewFullName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiRequest("/user/me")
      .then((res) => setUser(res.user))
      .catch((err) => alert(err.message));
  }, []);

  async function handleLogout() {
    try {
      await logoutRequest();
      window.location.href = "/";
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleUpdateProfile() {
    if (!newFullName) {
      alert("Please enter a new name");
      return;
    }

    try {
      setLoading(true);
      const res = await updateProfileRequest(newFullName);
      setUser(res.user);
      setNewFullName(""); // keep field empty after update
      alert("Profile updated successfully");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleChangePassword() {
    if (!currentPassword || !newPassword) {
      alert("All password fields are required");
      return;
    }

    try {
      setLoading(true);
      await changePasswordRequest(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      alert("Password updated successfully");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return <div className="p-6">Loading profile...</div>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Profile</h1>
        <button className="border px-3 py-1" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Profile Info */}
      <div className="border p-4 mb-6">
        <p><strong>Name:</strong> {user.fullname}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Status:</strong> {user.status}</p>

        {user.role === "admin" && (
          <button
            className="mt-3 border px-3 py-1"
            onClick={() => (window.location.href = "/admin")}
          >
            Go to Admin Dashboard
          </button>
        )}
      </div>

      {/* Update Profile */}
      <div className="border p-4 mb-6">
        <h2 className="font-semibold mb-3">Update Name</h2>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Enter new full name"
          value={newFullName}
          onChange={(e) => setNewFullName(e.target.value)}
        />

        <button
          className="border px-4 py-1"
          onClick={handleUpdateProfile}
          disabled={loading}
        >
          Update Profile
        </button>
      </div>

      {/* Change Password */}
      <div className="border p-4">
        <h2 className="font-semibold mb-3">Change Password</h2>

        <input
          className="border p-2 w-full mb-3"
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-3"
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button
          className="border px-4 py-1"
          onClick={handleChangePassword}
          disabled={loading}
        >
          Change Password
        </button>
      </div>
    </div>
  );
}
