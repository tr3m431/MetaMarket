'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, MinusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Card, PricePrediction } from '@/types/card'

// Mock data for predictions
const mockPredictions: PricePrediction[] = [
  {
    cardId: '1',
    card: {
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
    currentPrice: 52.00,
    predictedPrice: 58.50,
    changeAmount: 6.50,
    changePercentage: 12.5,
    confidence: 0.85,
    direction: 'up',
    explanation: 'Consistent usage in top-tier decks and meta presence.',
    factors: [],
    timeframe: '1month',
    timestamp: '2024-02-05'
  },
  {
    cardId: '2',
    card: {
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
    currentPrice: 35.00,
    predictedPrice: 33.00,
    changeAmount: -2.00,
    changePercentage: -5.7,
    confidence: 0.72,
    direction: 'down',
    explanation: 'Recent reprint and lower meta usage.',
    factors: [],
    timeframe: '1month',
    timestamp: '2024-02-05'
  },
  {
    cardId: '3',
    card: {
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
    currentPrice: 28.00,
    predictedPrice: 28.00,
    changeAmount: 0.00,
    changePercentage: 0.0,
    confidence: 0.65,
    direction: 'stable',
    explanation: 'Stable demand and supply, no major meta shifts.',
    factors: [],
    timeframe: '1month',
    timestamp: '2024-02-05'
  }
]

const formatPrice = (price: number) => `$${price.toFixed(2)}`
const formatPercentage = (percentage: number) => `${percentage > 0 ? '+' : ''}${percentage.toFixed(1)}%`

export default function PredictionsPage() {
  const [search, setSearch] = useState('')
  const [direction, setDirection] = useState<'all' | 'up' | 'down' | 'stable'>('all')

  const filtered = mockPredictions.filter(pred => {
    const matchesSearch = pred.card.name.toLowerCase().includes(search.toLowerCase())
    const matchesDirection = direction === 'all' || pred.direction === direction
    return matchesSearch && matchesDirection
  })

  const getDirectionIcon = (dir: string) => {
    if (dir === 'up') return <ArrowTrendingUpIcon className="h-5 w-5 text-green-600" />
    if (dir === 'down') return <ArrowTrendingDownIcon className="h-5 w-5 text-red-600" />
    return <MinusIcon className="h-5 w-5 text-gray-400" />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Card Price Predictions</h1>
          <p className="text-gray-600">AI-powered price forecasts for Yu-Gi-Oh! cards</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search cards..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Direction:</label>
            <select
              value={direction}
              onChange={e => setDirection(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="up">Up</option>
              <option value="down">Down</option>
              <option value="stable">Stable</option>
            </select>
          </div>
        </div>

        {/* Predictions List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(pred => (
            <div key={pred.cardId} className="bg-white rounded-lg shadow-md p-6 flex flex-col">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Card</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">{pred.card.name}</h3>
                  <p className="text-sm text-gray-600">{pred.card.type}</p>
                  <p className="text-xs text-gray-500">{pred.card.set}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                {getDirectionIcon(pred.direction)}
                <span className={`text-lg font-bold ${pred.direction === 'up' ? 'text-green-600' : pred.direction === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                  {formatPercentage(pred.changePercentage)}
                </span>
                <span className="text-sm text-gray-500">({pred.confidence * 100}% confidence)</span>
              </div>
              <div className="flex items-center space-x-4 mb-2">
                <span className="text-sm text-gray-500">Current:</span>
                <span className="text-base font-semibold text-gray-900">{formatPrice(pred.currentPrice)}</span>
                <span className="text-sm text-gray-500">→</span>
                <span className="text-base font-semibold text-blue-600">{formatPrice(pred.predictedPrice)}</span>
              </div>
              <div className="text-sm text-blue-700 mb-4">{pred.explanation}</div>
              <div className="mt-auto">
                <Link
                  href={`/cards/${pred.cardId}`}
                  className="inline-block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  View Card
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No predictions found matching your criteria.</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  )
} 