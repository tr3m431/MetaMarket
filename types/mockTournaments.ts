import { Tournament } from './card'

export const mockTournaments: Tournament[] = [
  {
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
          { cardId: 'c1', quantity: 3, card: { id: 'c1', name: 'Ash Blossom & Joyous Spring', type: 'Effect Monster', description: '', imageUrl: '', rarity: '', set: '', setCode: '', cardNumber: '', isReprint: false, isBanned: false, isLimited: false, isSemiLimited: false, createdAt: '', updatedAt: '' } },
          { cardId: 'c2', quantity: 2, card: { id: 'c2', name: 'Kashtira Fenrir', type: 'Effect Monster', description: '', imageUrl: '', rarity: '', set: '', setCode: '', cardNumber: '', isReprint: false, isBanned: false, isLimited: false, isSemiLimited: false, createdAt: '', updatedAt: '' } }
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
        mainDeck: [
          { cardId: 'c3', quantity: 3, card: { id: 'c3', name: 'Arianna the Labrynth Servant', type: 'Effect Monster', description: '', imageUrl: '', rarity: '', set: '', setCode: '', cardNumber: '', isReprint: false, isBanned: false, isLimited: false, isSemiLimited: false, createdAt: '', updatedAt: '' } }
        ],
        extraDeck: [],
        sideDeck: [],
      },
    ],
  },
  {
    id: '2',
    name: 'YCS Chicago 2024',
    date: '2024-01-08',
    location: 'Chicago, IL',
    format: 'Advanced',
    size: 856,
    region: 'NA',
    topCut: 32,
    decklists: [
      {
        id: 'd3',
        tournamentId: '2',
        player: 'Carol',
        placement: 1,
        deckType: 'Purrely',
        mainDeck: [
          { cardId: 'c4', quantity: 3, card: { id: 'c4', name: 'Purrely', type: 'Effect Monster', description: '', imageUrl: '', rarity: '', set: '', setCode: '', cardNumber: '', isReprint: false, isBanned: false, isLimited: false, isSemiLimited: false, createdAt: '', updatedAt: '' } }
        ],
        extraDeck: [],
        sideDeck: [],
      },
    ],
  },
  {
    id: '3',
    name: 'YCS Dallas 2024',
    date: '2024-01-01',
    location: 'Dallas, TX',
    format: 'Advanced',
    size: 724,
    region: 'NA',
    topCut: 32,
    decklists: [
      {
        id: 'd4',
        tournamentId: '3',
        player: 'Dave',
        placement: 1,
        deckType: 'Purrely',
        mainDeck: [
          { cardId: 'c4', quantity: 3, card: { id: 'c4', name: 'Purrely', type: 'Effect Monster', description: '', imageUrl: '', rarity: '', set: '', setCode: '', cardNumber: '', isReprint: false, isBanned: false, isLimited: false, isSemiLimited: false, createdAt: '', updatedAt: '' } }
        ],
        extraDeck: [],
        sideDeck: [],
      },
    ],
  },
] 