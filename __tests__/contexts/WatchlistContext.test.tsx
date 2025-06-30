import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { WatchlistProvider, useWatchlist } from '../../contexts/WatchlistContext'
import { Card } from '../../types/card'

// Test component to access context
const TestComponent = () => {
  const { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist()
  
  const testCard: Card = {
    id: 'test-card-1',
    name: 'Blue-Eyes White Dragon',
    type: 'Normal Monster',
    rarity: 'Ultra Rare',
    set: 'Legend of Blue Eyes White Dragon',
    setCode: 'LOB-001',
    cardNumber: '001',
    isReprint: false,
    isBanned: false,
    isLimited: false,
    isSemiLimited: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    attribute: 'LIGHT',
    level: 8,
    race: 'Dragon',
    attack: 3000,
    defense: 2500,
    description: 'This legendary dragon is a powerful engine of destruction.',
    imageUrl: '/images/blue-eyes.jpg',
  }

  return (
    <div>
      <div data-testid="watchlist-count">{watchlist.length}</div>
      <button 
        data-testid="add-button" 
        onClick={() => addToWatchlist(testCard)}
      >
        Add to Watchlist
      </button>
      <button 
        data-testid="remove-button" 
        onClick={() => removeFromWatchlist(testCard.id)}
      >
        Remove from Watchlist
      </button>
      <div data-testid="is-in-watchlist">
        {isInWatchlist(testCard.id) ? 'true' : 'false'}
      </div>
    </div>
  )
}

describe('WatchlistContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  it('should provide initial empty watchlist', () => {
    render(
      <WatchlistProvider>
        <TestComponent />
      </WatchlistProvider>
    )

    expect(screen.getByTestId('watchlist-count')).toHaveTextContent('0')
    expect(screen.getByTestId('is-in-watchlist')).toHaveTextContent('false')
  })

  it('should add card to watchlist', async () => {
    render(
      <WatchlistProvider>
        <TestComponent />
      </WatchlistProvider>
    )

    fireEvent.click(screen.getByTestId('add-button'))

    await waitFor(() => {
      expect(screen.getByTestId('watchlist-count')).toHaveTextContent('1')
      expect(screen.getByTestId('is-in-watchlist')).toHaveTextContent('true')
    })
  })

  it('should remove card from watchlist', async () => {
    render(
      <WatchlistProvider>
        <TestComponent />
      </WatchlistProvider>
    )

    // Add card first
    fireEvent.click(screen.getByTestId('add-button'))
    
    await waitFor(() => {
      expect(screen.getByTestId('watchlist-count')).toHaveTextContent('1')
    })

    // Remove card
    fireEvent.click(screen.getByTestId('remove-button'))

    await waitFor(() => {
      expect(screen.getByTestId('watchlist-count')).toHaveTextContent('0')
      expect(screen.getByTestId('is-in-watchlist')).toHaveTextContent('false')
    })
  })

  it('should persist watchlist to localStorage', async () => {
    render(
      <WatchlistProvider>
        <TestComponent />
      </WatchlistProvider>
    )

    fireEvent.click(screen.getByTestId('add-button'))

    await waitFor(() => {
      expect(screen.getByTestId('watchlist-count')).toHaveTextContent('1')
    })

    // Check localStorage
    const stored = localStorage.getItem('watchlist')
    expect(stored).toBeTruthy()
    
    const parsed = JSON.parse(stored!)
    expect(parsed).toHaveLength(1)
    expect(parsed[0].id).toBe('test-card-1')
  })

  it('should load watchlist from localStorage on mount', () => {
    // Pre-populate localStorage
    const testCard: Card = {
      id: 'test-card-1',
      name: 'Blue-Eyes White Dragon',
      type: 'Normal Monster',
      rarity: 'Ultra Rare',
      set: 'Legend of Blue Eyes White Dragon',
      setCode: 'LOB-001',
      cardNumber: '001',
      isReprint: false,
      isBanned: false,
      isLimited: false,
      isSemiLimited: false,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      attribute: 'LIGHT',
      level: 8,
      race: 'Dragon',
      attack: 3000,
      defense: 2500,
      description: 'This legendary dragon is a powerful engine of destruction.',
      imageUrl: '/images/blue-eyes.jpg',
    }
    
    localStorage.setItem('watchlist', JSON.stringify([testCard]))

    render(
      <WatchlistProvider>
        <TestComponent />
      </WatchlistProvider>
    )

    expect(screen.getByTestId('watchlist-count')).toHaveTextContent('1')
    expect(screen.getByTestId('is-in-watchlist')).toHaveTextContent('true')
  })
}) 