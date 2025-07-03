'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MagnifyingGlassIcon, FunnelIcon, HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { Card } from '@/types/card'
import { useWatchlist } from '@/contexts/WatchlistContext'

// Mock data - in a real app, this would come from an API
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

export default function CardsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedAttribute, setSelectedAttribute] = useState<string>('all')
  const [selectedRarity, setSelectedRarity] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('name')
  const [showFilters, setShowFilters] = useState(false)
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist()

  // Filter and sort cards
  const filteredCards = mockCards
    .filter(card => {
      const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           card.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = selectedType === 'all' || card.type === selectedType
      const matchesAttribute = selectedAttribute === 'all' || card.attribute === selectedAttribute
      const matchesRarity = selectedRarity === 'all' || card.rarity === selectedRarity
      
      return matchesSearch && matchesType && matchesAttribute && matchesRarity
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'type':
          return a.type.localeCompare(b.type)
        case 'rarity':
          return a.rarity.localeCompare(b.rarity)
        case 'set':
          return a.set.localeCompare(b.set)
        default:
          return 0
      }
    })

  const handleWatchlistToggle = (card: Card) => {
    if (isInWatchlist(card.id)) {
      removeFromWatchlist(card.id)
    } else {
      addToWatchlist(card)
    }
  }

  const cardTypes = ['Normal Monster', 'Effect Monster', 'Ritual Monster', 'Fusion Monster', 'Synchro Monster', 'XYZ Monster', 'Link Monster', 'Pendulum Monster', 'Spell Card', 'Trap Card']
  const attributes = ['LIGHT', 'DARK', 'EARTH', 'WATER', 'FIRE', 'WIND', 'DIVINE']
  const rarities = ['Common', 'Rare', 'Super Rare', 'Ultra Rare', 'Secret Rare', 'Ultimate Rare']

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Yu-Gi-Oh! Cards</h1>
          <p className="text-gray-600">Browse and track your favorite cards</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search cards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Sort by Name</option>
                <option value="type">Sort by Type</option>
                <option value="rarity">Sort by Rarity</option>
                <option value="set">Sort by Set</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FunnelIcon className="h-4 w-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Card Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Types</option>
                    {cardTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Attribute</label>
                  <select
                    value={selectedAttribute}
                    onChange={(e) => setSelectedAttribute(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Attributes</option>
                    {attributes.map(attr => (
                      <option key={attr} value={attr}>{attr}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rarity</label>
                  <select
                    value={selectedRarity}
                    onChange={(e) => setSelectedRarity(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Rarities</option>
                    {rarities.map(rarity => (
                      <option key={rarity} value={rarity}>{rarity}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredCards.length} of {mockCards.length} cards
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCards.map((card) => (
            <div key={card.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Card Image */}
              <div className="aspect-square bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-sm">Card Image</span>
              </div>

              {/* Card Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">{card.name}</h3>
                  <button
                    onClick={() => handleWatchlistToggle(card)}
                    className="flex-shrink-0 ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    {isInWatchlist(card.id) ? (
                      <HeartSolidIcon className="h-5 w-5 text-red-500" />
                    ) : (
                      <HeartIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <p className="text-sm text-gray-600 mb-2">{card.type}</p>
                
                {card.attribute && (
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                    <span>{card.attribute}</span>
                    {card.level && <span>Level {card.level}</span>}
                  </div>
                )}

                {card.attack && (
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                    <span>ATK: {card.attack}</span>
                    {card.defense && <span>DEF: {card.defense}</span>}
                  </div>
                )}

                <p className="text-xs text-gray-600 line-clamp-2 mb-3">{card.description}</p>

                <div className="space-y-1 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>Set:</span>
                    <span className="font-medium">{card.set}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rarity:</span>
                    <span className="font-medium">{card.rarity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Number:</span>
                    <span className="font-medium">{card.setCode}-{card.cardNumber}</span>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {card.isBanned && (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      Banned
                    </span>
                  )}
                  {card.isLimited && (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Limited
                    </span>
                  )}
                  {card.isSemiLimited && (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                      Semi-Limited
                    </span>
                  )}
                  {card.isReprint && (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      Reprint
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 flex space-x-2">
                  <Link
                    href={`/cards/${card.id}`}
                    className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCards.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No cards found matching your criteria.</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  )
} 