import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiRequest } from "../api";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import { 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  XCircle, 
  AlertTriangle 
} from "lucide-react";

const PAGE_LIMIT = 10;

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState(""); // "activate" or "deactivate"

  const page = Math.max(Number(searchParams.get("page")) || 1, 1);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  async function fetchUsers() {
    try {
      setLoading(true);
      const res = await apiRequest(`/admin/users?page=${page}`);
      setUsers(res.users);
    } catch (err) {
      toast.error(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }

  // 1. Open Modal instead of acting immediately
  function initiateAction(user, action) {
    setSelectedUser(user);
    setActionType(action);
    setModalOpen(true);
  }

  // 2. Perform Action when confirmed in Modal
  async function confirmAction() {
    if (!selectedUser) return;

    try {
      const endpoint = `/admin/user/${selectedUser._id}/${actionType}`;
      await apiRequest(endpoint, { method: "PATCH" });

      toast.success(`User ${actionType}d successfully`);
      fetchUsers(); // Refresh list
    } catch (err) {
      toast.error(err.message || "Action failed");
    } finally {
      setModalOpen(false);
      setSelectedUser(null);
    }
  }

  const isLastPage = users.length < PAGE_LIMIT;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="text-indigo-600" />
            User Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage user access and account status.
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{u.fullName || u.fullname}</span>
                          <span className="text-xs text-gray-500">{u.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 capitalize text-gray-600">
                        {u.role}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                            ${u.status === "active" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                            }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {u.status === "active" ? (
                          <button
                            onClick={() => initiateAction(u, "deactivate")}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-red-200"
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            onClick={() => initiateAction(u, "activate")}
                            className="text-green-600 hover:text-green-800 hover:bg-green-50 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-green-200"
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
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
        <span className="text-sm text-gray-600">
          Page <span className="font-semibold text-gray-900">{page}</span>
        </span>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setSearchParams({ page: Math.max(page - 1, 1) })}
            className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} /> Previous
          </button>

          <button
            disabled={isLastPage}
            onClick={() => setSearchParams({ page: page + 1 })}
            className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Confirmation Modal (Required) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4 text-amber-600">
              <AlertTriangle size={24} />
              <h3 className="text-lg font-bold text-gray-900">Confirm Action</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to <strong>{actionType}</strong> the user <br/>
              <span className="font-semibold text-gray-900">{selectedUser?.email}</span>?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors ${
                  actionType === "deactivate" 
                    ? "bg-red-600 hover:bg-red-700" 
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                Yes, {actionType}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}