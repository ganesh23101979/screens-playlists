import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo / Title */}
        <Link to="/" className="text-xl font-semibold hover:text-indigo-400">
          🎬 Screens & Playlists
        </Link>

        {/* Nav Links */}
        {token && (
          <div className="flex gap-6 items-center">
            <Link
              to="/screens"
              className="hover:text-indigo-400 transition-colors"
            >
              Screens
            </Link>
            <Link
              to="/playlists"
              className="hover:text-indigo-400 transition-colors"
            >
              Playlists
            </Link>

            {/* User Info */}
            {user && (
              <span className="text-sm text-gray-300">
                {user.email || user.name}
              </span>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
