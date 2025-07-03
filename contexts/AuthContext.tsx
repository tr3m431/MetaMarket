'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'buyer' | 'seller' | 'admin'
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, name: string, role: 'buyer' | 'seller') => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, this would verify the session with your backend
        const savedUser = localStorage.getItem('metamarket_user')
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock validation - in real app, this would be server-side
      if (email === 'demo@example.com' && password === 'password') {
        const mockUser: User = {
          id: '1',
          email: 'demo@example.com',
          name: 'Demo User',
          role: 'buyer',
          createdAt: new Date().toISOString(),
        }
        
        setUser(mockUser)
        localStorage.setItem('metamarket_user', JSON.stringify(mockUser))
        return { success: true }
      } else {
        return { success: false, error: 'Invalid email or password' }
      }
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string, role: 'buyer' | 'seller'): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock registration - in real app, this would create a user in your database
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role,
        createdAt: new Date().toISOString(),
      }
      
      setUser(newUser)
      localStorage.setItem('metamarket_user', JSON.stringify(newUser))
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Registration failed. Please try again.' }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('metamarket_user')
  }

  const updateProfile = async (data: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!user) {
        return { success: false, error: 'No user logged in' }
      }
      
      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      localStorage.setItem('metamarket_user', JSON.stringify(updatedUser))
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Profile update failed' }
    }
  }

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
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