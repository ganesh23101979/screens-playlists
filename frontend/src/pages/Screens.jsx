import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import { useAuth } from "../contexts/AuthContext";
import Pagination from "../components/Pagination";

export default function Screens() {
  const { token } = useAuth();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch("/screens", { qs: { search: q, page, limit }, token });
        if (!alive) return;
        setItems(data.items);
        setTotal(data.total);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, [q, page, limit, token]);

  async function toggle(id) {
    const before = items;
    const idx = items.findIndex(i => i._id === id);
    if (idx < 0) return;
    const toggled = [...items];
    toggled[idx] = { ...toggled[idx], isActive: !toggled[idx].isActive };
    setItems(toggled);

    try {
      await apiFetch(`/screens/${id}`, { method: "PUT", token });
    } catch (err) {
      setItems(before);
      alert("Toggle failed: " + err.message);
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Screens</h2>

      <input
        placeholder="Search by name"
        value={q}
        onChange={e => { setQ(e.target.value); setPage(1); }}
        className="border border-gray-300 rounded-lg p-2 w-full max-w-md focus:ring-2 focus:ring-blue-400 outline-none"
      />

      {loading ? (
        <p className="text-gray-500 mt-4">Loading...</p>
      ) : error ? (
        <div className="text-red-600 mt-4">{error}</div>
      ) : (
        <>
          <table className="w-full mt-6 border border-gray-200 text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Description</th>
                <th className="p-2">Active</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(it => (
                <tr key={it._id} className="border-t">
                  <td className="p-2">{it.name}</td>
                  <td className="p-2">{it.description}</td>
                  <td className="p-2">{it.isActive ? "Yes" : "No"}</td>
                  <td className="p-2">
                    <button
                      onClick={() => toggle(it._id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Toggle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination page={page} setPage={setPage} total={total} limit={limit} />
        </>
      )}
    </div>
  );
}
