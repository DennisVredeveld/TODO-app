export async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  })
  const text = await res.text()
  let data: any
  try { data = text ? JSON.parse(text) : undefined } catch { data = text }
  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || res.statusText || 'Request failed'
    throw new Error(msg)
  }
  return data as T
}
