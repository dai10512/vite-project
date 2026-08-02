import { createContext, useEffect, useState, type ReactNode } from 'react'
import { mockLoginApi, mockVerifyTokenApi } from '../api/mockAuthApi'

const TOKEN_STORAGE_KEY = 'auth-token'

export type AuthContextType = {
  isAuthenticated: boolean
  isLoading: boolean
  username: string | null
  login: (username: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (!token) {
      setIsLoading(false)
      return
    }

    mockVerifyTokenApi(token)
      .then((result) => {
        setUsername(result.username)
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_STORAGE_KEY)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const login = async (name: string) => {
    const { token } = await mockLoginApi(name)
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
    setUsername(name)
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    setUsername(null)
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: username !== null, isLoading, username, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}
