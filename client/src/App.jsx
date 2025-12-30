import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast"; // Notification system
import Login from "./pages/Login.jsx";
import Signup from "./pages/SignUp.jsx";
import Admin from "./pages/Admin.jsx";
import Profile from "./pages/Profile.jsx";
import Layout from "./components/Layout.jsx";
import { apiRequest } from "./api.js";

// Improved Auth Wrapper with Role Checking
function RequireAuth({ allowedRoles }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    apiRequest("/user/me")
      .then((data) => {
        setUser(data.user); // Assuming response is { user: { ... } }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  // 1. Not logged in
  if (!user) return <Navigate to="/" replace />;

  // 2. Logged in but wrong role (e.g., User trying to access Admin)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/profile" replace />;
  }

  // 3. Authorized - Render Layout with User data
  return (
    <Layout user={user}>
       <Outlet /> {/* This renders the child route (Admin or Profile) */}
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" /> {/* Global Toast Container */}
      
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Admin Route */}
        <Route element={<RequireAuth allowedRoles={["admin"]} />}>
           <Route path="/admin" element={<Admin />} />
        </Route>

        {/* Protected User/Admin Route */}
        <Route element={<RequireAuth allowedRoles={["user", "admin"]} />}>
           <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}