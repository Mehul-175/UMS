import { Outlet, useNavigate } from "react-router-dom";
import { LogOut, User, Shield } from "lucide-react";
import { apiRequest } from "../api";

// We pass the 'user' prop from the protected route wrapper
export default function Layout({ user }) {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      // Assuming you have a logout endpoint, otherwise just clear storage/redirect
      await apiRequest("/auth/logout", { method: "POST" }); 
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
      navigate("/"); // Force navigation anyway
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            P
          </div>
          <span className="font-bold text-lg tracking-tight">Purple Merit</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col text-right">
            <span className="text-sm font-semibold text-gray-800">{user?.fullName || "User"}</span>
            <span className="text-xs text-gray-500 uppercase flex items-center justify-end gap-1">
              {user?.role === "admin" ? <Shield size={10} /> : <User size={10} />}
              {user?.role}
            </span>
          </div>
          
          <button 
            onClick={handleLogout}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}