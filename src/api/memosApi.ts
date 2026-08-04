import { apiClient } from './client'
import type { paths } from './schema'

export type Memo =
  paths['/memos']['get']['responses']['200']['content']['application/json']['data'][number]

type MemoListResponse = paths['/memos']['get']['responses']['200']['content']['application/json']

export async function fetchMemos(accessToken: string): Promise<MemoListResponse> {
  const { data, error } = await apiClient.GET('/memos', {
    params: { query: {} },
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (error) {
    throw new Error('取得に失敗しました')
  }
  return data
}

export async function createMemo(
  accessToken: string,
  title: string,
  content?: string,
): Promise<Memo> {
  const { data, error } = await apiClient.POST('/memos', {
    body: { title, content },
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (error || !data) {
    throw new Error('作成に失敗しました')
  }
  return data
}
