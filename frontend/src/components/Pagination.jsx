export default function Pagination({ page, setPage, total, limit }) {
  const pages = Math.max(1, Math.ceil(total / limit));
  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <button
        onClick={() => setPage(1)}
        disabled={page === 1}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        First
      </button>
      <button
        onClick={() => setPage(page - 1)}
        disabled={page <= 1}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        Prev
      </button>
      <span className="text-gray-700">Page {page} / {pages}</span>
      <button
        onClick={() => setPage(page + 1)}
        disabled={page >= pages}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        Next
      </button>
      <button
        onClick={() => setPage(pages)}
        disabled={page >= pages}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        Last
      </button>
    </div>
  );
}
