'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MagnifyingGlassIcon, ArrowTrendingUpIcon, ChartBarIcon, BellIcon } from '@heroicons/react/24/outline'
import { Card } from '@/types/card'

// Mock data for demonstration
const trendingCards: Card[] = [
  {
    id: '1',
    name: 'Blue-Eyes White Dragon',
    type: 'Normal Monster',
    attribute: 'LIGHT',
    level: 8,
    race: 'Dragon',
    attack: 3000,
    defense: 2500,
    description: 'This legendary dragon is a powerful engine of destruction. Virtually invincible, very few have faced this awesome creature and lived to tell the tale.',
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
  }
]

const recentTournaments = [
  {
    id: '1',
    name: 'YCS Las Vegas 2024',
    date: '2024-01-15',
    location: 'Las Vegas, NV',
    format: 'Advanced',
    size: 1024,
    winner: 'Joshua Schmidt',
    winningDeck: 'Kashtira'
  },
  {
    id: '2',
    name: 'YCS Chicago 2024',
    date: '2024-01-08',
    location: 'Chicago, IL',
    format: 'Advanced',
    size: 856,
    winner: 'Michael Zhang',
    winningDeck: 'Labrynth'
  },
  {
    id: '3',
    name: 'YCS Dallas 2024',
    date: '2024-01-01',
    location: 'Dallas, TX',
    format: 'Advanced',
    size: 724,
    winner: 'Sarah Johnson',
    winningDeck: 'Purrley'
  }
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would navigate to search results
    console.log('Searching for:', searchQuery)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Yu-Gi-Oh! Card Value Tracker
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Track prices, analyze meta trends, and predict card values with AI-powered insights
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for a card..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <MagnifyingGlassIcon className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Features for Card Investors
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to make informed decisions about your Yu-Gi-Oh! card investments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <ArrowTrendingUpIcon className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Price Tracking</h3>
              <p className="text-gray-600">
                Track card prices across multiple vendors with historical data and price alerts.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <ChartBarIcon className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Meta Analysis</h3>
              <p className="text-gray-600">
                Analyze tournament data to understand card usage trends and meta shifts.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <BellIcon className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Predictions</h3>
              <p className="text-gray-600">
                Get AI-powered price predictions based on meta trends and market data.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Cards Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Trending Cards</h2>
            <Link href="/cards" className="text-blue-600 hover:text-blue-700 font-medium">
              View All Cards →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingCards.map((card) => (
              <div key={card.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Card</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{card.name}</h3>
                    <p className="text-sm text-gray-600">{card.type}</p>
                    <p className="text-sm text-gray-500">{card.set}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-green-600">$45.99</span>
                  <span className="text-sm text-green-600">+12.5%</span>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Link
                    href={`/cards/${card.id}`}
                    className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    View Details
                  </Link>
                  <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                    Watch
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Tournaments Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Recent Tournaments</h2>
            <Link href="/events" className="text-blue-600 hover:text-blue-700 font-medium">
              View All Events →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentTournaments.map((tournament) => (
              <div key={tournament.id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{tournament.name}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>{tournament.date} • {tournament.location}</p>
                  <p>{tournament.format} Format • {tournament.size} Players</p>
                  <p className="font-medium text-gray-900">
                    Winner: {tournament.winner} ({tournament.winningDeck})
                  </p>
                </div>
                <Link
                  href={`/events/${tournament.id}`}
                  className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  View Results
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Start Tracking Your Cards Today
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of Yu-Gi-Oh! players making smarter investment decisions
          </p>
          <div className="space-x-4">
            <Link
              href="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/cards"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Browse Cards
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 