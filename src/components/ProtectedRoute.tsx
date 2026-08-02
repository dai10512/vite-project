import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useAuth } from '../context/useAuth'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
        <Typography color="text.secondary">セッション確認中...</Typography>
      </Box>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
