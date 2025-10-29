// /lib/AuthContext.tsx
'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { auth } from './firebaseConfig'
import { onAuthStateChanged, User } from 'firebase/auth'
import { AuthContextType } from '@/@types'

const AuthContext = createContext<AuthContextType>({ user: undefined })

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null | undefined>(undefined)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ?? null)
    })
    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => useContext(AuthContext)
