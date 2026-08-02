import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, CircularProgress, Paper, TextField, Typography } from '@mui/material'
import { useAuth } from '../context/useAuth'

export default function Login() {
  const [username, setUsername] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (username.trim() === '') return
    setIsSubmitting(true)
    await login(username)
    navigate('/')
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'grey.100',
      }}
    >
      <Paper sx={{ p: 4, width: 320 }} elevation={3}>
        <Typography variant="h5" component="h1" gutterBottom>
          ログイン
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="ユーザー名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            disabled={isSubmitting}
          />
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'ログイン'}
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}
