import { useState } from "react";
import { apiRequest } from "../api";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    if (!fullName || !email || !password) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);

      await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          fullName,
          email,
          password,
        }),
      });

      // Cookie is set by backend → verify user
      const me = await apiRequest("/user/me");

      if (me.user.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/profile";
      }

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-80 bg-white border p-6 rounded">
        <h1 className="text-xl font-semibold mb-4">Sign Up</h1>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-4"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="bg-black text-white w-full p-2 disabled:opacity-60"
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <a href="/" className="underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
