import { useState, type FormEvent } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useAuth } from '../context/useAuth'
import { postChatMessage } from '../api/chatApi'

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPanel({ onReply }: { onReply?: () => void }) {
  const { accessToken } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chatId, setChatId] = useState<string | undefined>(undefined)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!accessToken || input.trim() === '') return

    const userMessage: ChatMessage = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsSending(true)
    setError(null)
    try {
      const { reply, chat_id } = await postChatMessage(accessToken, userMessage.content, chatId)
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
      setChatId(chat_id)
      onReply?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : '送信に失敗しました')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        AIアシスタント
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        「買い物リストというメモを作って」のように話しかけると、メモを作成できます
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ minHeight: 200, maxHeight: 360, overflowY: 'auto', mb: 2 }}>
        {messages.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            メッセージを送ってみましょう
          </Typography>
        ) : (
          <Stack spacing={1}>
            {messages.map((message, i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1,
                    maxWidth: '85%',
                    bgcolor: message.role === 'user' ? 'primary.main' : 'grey.200',
                    color: message.role === 'user' ? 'primary.contrastText' : 'text.primary',
                  }}
                >
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {message.content}
                  </Typography>
                </Paper>
              </Box>
            ))}
            {isSending && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <CircularProgress size={18} />
              </Box>
            )}
          </Stack>
        )}
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1 }}>
        <TextField
          placeholder="メッセージを入力"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          fullWidth
          size="small"
          disabled={isSending}
        />
        <Button type="submit" variant="contained" disabled={isSending}>
          送信
        </Button>
      </Box>
    </Paper>
  )
}
