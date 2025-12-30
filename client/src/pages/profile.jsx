import { useEffect, useState } from "react";
import { apiRequest } from "../api";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    apiRequest("/user/me")
      .then((res) => setUser(res.user))
      .catch((err) => alert(err.message));
  }, []);

  if (!user) {
    return <div className="p-6">Loading profile...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-2">Profile</h1>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Status:</strong> {user.status}</p>
    </div>
  );
}
