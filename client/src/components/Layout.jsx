import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, User, Shield, LayoutDashboard } from "lucide-react";
import { apiRequest } from "../api";

export default function Layout({ user }) {
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout() {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
      navigate("/");
    }
  }

  const displayName = user?.fullname || user?.fullName || "User";

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center sticky top-0 z-50">
        
        {/* Left: Logo & Title */}
        <Link to={user?.role === "admin" ? "/admin" : "/profile"} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            U
          </div>
          <span className="font-bold text-lg tracking-tight hidden sm:block">User Management System</span>
        </Link>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-6">
          
          {/* Admin Dashboard Link (Only visible to Admins) */}
          {user?.role === "admin" && (
            <Link 
              to="/admin" 
              className={`flex items-center gap-2 text-sm font-medium transition-colors
                ${location.pathname === "/admin" ? "text-indigo-600" : "text-gray-500 hover:text-gray-900"}
              `}
            >
              <LayoutDashboard size={18} />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          )}

          {/* User Profile Link (Clickable Name) */}
          <Link 
            to="/profile"
            className="flex items-center gap-3 hover:bg-gray-50 p-1.5 pr-3 rounded-lg transition-colors border border-transparent hover:border-gray-200"
          >
            <div className="flex flex-col text-right">
              <span className="text-sm font-semibold text-gray-800 leading-tight">{displayName}</span>
              <span className="text-[10px] text-gray-500 uppercase flex items-center justify-end gap-1">
                {user?.role === "admin" ? <Shield size={10} /> : <User size={10} />}
                {user?.role}
              </span>
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
              <User size={18} />
            </div>
          </Link>
          
          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
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