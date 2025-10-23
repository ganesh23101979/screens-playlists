import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const data = await apiFetch("/auth/login", { method: "POST", body: { email, password } });
      login({ token: data.token, user: data.user });
      navigate("/screens");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form onSubmit={submit} className="bg-white shadow-md rounded-xl p-6 w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-semibold text-center text-gray-800">Login</h2>

        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            required
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            required
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={busy}
          className={`w-full py-2 rounded-lg text-white font-medium ${
            busy ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {busy ? "Logging in…" : "Login"}
        </button>

        {error && <div className="text-red-600 text-center">{error}</div>}
      </form>
    </div>
  );
}
