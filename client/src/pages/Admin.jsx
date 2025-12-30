import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiRequest, logoutRequest } from "../api";

const PAGE_LIMIT = 10;

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(Number(searchParams.get("page")) || 1, 1);

  useEffect(() => {
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

    fetchUsers();
  }, [page]);

  async function toggleStatus(id, status) {
    try {
      await apiRequest(`/admin/user/${id}/${status}`, {
        method: "PATCH",
      });

      // Refresh current page
      const res = await apiRequest(`/admin/users?page=${page}`);
      setUsers(res.users);
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

  const isLastPage = users.length < PAGE_LIMIT;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>

        <div className="flex gap-3">
          <button
            className="border px-3 py-1"
            onClick={() => (window.location.href = "/profile")}
          >
            Go to Profile
          </button>

          <button
            className="border px-3 py-1"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="border rounded">
        {loading ? (
          <p className="p-4">Loading users...</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-center">Status</th>
                <th className="p-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="border-t">
                    <td className="p-2">{u.email}</td>
                    <td className="p-2 text-center capitalize">{u.status}</td>
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
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center">
        <span className="text-sm text-gray-600">
          Page <strong>{page}</strong>
        </span>

        <div className="flex gap-3">
          <button
            disabled={page === 1}
            onClick={() =>
              setSearchParams({ page: Math.max(page - 1, 1) })
            }
            className={`border px-3 py-1 ${
              page === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Prev
          </button>

          <button
            disabled={isLastPage}
            onClick={() =>
              setSearchParams({ page: page + 1 })
            }
            className={`border px-3 py-1 ${
              isLastPage ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
