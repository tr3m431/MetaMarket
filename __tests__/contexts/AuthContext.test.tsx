import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '../../contexts/AuthContext'

// Test component to access context
const TestComponent = () => {
  const { user, login, logout, register, isLoading } = useAuth()
  
  return (
    <div>
      <div data-testid="user-status">
        {user ? `logged-in:${user.email}` : 'not-logged-in'}
      </div>
      <div data-testid="loading-status">
        {isLoading ? 'loading' : 'not-loading'}
      </div>
      <button 
        data-testid="login-button" 
        onClick={() => login('demo@example.com', 'password')}
      >
        Login
      </button>
      <button 
        data-testid="register-button" 
        onClick={() => register('test@example.com', 'password123', 'Test User', 'buyer')}
      >
        Register
      </button>
      <button 
        data-testid="logout-button" 
        onClick={logout}
      >
        Logout
      </button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  it('should provide initial unauthenticated state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('user-status')).toHaveTextContent('not-logged-in')
    expect(screen.getByTestId('loading-status')).toHaveTextContent('not-loading')
  })

  it('should load user from localStorage on mount', () => {
    // Pre-populate localStorage
    const testUser = {
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'buyer',
      createdAt: '2024-01-01T00:00:00Z',
    }
    
    localStorage.setItem('metamarket_user', JSON.stringify(testUser))

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('user-status')).toHaveTextContent('logged-in:test@example.com')
  })

  it('should render all buttons', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('login-button')).toBeInTheDocument()
    expect(screen.getByTestId('register-button')).toBeInTheDocument()
    expect(screen.getByTestId('logout-button')).toBeInTheDocument()
  })

  it('should handle logout function', () => {
    // Pre-populate localStorage with a user
    const testUser = {
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'buyer',
      createdAt: '2024-01-01T00:00:00Z',
    }
    
    localStorage.setItem('metamarket_user', JSON.stringify(testUser))

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // Verify user is logged in initially
    expect(screen.getByTestId('user-status')).toHaveTextContent('logged-in:test@example.com')

    // Click logout button
    fireEvent.click(screen.getByTestId('logout-button'))

    // Verify user is logged out
    expect(screen.getByTestId('user-status')).toHaveTextContent('not-logged-in')
  })
}) 