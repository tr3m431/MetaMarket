import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import CardComponent from '../../components/CardComponent'
import { Card } from '../../types/card'
import { WatchlistProvider } from '../../contexts/WatchlistContext'

const mockCard: Card = {
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

// Mock the contexts
jest.mock('../../contexts/WatchlistContext', () => ({
  useWatchlist: () => ({
    addToWatchlist: jest.fn(),
    removeFromWatchlist: jest.fn(),
    isInWatchlist: jest.fn(() => false),
  }),
}))

describe('CardComponent', () => {
  it('should render card information correctly', () => {
    render(
      <WatchlistProvider>
        <CardComponent card={mockCard} />
      </WatchlistProvider>
    )

    expect(screen.getByText('Blue-Eyes White Dragon')).toBeInTheDocument()
    expect(screen.getByText('Normal Monster')).toBeInTheDocument()
    expect(screen.getByText('Ultra Rare')).toBeInTheDocument()
    expect(screen.getByText('Legend of Blue Eyes White Dragon')).toBeInTheDocument()
    expect(screen.getByText('LIGHT')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('Dragon')).toBeInTheDocument()
    expect(screen.getByText('3000/2500')).toBeInTheDocument()
  })

  it('should display card image', () => {
    render(
      <WatchlistProvider>
        <CardComponent card={mockCard} />
      </WatchlistProvider>
    )

    const image = screen.getByAltText('Blue-Eyes White Dragon')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', mockCard.imageUrl)
  })

  it('should show ban status when card is banned', () => {
    const bannedCard = { ...mockCard, isBanned: true }
    render(
      <WatchlistProvider>
        <CardComponent card={bannedCard} />
      </WatchlistProvider>
    )

    expect(screen.getByText('BANNED')).toBeInTheDocument()
  })

  it('should show limited status when card is limited', () => {
    const limitedCard = { ...mockCard, isLimited: true }
    render(
      <WatchlistProvider>
        <CardComponent card={limitedCard} />
      </WatchlistProvider>
    )

    expect(screen.getByText('LIMITED')).toBeInTheDocument()
  })

  it('should show semi-limited status when card is semi-limited', () => {
    const semiLimitedCard = { ...mockCard, isSemiLimited: true }
    render(
      <WatchlistProvider>
        <CardComponent card={semiLimitedCard} />
      </WatchlistProvider>
    )

    expect(screen.getByText('SEMI-LIMITED')).toBeInTheDocument()
  })

  it('should show reprint indicator when card is a reprint', () => {
    const reprintCard = { ...mockCard, isReprint: true }
    render(
      <WatchlistProvider>
        <CardComponent card={reprintCard} />
      </WatchlistProvider>
    )

    expect(screen.getByText('REPRINT')).toBeInTheDocument()
  })

  it('should have correct link to card details page', () => {
    render(<CardComponent card={mockCard} />)

    const link = screen.getByRole('link', { name: /view details/i })
    expect(link).toHaveAttribute('href', '/cards/test-card-1')
  })

  it('should display card description', () => {
    render(<CardComponent card={mockCard} />)

    expect(screen.getByText('This legendary dragon is a powerful engine of destruction.')).toBeInTheDocument()
  })

  it('should handle cards without optional attributes', () => {
    const minimalCard: Card = {
      id: 'minimal-card',
      name: 'Minimal Card',
      type: 'Spell Card',
      rarity: 'Common',
      set: 'Test Set',
      setCode: 'TEST-001',
      cardNumber: '001',
      isReprint: false,
      isBanned: false,
      isLimited: false,
      isSemiLimited: false,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      description: 'A minimal card for testing.',
      imageUrl: '/images/minimal.jpg',
    }

    render(<CardComponent card={minimalCard} />)

    expect(screen.getByText('Minimal Card')).toBeInTheDocument()
    expect(screen.getByText('Spell Card')).toBeInTheDocument()
    expect(screen.getByText('Common')).toBeInTheDocument()
    expect(screen.getByText('Test Set')).toBeInTheDocument()
    expect(screen.getByText('A minimal card for testing.')).toBeInTheDocument()
  })
}) 