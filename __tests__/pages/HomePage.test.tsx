import React from 'react'
import { render, screen } from '@testing-library/react'
import HomePage from '../../app/page'

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

describe('HomePage', () => {
  it('should render the hero section', () => {
    render(<HomePage />)

    expect(screen.getByText('Yu-Gi-Oh! Card Value Tracker')).toBeInTheDocument()
  })

  it('should render the search functionality', () => {
    render(<HomePage />)

    const searchInput = screen.getByPlaceholderText('Search for a card...')
    expect(searchInput).toBeInTheDocument()
  })

  it('should render trending cards section', () => {
    render(<HomePage />)

    expect(screen.getByText('Trending Cards')).toBeInTheDocument()
  })

  it('should render recent tournaments section', () => {
    render(<HomePage />)

    expect(screen.getByText('Recent Tournaments')).toBeInTheDocument()
  })

  it('should render features section', () => {
    render(<HomePage />)

    expect(screen.getByText('Powerful Features for Card Investors')).toBeInTheDocument()
    expect(screen.getByText('Price Tracking')).toBeInTheDocument()
    expect(screen.getByText('Meta Analysis')).toBeInTheDocument()
    expect(screen.getByText('AI Predictions')).toBeInTheDocument()
  })

  it('should render call-to-action buttons', () => {
    render(<HomePage />)

    expect(screen.getByRole('link', { name: /browse cards/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /get started free/i })).toBeInTheDocument()
  })
}) 