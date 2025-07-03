import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Header from '../../components/Header'

// Mock the contexts
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    isLoading: false,
    logout: jest.fn(),
  }),
}))

jest.mock('../../contexts/WatchlistContext', () => ({
  useWatchlist: () => ({
    watchlist: [],
    addToWatchlist: jest.fn(),
    removeFromWatchlist: jest.fn(),
    isInWatchlist: jest.fn(() => false),
  }),
}))

describe('Header', () => {
  it('should render the logo and navigation', () => {
    render(<Header />)

    expect(screen.getByText('MetaMarket')).toBeInTheDocument()
    expect(screen.getByText('Cards')).toBeInTheDocument()
    expect(screen.getByText('Meta Analysis')).toBeInTheDocument()
    expect(screen.getByText('Events')).toBeInTheDocument()
    expect(screen.getByText('Predictions')).toBeInTheDocument()
  })

  it('should render search input', () => {
    render(<Header />)

    const searchInput = screen.getByPlaceholderText('Search cards...')
    expect(searchInput).toBeInTheDocument()
  })

  it('should render user menu when not authenticated', () => {
    render(<Header />)

    // Check for login link (icon only, no text)
    const loginLink = screen.getByRole('link', { name: '' })
    expect(loginLink).toHaveAttribute('href', '/login')
  })

  it('should handle search input changes', () => {
    render(<Header />)

    const searchInput = screen.getByPlaceholderText('Search cards...')
    fireEvent.change(searchInput, { target: { value: 'Blue-Eyes' } })

    expect(searchInput).toHaveValue('Blue-Eyes')
  })

  it('should render mobile menu button', () => {
    render(<Header />)

    const mobileMenuButton = screen.getByRole('button')
    expect(mobileMenuButton).toBeInTheDocument()
  })

  it('should render navigation links', () => {
    render(<Header />)

    const navigationLinks = [
      { text: 'Cards', href: '/cards' },
      { text: 'Events', href: '/events' },
      { text: 'Meta Analysis', href: '/meta' },
      { text: 'Predictions', href: '/predictions' },
    ]

    navigationLinks.forEach(link => {
      const linkElement = screen.getByRole('link', { name: link.text })
      expect(linkElement).toBeInTheDocument()
      expect(linkElement).toHaveAttribute('href', link.href)
    })
  })

  it('should render user action buttons', () => {
    render(<Header />)

    // Check for login link
    const loginLink = screen.getByRole('link', { name: '' })
    expect(loginLink).toHaveAttribute('href', '/login')
  })
}) 