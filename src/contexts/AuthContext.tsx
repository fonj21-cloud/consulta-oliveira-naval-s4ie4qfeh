import { createContext, useContext, useState, ReactNode } from 'react'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  notifications: {
    email: boolean
    whatsapp: boolean
  }
}

interface AuthContextType {
  user: User | null
  login: (email: string, name?: string) => void
  logout: () => void
  updateProfile: (data: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = (email: string, name?: string) => {
    setUser({
      id: '1',
      name: name || 'João Carlos Silva',
      email,
      phone: '(21) 99999-9999',
      notifications: {
        email: true,
        whatsapp: true,
      },
    })
  }

  const logout = () => {
    setUser(null)
  }

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data })
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
