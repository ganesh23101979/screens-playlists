import { useState } from "react";
import { apiFetch } from "../api/api";
import { useAuth } from "../contexts/AuthContext";

export default function AddPlaylist({ onSuccess }) {
  const { token } = useAuth();
  const [name, setName] = useState("");
  const [urlsText, setUrlsText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const itemUrls = urlsText.split("\n").map(l => l.trim()).filter(Boolean);
    if (!name.trim()) return setError("Playlist name is required.");
    if (itemUrls.length > 10) return setError("Max 10 URLs allowed.");

    for (const url of itemUrls) {
      try { new URL(url); } catch { return setError(`Invalid URL: ${url}`); }
    }

    setLoading(true);
    try {
      await apiFetch("/playlists", { method: "POST", token, body: { name, itemUrls } });
      setSuccess("Playlist added successfully!");
      setName(""); setUrlsText("");
      onSuccess && onSuccess();
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-6 w-full max-w-md space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">Add New Playlist</h3>

      <div>
        <label className="block text-gray-700 mb-1">Playlist Name</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          placeholder="e.g. Summer Vibes"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-1">URLs (optional, one per line)</label>
        <textarea
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          rows={5}
          placeholder={`https://example.com/video1.mp4\nhttps://example.com/video2.mp4`}
          value={urlsText}
          onChange={(e) => setUrlsText(e.target.value)}
        />
      </div>

      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded-lg text-white font-medium ${
          loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Saving..." : "Add Playlist"}
      </button>
    </form>
  );
}
