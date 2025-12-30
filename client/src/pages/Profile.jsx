import { useEffect, useState } from "react";
import { 
  apiRequest, 
  updateProfileRequest, 
  changePasswordRequest 
} from "../api";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
// FIX: Added 'Lock' to the imports below
import { User, Mail, Shield, Key, Save, Lock } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [newFullName, setNewFullName] = useState("");
  
  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const res = await apiRequest("/user/me");
      setUser(res.user);
      // Handle both backend casing conventions (fullname vs fullName)
      setNewFullName(res.user.fullname || res.user.fullName); 
    } catch (err) {
      console.error(err);
      toast.error("Failed to load profile");
    }
  }

async function handleUpdateProfile() {
    if (!newFullName) {
      toast.error("Name cannot be empty");
      return;
    }

    try {
      setLoading(true);
      await updateProfileRequest(newFullName);
      
      toast.success("Profile updated successfully");
      
      // FIX: Force a reload after 1 second so the Navbar updates too
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleChangePassword() {
    if (!currentPassword || !newPassword) {
      toast.error("Both password fields are required");
      return;
    }

    try {
      setPassLoading(true);
      await changePasswordRequest(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      toast.success("Password changed successfully");
    } catch (err) {
      toast.error(err.message || "Failed to change password");
    } finally {
      setPassLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>

      {/* Grid Layout: Identity on Left, Security on Right (Desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN: Profile Details */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
              <User size={32} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user.fullname || user.fullName}</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 uppercase">
                {user.role}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Read-Only Email */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">EMAIL ADDRESS</label>
              <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-200 text-gray-500 cursor-not-allowed">
                <Mail size={16} />
                <span>{user.email}</span>
              </div>
            </div>

            {/* Editable Name */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">FULL NAME</label>
              <input
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
              />
            </div>

            <button
              onClick={handleUpdateProfile}
              disabled={loading}
              className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium p-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
            >
              {loading ? <Spinner /> : <><Save size={18} /> Save Changes</>}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Security */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6 text-gray-900">
            <Shield size={24} className="text-indigo-600" />
            <h2 className="text-lg font-semibold">Security & Password</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">CURRENT PASSWORD</label>
              <div className="relative">
                <Key className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  className="pl-9 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">NEW PASSWORD</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  className="pl-9 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={handleChangePassword}
              disabled={passLoading}
              className="w-full mt-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium p-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
            >
              {passLoading ? <Spinner /> : "Update Password"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}