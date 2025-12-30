import { useEffect, useState } from "react";
import { apiRequest, logoutRequest } from "../api";

export default function Profile() {
  const [user, setUser] = useState(null);

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

  if (!user) {
    return <div className="p-6">Loading profile...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Profile</h1>
        <button
          className="border px-3 py-1"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Status:</strong> {user.status}</p>
    </div>
  );
}
