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
  const [token, setToken] = useState<string | null | undefined>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser ?? null)
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken()
         setToken(token);
        //  persist token for axios
        if(!token) return;
        localStorage.setItem("authToken", token);
      }else{
        setUser(null);
        setToken(null)
        //remove token from localStorage
        localStorage.removeItem("authToken");
      }
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
