import { useEffect, useState, useCallback, type FormEvent } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { useAuth } from '../context/useAuth'
import { createMemo, fetchMemos, type Memo } from '../api/memosApi'
import ChatPanel from '../components/ChatPanel'

const RELATIVE_TIME_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 60 * 60 * 24 * 365],
  ['month', 60 * 60 * 24 * 30],
  ['day', 60 * 60 * 24],
  ['hour', 60 * 60],
  ['minute', 60],
]

const relativeTimeFormatter = new Intl.RelativeTimeFormat('ja', { numeric: 'auto' })

function formatRelativeTime(dateString: string): string {
  const diffSeconds = Math.round((new Date(dateString).getTime() - Date.now()) / 1000)
  const absDiff = Math.abs(diffSeconds)

  for (const [unit, secondsInUnit] of RELATIVE_TIME_UNITS) {
    if (absDiff >= secondsInUnit) {
      return relativeTimeFormatter.format(Math.round(diffSeconds / secondsInUnit), unit)
    }
  }
  return relativeTimeFormatter.format(diffSeconds, 'second')
}

export default function Memos() {
  const { accessToken } = useAuth()
  const [memos, setMemos] = useState<Memo[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadMemos = useCallback(() => {
    if (!accessToken) return
    fetchMemos(accessToken)
      .then((result) =>
        setMemos(
          [...result.data].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
          ),
        ),
      )
      .catch((err) => setError(err instanceof Error ? err.message : '取得に失敗しました'))
      .finally(() => setIsLoading(false))
  }, [accessToken])

  useEffect(() => {
    loadMemos()
    // ProtectedRouteで認証確定後にしか描画されないため、マウント時の1回だけ取得すればよい
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!accessToken || title.trim() === '') return

    setIsSubmitting(true)
    setError(null)
    try {
      const created = await createMemo(accessToken, title, content.trim() || undefined)
      setMemos((prev) => [created, ...prev])
      setTitle('')
      setContent('')
    } catch (err) {
      setError(err instanceof Error ? err.message : '作成に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        メモ一覧
      </Typography>
      <Typography color="text.secondary" gutterBottom>
        hono-my-app のバックエンドAPIから取得しています
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ flex: 2 }}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <TextField
                label="新しいメモのタイトル"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                size="small"
                disabled={isSubmitting}
              />
              <TextField
                label="本文(任意)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                fullWidth
                multiline
                minRows={3}
                size="small"
                disabled={isSubmitting}
                slotProps={{ htmlInput: { maxLength: 2000 } }}
                helperText={`${content.length} / 2000`}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                sx={{ alignSelf: 'flex-end' }}
              >
                {isSubmitting ? <CircularProgress size={20} color="inherit" /> : '追加'}
              </Button>
            </Box>
          </Paper>

          {isLoading ? (
            <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : memos.length === 0 ? (
            <Paper sx={{ p: 2 }}>
              <Typography color="text.secondary">まだメモがありません</Typography>
            </Paper>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
              }}
            >
              {memos.map((memo) => (
                <Card key={memo.id} variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" component="h2" gutterBottom>
                      {memo.title}
                    </Typography>
                    {memo.content && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ whiteSpace: 'pre-wrap', mb: 1 }}
                      >
                        {memo.content}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary">
                      {formatRelativeTime(memo.created_at)}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>

        <Box sx={{ flex: 1 }}>
          <ChatPanel onReply={loadMemos} />
        </Box>
      </Box>
    </>
  )
}
