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

  useEffect(() => { loadPlaylists(); }, [page]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Playlists</h2>
      <AddPlaylist onSuccess={loadPlaylists} />

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {loading ? (
        <p className="text-gray-500 mt-4">Loading playlists...</p>
      ) : (
        <>
          <ul className="mt-6 divide-y divide-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">List of Playlists</h3>
            {playlists.map((p) => (
              <li key={p._id} className="py-3 flex justify-between">
                <span className="font-medium text-gray-800">{p.name}</span>
                <span className="text-gray-500">{p.itemCount} items</span>
              </li>
            ))}
          </ul>

          <Pagination
            page={page}
            setPage={setPage}
            total={total}
            limit={limit}
          />
        </>
      )}
    </div>
  );
}
