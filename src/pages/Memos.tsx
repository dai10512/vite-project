import { useEffect, useState, type FormEvent } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { useAuth } from '../context/useAuth'
import { createMemo, fetchMemos, type Memo } from '../api/memosApi'

export default function Memos() {
  const { accessToken } = useAuth()
  const [memos, setMemos] = useState<Memo[]>([])
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!accessToken) return

    fetchMemos(accessToken)
      .then((result) => setMemos(result.data))
      .catch((err) => setError(err instanceof Error ? err.message : '取得に失敗しました'))
      .finally(() => setIsLoading(false))
    // ProtectedRouteで認証確定後にしか描画されないため、マウント時の1回だけ取得すればよい
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!accessToken || title.trim() === '') return

    setIsSubmitting(true)
    setError(null)
    try {
      const created = await createMemo(accessToken, title)
      setMemos((prev) => [created, ...prev])
      setTitle('')
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

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="新しいメモのタイトル"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            size="small"
            disabled={isSubmitting}
          />
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={20} color="inherit" /> : '追加'}
          </Button>
        </Box>
      </Paper>

      <Paper>
        {isLoading ? (
          <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : memos.length === 0 ? (
          <Typography sx={{ p: 2 }} color="text.secondary">
            まだメモがありません
          </Typography>
        ) : (
          <List>
            {memos.map((memo) => (
              <ListItem key={memo.id} divider>
                <ListItemText primary={memo.title} secondary={memo.created_at} />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </>
  )
}
