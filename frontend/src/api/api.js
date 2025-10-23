const API_BASE = import.meta.env.VITE_API_BASE;

export async function apiFetch(path, { method = "GET", body, token, qs } = {}) {
  let url = `${API_BASE}${path}`;
  if (qs) {
    const params = new URLSearchParams(qs);
    url += `?${params.toString()}`;
  }
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch(e) { data = text; }

  if (!res.ok) {
    const message = data?.message || res.statusText || "Error";
    const e = new Error(message);
    e.status = res.status;
    e.data = data;
    throw e;
  }
  return data;
}
