import { useEffect, useState } from "react";
import { apiRequest, logoutRequest } from "../api";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  async function fetchUsers() {
    try {
      setLoading(true);
      const res = await apiRequest(`/admin/users?page=${page}`);
      setUsers(res.users);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [page]);

  async function toggleStatus(id, status) {
    try {
      await apiRequest(`/admin/user/${id}/${status}`, {
        method: "PATCH",
      });
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleLogout() {
    try {
      await logoutRequest();
      window.location.href = "/";
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        <button
          className="border px-3 py-1"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="border w-full text-sm">
          <thead>
            <tr className="border">
              <th className="p-2 text-left">Email</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border">
                <td className="p-2">{u.email}</td>
                <td className="p-2 text-center">{u.status}</td>
                <td className="p-2 text-center">
                  {u.status === "active" ? (
                    <button
                      className="text-red-600"
                      onClick={() => toggleStatus(u._id, "deactivate")}
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      className="text-green-600"
                      onClick={() => toggleStatus(u._id, "activate")}
                    >
                      Activate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-4 flex gap-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="border px-3 py-1"
        >
          Prev
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="border px-3 py-1"
        >
          Next
        </button>
      </div>
    </div>
  );
}
