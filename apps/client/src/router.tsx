import { Navigate, Outlet } from 'react-router-dom'
import React, { createContext, useContext, useState } from 'react'

export type AuthContextType = {
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>('token')
  const login = (token: string) => {
    setToken(token)
  }
  const logout = () => {
    setToken(null)
  }
  const isAuthenticated = !!token

  return (
    <AuthContext.Provider value={ { isAuthenticated, login, logout } }>
      {children}
    </AuthContext.Provider>
  )
}
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}


const AuthRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth()

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />
}
export default AuthRoutes
