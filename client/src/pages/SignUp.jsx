import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../api";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import { User, Mail, Lock, ArrowRight, CheckCircle } from "lucide-react";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSignup(e) {
    e.preventDefault();

    // 1. Basic Validation
    if (!fullName || !email || !password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    // 2. Password Match Validation (Required by Assessment)
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // 3. Password Strength (Simple check, can be expanded)
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      // Register Request
      await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          fullName,
          email,
          password,
        }),
      });

      toast.success("Account created successfully!");

      // Verify user & Redirect based on role
      const me = await apiRequest("/user/me");

      if (me.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/profile");
      }

    } catch (err) {
      toast.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 shadow-xl rounded-2xl p-8">
        
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join us to manage your workspace.</p>
        </div>

        <form onSubmit={handleSignup}>
          {/* Full Name */}
          <div className="mb-4 relative">
            <label className="block text-xs font-medium text-gray-700 mb-1 ml-1">FULL NAME</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                className="pl-10 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-4 relative">
            <label className="block text-xs font-medium text-gray-700 mb-1 ml-1">EMAIL ADDRESS</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                className="pl-10 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="name@company.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <label className="block text-xs font-medium text-gray-700 mb-1 ml-1">PASSWORD</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                className="pl-10 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Confirm Password (Required) */}
          <div className="mb-6 relative">
            <label className="block text-xs font-medium text-gray-700 mb-1 ml-1">CONFIRM PASSWORD</label>
            <div className="relative">
              <CheckCircle className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                className="pl-10 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold p-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            disabled={loading}
          >
            {loading ? <Spinner /> : <>Sign Up <ArrowRight size={18} /></>}
          </button>
        </form>

        <p className="text-sm mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/" className="text-indigo-600 font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}