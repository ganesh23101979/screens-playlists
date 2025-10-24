import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { apiFetch } from "../api/api";
import AddPlaylist from "../components/AddPlaylist";
import Pagination from "../components/Pagination";

export default function Playlists() {
  const { token } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5); // how many per page
  const [total, setTotal] = useState(0);
  const [expanded, setExpanded] = useState(null); // which playlist is expanded

  async function loadPlaylists() {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/playlists", {
        token,
        qs: { page, limit }
      });
      setPlaylists(data.items);
      setTotal(data.total || data.items.length);
    } catch (err) {
      setError(err.message || "Could not fetch playlists");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPlaylists();
  }, [page]);

  const toggleExpand = (id) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Playlists</h2>

      {/* Add Playlist Form */}
      <AddPlaylist onSuccess={loadPlaylists} />

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {loading ? (
        <p className="text-gray-500 mt-4">Loading playlists...</p>
      ) : (
        <>
          <ul className="mt-6 divide-y divide-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              List of Playlists
            </h3>

            {playlists.map((p) => (
              <li key={p._id} className="py-4">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleExpand(p._id)}
                >
                  <span
                    className={`font-semibold text-gray-800 hover:text-blue-600 transition-colors ${
                      expanded === p._id ? "text-blue-600" : ""
                    }`}
                  >
                    {p.name}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {p.itemCount} items
                  </span>
                </div>

                {expanded === p._id && p.itemUrls && p.itemUrls.length > 0 && (
                  <ul className="mt-3 space-y-2 pl-3 border-l-2 border-blue-300">
                    {p.itemUrls.map((url, i) => (
                      <li key={i}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline break-all"
                        >
                          {url}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}

                {expanded === p._id && (!p.itemUrls || p.itemUrls.length === 0) && (
                  <p className="text-gray-500 text-sm mt-2 ml-3">
                    No URLs added yet.
                  </p>
                )}
              </li>
            ))}
          </ul>

          <Pagination page={page} setPage={setPage} total={total} limit={limit} />
        </>
      )}
    </div>
  );
}
