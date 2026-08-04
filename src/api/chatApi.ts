import { apiClient } from './client'
import type { paths } from './schema'

export type ChatResponse =
  paths['/chat']['post']['responses']['200']['content']['application/json']

export async function postChatMessage(
  accessToken: string,
  text: string,
  chatId?: string,
): Promise<ChatResponse> {
  const { data, error } = await apiClient.POST('/chat', {
    body: { text, chat_id: chatId },
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (error) {
    throw new Error('チャットの送信に失敗しました')
  }
  return data
}
