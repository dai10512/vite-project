const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export type Memo = {
  id: string
  title: string
  user_id: string
  created_at: string
}

type MemoListResponse = {
  data: Memo[]
  total: number
  page: number
  limit: number
}

async function request<T>(path: string, accessToken: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...init.headers,
    },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.error ?? `リクエストに失敗しました (${res.status})`)
  }

  return res.json()
}

export function fetchMemos(accessToken: string): Promise<MemoListResponse> {
  return request<MemoListResponse>('/memos', accessToken)
}

export function createMemo(accessToken: string, title: string): Promise<Memo> {
  return request<Memo>('/memos', accessToken, {
    method: 'POST',
    body: JSON.stringify({ title }),
  })
}
