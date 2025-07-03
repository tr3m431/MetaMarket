'use client'

import { useParams } from 'next/navigation'
import CardDetailPage from '@/components/CardDetailPage'
import { Card, PriceHistory, PricePrediction } from '@/types/card'

// Mock cards (copied from cards/page.tsx)
const mockCards: Card[] = [
  {
  id: '1',
  name: 'Blue-Eyes White Dragon',
  type: 'Normal Monster',
  attribute: 'LIGHT',
  level: 8,
  race: 'Dragon',
  attack: 3000,
  defense: 2500,
    description: 'This legendary dragon is a powerful engine of destruction.',
  imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
  rarity: 'Ultra Rare',
  set: 'Legend of Blue Eyes White Dragon',
  setCode: 'LOB-001',
  cardNumber: '001',
  isReprint: false,
  isBanned: false,
  isLimited: false,
  isSemiLimited: false,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Dark Magician',
    type: 'Normal Monster',
    attribute: 'DARK',
    level: 7,
    race: 'Spellcaster',
    attack: 2500,
    defense: 2100,
    description: 'The ultimate wizard in terms of attack and defense.',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    rarity: 'Ultra Rare',
    set: 'Legend of Blue Eyes White Dragon',
    setCode: 'LOB-005',
    cardNumber: '005',
    isReprint: false,
    isBanned: false,
    isLimited: false,
    isSemiLimited: false,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '3',
    name: 'Red-Eyes Black Dragon',
    type: 'Normal Monster',
    attribute: 'DARK',
    level: 7,
    race: 'Dragon',
    attack: 2400,
    defense: 2000,
    description: 'A ferocious dragon with a deadly attack.',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    rarity: 'Ultra Rare',
    set: 'Legend of Blue Eyes White Dragon',
    setCode: 'LOB-006',
    cardNumber: '006',
    isReprint: false,
    isBanned: false,
    isLimited: false,
    isSemiLimited: false,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '4',
    name: 'Pot of Greed',
    type: 'Spell Card',
    description: 'Draw 2 cards from your deck.',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
    rarity: 'Ultra Rare',
    set: 'Legend of Blue Eyes White Dragon',
    setCode: 'LOB-118',
    cardNumber: '118',
    isReprint: false,
    isBanned: true,
    isLimited: false,
    isSemiLimited: false,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '5',
    name: 'Mirror Force',
    type: 'Trap Card',
    description: 'When an opponent\'s monster declares an attack: Destroy all Attack Position monsters your opponent controls.',
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
    rarity: 'Ultra Rare',
    set: 'Legend of Blue Eyes White Dragon',
    setCode: 'LOB-119',
    cardNumber: '119',
    isReprint: false,
    isBanned: false,
    isLimited: false,
    isSemiLimited: false,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '6',
    name: 'Summoned Skull',
    type: 'Effect Monster',
    attribute: 'DARK',
    level: 6,
    race: 'Fiend',
    attack: 2500,
    defense: 1200,
    description: 'A fiend with dark powers for confusing the enemy.',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    rarity: 'Ultra Rare',
    set: 'Legend of Blue Eyes White Dragon',
    setCode: 'LOB-003',
    cardNumber: '003',
    isReprint: false,
    isBanned: false,
    isLimited: false,
    isSemiLimited: false,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
]

// Mock price histories for each card
const mockPriceHistories: Record<string, PriceHistory> = {
  '1': {
  cardId: '1',
  vendor: 'TCGPlayer',
  prices: [
    { date: '2024-01-01', price: 35.00, condition: 'Near Mint' },
    { date: '2024-01-08', price: 38.50, condition: 'Near Mint' },
    { date: '2024-01-15', price: 42.00, condition: 'Near Mint' },
    { date: '2024-01-22', price: 45.99, condition: 'Near Mint' },
    { date: '2024-01-29', price: 48.75, condition: 'Near Mint' },
    { date: '2024-02-05', price: 52.00, condition: 'Near Mint' },
  ]
  },
  '2': {
    cardId: '2',
    vendor: 'TCGPlayer',
    prices: [
      { date: '2024-01-01', price: 25.00, condition: 'Near Mint' },
      { date: '2024-01-08', price: 27.50, condition: 'Near Mint' },
      { date: '2024-01-15', price: 29.00, condition: 'Near Mint' },
      { date: '2024-01-22', price: 30.99, condition: 'Near Mint' },
      { date: '2024-01-29', price: 32.75, condition: 'Near Mint' },
      { date: '2024-02-05', price: 35.00, condition: 'Near Mint' },
    ]
  },
  '3': {
    cardId: '3',
    vendor: 'TCGPlayer',
    prices: [
      { date: '2024-01-01', price: 20.00, condition: 'Near Mint' },
      { date: '2024-01-08', price: 21.50, condition: 'Near Mint' },
      { date: '2024-01-15', price: 23.00, condition: 'Near Mint' },
      { date: '2024-01-22', price: 24.99, condition: 'Near Mint' },
      { date: '2024-01-29', price: 26.75, condition: 'Near Mint' },
      { date: '2024-02-05', price: 28.00, condition: 'Near Mint' },
    ]
  },
  '4': {
    cardId: '4',
    vendor: 'TCGPlayer',
    prices: [
      { date: '2024-01-01', price: 5.00, condition: 'Near Mint' },
      { date: '2024-01-08', price: 5.50, condition: 'Near Mint' },
      { date: '2024-01-15', price: 6.00, condition: 'Near Mint' },
      { date: '2024-01-22', price: 6.99, condition: 'Near Mint' },
      { date: '2024-01-29', price: 7.75, condition: 'Near Mint' },
      { date: '2024-02-05', price: 8.00, condition: 'Near Mint' },
    ]
  },
  '5': {
    cardId: '5',
    vendor: 'TCGPlayer',
    prices: [
      { date: '2024-01-01', price: 10.00, condition: 'Near Mint' },
      { date: '2024-01-08', price: 11.50, condition: 'Near Mint' },
      { date: '2024-01-15', price: 12.00, condition: 'Near Mint' },
      { date: '2024-01-22', price: 12.99, condition: 'Near Mint' },
      { date: '2024-01-29', price: 13.75, condition: 'Near Mint' },
      { date: '2024-02-05', price: 14.00, condition: 'Near Mint' },
    ]
  },
  '6': {
    cardId: '6',
    vendor: 'TCGPlayer',
    prices: [
      { date: '2024-01-01', price: 15.00, condition: 'Near Mint' },
      { date: '2024-01-08', price: 15.50, condition: 'Near Mint' },
      { date: '2024-01-15', price: 16.00, condition: 'Near Mint' },
      { date: '2024-01-22', price: 16.99, condition: 'Near Mint' },
      { date: '2024-01-29', price: 17.75, condition: 'Near Mint' },
      { date: '2024-02-05', price: 18.00, condition: 'Near Mint' },
    ]
  },
}

// Mock predictions for each card
const mockPredictions: Record<string, PricePrediction> = {
  '1': {
  cardId: '1',
    card: mockCards[0],
  currentPrice: 52.00,
  predictedPrice: 58.50,
  changeAmount: 6.50,
  changePercentage: 12.5,
  confidence: 0.85,
  direction: 'up',
  explanation: 'Card has shown consistent usage in top-tier tournament decks, with increasing meta presence.',
  factors: [
    { factor: 'Tournament Usage', impact: 'positive', weight: 0.4, description: 'High usage in recent YCS events' },
    { factor: 'Meta Position', impact: 'positive', weight: 0.3, description: 'Strong position in current meta' },
    { factor: 'Supply', impact: 'negative', weight: 0.2, description: 'Limited supply from original set' },
    { factor: 'Demand', impact: 'positive', weight: 0.1, description: 'High collector and player demand' }
  ],
  timeframe: '1month',
  timestamp: '2024-02-05'
  },
  '2': {
    cardId: '2',
    card: mockCards[1],
    currentPrice: 35.00,
    predictedPrice: 38.00,
    changeAmount: 3.00,
    changePercentage: 8.6,
    confidence: 0.80,
    direction: 'up',
    explanation: 'Steady demand among collectors and players.',
    factors: [
      { factor: 'Tournament Usage', impact: 'neutral', weight: 0.2, description: 'Occasional meta appearance' },
      { factor: 'Meta Position', impact: 'positive', weight: 0.3, description: 'Classic card, always relevant' },
      { factor: 'Supply', impact: 'negative', weight: 0.3, description: 'Many reprints available' },
      { factor: 'Demand', impact: 'positive', weight: 0.2, description: 'Nostalgia and collector value' }
    ],
    timeframe: '1month',
    timestamp: '2024-02-05'
  },
  '3': {
    cardId: '3',
    card: mockCards[2],
    currentPrice: 28.00,
    predictedPrice: 30.00,
    changeAmount: 2.00,
    changePercentage: 7.1,
    confidence: 0.75,
    direction: 'up',
    explanation: 'Recent meta decks have included this card.',
    factors: [
      { factor: 'Tournament Usage', impact: 'positive', weight: 0.3, description: 'Meta deck inclusion' },
      { factor: 'Meta Position', impact: 'neutral', weight: 0.2, description: 'Not always top tier' },
      { factor: 'Supply', impact: 'negative', weight: 0.3, description: 'Several reprints' },
      { factor: 'Demand', impact: 'positive', weight: 0.2, description: 'Popular with fans' }
    ],
    timeframe: '1month',
    timestamp: '2024-02-05'
  },
  '4': {
    cardId: '4',
    card: mockCards[3],
    currentPrice: 8.00,
    predictedPrice: 8.50,
    changeAmount: 0.50,
    changePercentage: 6.3,
    confidence: 0.60,
    direction: 'up',
    explanation: 'Banned status limits play, but collector demand remains.',
    factors: [
      { factor: 'Tournament Usage', impact: 'negative', weight: 0.4, description: 'Banned in all formats' },
      { factor: 'Meta Position', impact: 'neutral', weight: 0.2, description: 'Not playable' },
      { factor: 'Supply', impact: 'neutral', weight: 0.2, description: 'Many copies in circulation' },
      { factor: 'Demand', impact: 'positive', weight: 0.2, description: 'Collector interest' }
    ],
    timeframe: '1month',
    timestamp: '2024-02-05'
  },
  '5': {
    cardId: '5',
    card: mockCards[4],
    currentPrice: 14.00,
    predictedPrice: 15.00,
    changeAmount: 1.00,
    changePercentage: 7.1,
    confidence: 0.65,
    direction: 'up',
    explanation: 'Classic trap card, always in demand.',
    factors: [
      { factor: 'Tournament Usage', impact: 'neutral', weight: 0.2, description: 'Rarely played in meta' },
      { factor: 'Meta Position', impact: 'neutral', weight: 0.2, description: 'Not meta relevant' },
      { factor: 'Supply', impact: 'neutral', weight: 0.3, description: 'Many reprints' },
      { factor: 'Demand', impact: 'positive', weight: 0.3, description: 'Collector and nostalgia value' }
    ],
    timeframe: '1month',
    timestamp: '2024-02-05'
  },
  '6': {
    cardId: '6',
    card: mockCards[5],
    currentPrice: 18.00,
    predictedPrice: 19.00,
    changeAmount: 1.00,
    changePercentage: 5.6,
    confidence: 0.60,
    direction: 'up',
    explanation: 'Occasional meta use, strong stats.',
    factors: [
      { factor: 'Tournament Usage', impact: 'neutral', weight: 0.2, description: 'Sometimes played' },
      { factor: 'Meta Position', impact: 'neutral', weight: 0.2, description: 'Not a staple' },
      { factor: 'Supply', impact: 'neutral', weight: 0.3, description: 'Many reprints' },
      { factor: 'Demand', impact: 'positive', weight: 0.3, description: 'Solid stats, fan favorite' }
    ],
    timeframe: '1month',
    timestamp: '2024-02-05'
  },
}

export default function Page() {
  const params = useParams()
  const cardId = params.id as string
  const card = mockCards.find(c => c.id === cardId)

  if (!card) {
    return <div className="p-8 text-center text-red-600">Card not found.</div>
  }

  return (
    <CardDetailPage
      card={card}
      priceHistory={mockPriceHistories[cardId]}
      prediction={mockPredictions[cardId]}
    />
  )
} 