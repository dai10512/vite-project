import { createContext } from 'react'

export type AuthContextType = {
  isAuthenticated: boolean
  isLoading: boolean
  email: string | null
  accessToken: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)
