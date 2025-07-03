import React from 'react'
import { render, screen } from '@testing-library/react'
import TournamentDetailPage from '../../app/events/[id]/page'
import { Tournament } from '../../types/card'

const mockTournament: Tournament = {
  id: '1',
  name: 'YCS Las Vegas 2024',
  date: '2024-01-15',
  location: 'Las Vegas, NV',
  format: 'Advanced',
  size: 1024,
  region: 'NA',
  topCut: 32,
  decklists: [
    {
      id: 'd1',
      tournamentId: '1',
      player: 'Alice',
      placement: 1,
      deckType: 'Kashtira',
      mainDeck: [
        { cardId: 'c1', quantity: 3, card: { id: 'c1', name: 'Ash Blossom', type: 'Effect Monster', description: '', imageUrl: '', rarity: '', set: '', setCode: '', cardNumber: '', isReprint: false, isBanned: false, isLimited: false, isSemiLimited: false, createdAt: '', updatedAt: '' } }
      ],
      extraDeck: [],
      sideDeck: [],
    },
    {
      id: 'd2',
      tournamentId: '1',
      player: 'Bob',
      placement: 2,
      deckType: 'Labrynth',
      mainDeck: [],
      extraDeck: [],
      sideDeck: [],
    },
  ],
}

describe('TournamentDetailPage', () => {
  it('renders tournament info', () => {
    render(<TournamentDetailPage tournament={mockTournament} />)
    expect(screen.getByText('YCS Las Vegas 2024')).toBeInTheDocument()
    expect(screen.getByText(/Las Vegas, NV/)).toBeInTheDocument()
    expect(screen.getByText(/Advanced/)).toBeInTheDocument()
    expect(screen.getByText(/Top Cut: 32/)).toBeInTheDocument()
  })

  it('renders decklists with player, placement, and deck type', () => {
    render(<TournamentDetailPage tournament={mockTournament} />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Kashtira')).toBeInTheDocument()
    expect(screen.getByText('#1')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Labrynth')).toBeInTheDocument()
    expect(screen.getByText('#2')).toBeInTheDocument()
  })

  it('renders deck card counts', () => {
    render(<TournamentDetailPage tournament={mockTournament} />)
    expect(screen.getByText(/Main Deck: 3/)).toBeInTheDocument()
    expect(screen.getByText(/Extra Deck: 0/)).toBeInTheDocument()
    expect(screen.getByText(/Side Deck: 0/)).toBeInTheDocument()
  })

  it('handles no decklists gracefully', () => {
    const noDecks = { ...mockTournament, decklists: [] }
    render(<TournamentDetailPage tournament={noDecks} />)
    expect(screen.getByText(/No decklists available/)).toBeInTheDocument()
  })
}) 