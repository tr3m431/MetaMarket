'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MagnifyingGlassIcon, FunnelIcon, HeartIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { Card } from '@/types/card'
import { useWatchlist } from '@/contexts/WatchlistContext'
import CardComponent from '@/components/CardComponent'

export default function CardsPage() {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedAttribute, setSelectedAttribute] = useState<string>('all')
  const [selectedSpellType, setSelectedSpellType] = useState<string>('all')
  const [selectedTrapType, setSelectedTrapType] = useState<string>('all')
  const [selectedMonsterType, setSelectedMonsterType] = useState<string>('all')
  const [selectedRarity, setSelectedRarity] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('name')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCards, setTotalCards] = useState(0)
  const cardsPerPage = 24
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist()

  useEffect(() => {
    async function fetchCards() {
      setLoading(true)
      try {
        const offset = (currentPage - 1) * cardsPerPage
        
        // Build query parameters for filtering
        const params = new URLSearchParams({
          limit: cardsPerPage.toString(),
          offset: offset.toString()
        })
        
        // Add filter parameters
        if (selectedType !== 'all') params.append('card_type', selectedType)
        if (selectedAttribute !== 'all') params.append('attribute', selectedAttribute)
        if (selectedSpellType !== 'all') params.append('spell_type', selectedSpellType)
        if (selectedTrapType !== 'all') params.append('trap_type', selectedTrapType)
        if (selectedMonsterType !== 'all') params.append('monster_type', selectedMonsterType)
        if (selectedRarity !== 'all') params.append('rarity', selectedRarity)
        if (searchQuery.trim()) params.append('search', searchQuery.trim())
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cards?${params.toString()}`)
        if (!res.ok) throw new Error('Failed to fetch cards')
        const data = await res.json()
        setCards(Array.isArray(data.cards) ? data.cards : [])
        setTotalCards(typeof data.total === 'number' ? data.total : 0)
        setTotalPages(Math.max(1, Math.ceil((typeof data.total === 'number' ? data.total : 0) / cardsPerPage)))
      } catch (err) {
        setCards([])
        setTotalCards(0)
        setTotalPages(1)
      } finally {
        setLoading(false)
      }
    }
    fetchCards()
  }, [currentPage, selectedType, selectedAttribute, selectedSpellType, selectedTrapType, selectedMonsterType, selectedRarity, searchQuery])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedType, selectedAttribute, selectedSpellType, selectedTrapType, selectedMonsterType, selectedRarity, searchQuery])

  // Sort cards (filtering is now handled by backend)
  const sortedCards = Array.isArray(cards)
    ? [...cards].sort((a, b) => {
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
    : [];

  const handleWatchlistToggle = (card: Card) => {
    if (isInWatchlist(card.id)) {
      removeFromWatchlist(card.id)
    } else {
      addToWatchlist(card)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Dynamic filter options based on card type
  const getCardTypeOptions = () => {
    return [
      { value: 'all', label: 'All Types' },
      { value: 'Normal Monster', label: 'Normal Monster' },
      { value: 'Effect Monster', label: 'Effect Monster' },
      { value: 'Ritual Monster', label: 'Ritual Monster' },
      { value: 'Fusion Monster', label: 'Fusion Monster' },
      { value: 'Synchro Monster', label: 'Synchro Monster' },
      { value: 'XYZ Monster', label: 'XYZ Monster' },
      { value: 'Link Monster', label: 'Link Monster' },
      { value: 'Pendulum Monster', label: 'Pendulum Monster' },
      { value: 'Spell Card', label: 'Spell Card' },
      { value: 'Trap Card', label: 'Trap Card' }
    ]
  }

  const getAttributeOptions = () => {
    // Only show attributes for monster cards
    if (selectedType === 'all' || selectedType.includes('Monster')) {
      return [
        { value: 'all', label: 'All Attributes' },
        { value: 'LIGHT', label: 'LIGHT' },
        { value: 'DARK', label: 'DARK' },
        { value: 'EARTH', label: 'EARTH' },
        { value: 'WATER', label: 'WATER' },
        { value: 'FIRE', label: 'FIRE' },
        { value: 'WIND', label: 'WIND' },
        { value: 'DIVINE', label: 'DIVINE' }
      ]
    }
    return []
  }

  const getSpellTypeOptions = () => {
    // Only show spell types for spell cards
    if (selectedType === 'Spell Card') {
      return [
        { value: 'all', label: 'All Spell Types' },
        { value: 'Normal', label: 'Normal' },
        { value: 'Continuous', label: 'Continuous' },
        { value: 'Quick-Play', label: 'Quick-Play' },
        { value: 'Field', label: 'Field' },
        { value: 'Equip', label: 'Equip' },
        { value: 'Ritual', label: 'Ritual' }
      ]
    }
    return []
  }

  const getTrapTypeOptions = () => {
    // Only show trap types for trap cards
    if (selectedType === 'Trap Card') {
      return [
        { value: 'all', label: 'All Trap Types' },
        { value: 'Normal', label: 'Normal' },
        { value: 'Continuous', label: 'Continuous' },
        { value: 'Counter', label: 'Counter' }
      ]
    }
    return []
  }

  const getMonsterTypeOptions = () => {
    // Show monster types for all monster cards (including effect monsters)
    if (selectedType === 'all' || selectedType.includes('Monster')) {
      return [
        { value: 'all', label: 'All Monster Types' },
        { value: 'Aqua', label: 'Aqua' },
        { value: 'Beast', label: 'Beast' },
        { value: 'Beast-Warrior', label: 'Beast-Warrior' },
        { value: 'Creator-God', label: 'Creator-God' },
        { value: 'Cyberse', label: 'Cyberse' },
        { value: 'Dinosaur', label: 'Dinosaur' },
        { value: 'Divine-Beast', label: 'Divine-Beast' },
        { value: 'Dragon', label: 'Dragon' },
        { value: 'Fairy', label: 'Fairy' },
        { value: 'Fiend', label: 'Fiend' },
        { value: 'Fish', label: 'Fish' },
        { value: 'Insect', label: 'Insect' },
        { value: 'Machine', label: 'Machine' },
        { value: 'Plant', label: 'Plant' },
        { value: 'Psychic', label: 'Psychic' },
        { value: 'Pyro', label: 'Pyro' },
        { value: 'Reptile', label: 'Reptile' },
        { value: 'Rock', label: 'Rock' },
        { value: 'Sea Serpent', label: 'Sea Serpent' },
        { value: 'Spellcaster', label: 'Spellcaster' },
        { value: 'Thunder', label: 'Thunder' },
        { value: 'Warrior', label: 'Warrior' },
        { value: 'Winged Beast', label: 'Winged Beast' },
        { value: 'Wyrm', label: 'Wyrm' },
        { value: 'Zombie', label: 'Zombie' }
      ]
    }
    return []
  }

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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Card Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => {
                      setSelectedType(e.target.value)
                      // Reset sub-type filters when card type changes
                      setSelectedAttribute('all')
                      setSelectedSpellType('all')
                      setSelectedTrapType('all')
                      setSelectedMonsterType('all')
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {getCardTypeOptions().map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* Attribute filter - only for monsters */}
                {getAttributeOptions().length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Attribute</label>
                    <select
                      value={selectedAttribute}
                      onChange={(e) => setSelectedAttribute(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {getAttributeOptions().map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Monster Type filter - only for monsters */}
                {getMonsterTypeOptions().length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Monster Type</label>
                    <select
                      value={selectedMonsterType}
                      onChange={(e) => setSelectedMonsterType(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {getMonsterTypeOptions().map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Spell Type filter - only for spells */}
                {getSpellTypeOptions().length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Spell Type</label>
                    <select
                      value={selectedSpellType}
                      onChange={(e) => setSelectedSpellType(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {getSpellTypeOptions().map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Trap Type filter - only for traps */}
                {getTrapTypeOptions().length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trap Type</label>
                    <select
                      value={selectedTrapType}
                      onChange={(e) => setSelectedTrapType(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {getTrapTypeOptions().map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rarity</label>
                  <select
                    value={selectedRarity}
                    onChange={(e) => setSelectedRarity(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Rarities</option>
                    <option value="Common">Common</option>
                    <option value="Rare">Rare</option>
                    <option value="Super Rare">Super Rare</option>
                    <option value="Ultra Rare">Ultra Rare</option>
                    <option value="Secret Rare">Secret Rare</option>
                    <option value="Ultimate Rare">Ultimate Rare</option>
                    <option value="Unknown">Unknown/Empty</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {sortedCards.length} of {totalCards} cards (Page {currentPage} of {totalPages})
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading cards...</p>
          </div>
        )}

        {/* Cards Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedCards.map((card) => (
              <div key={card.id} className="flex flex-col h-full">
                <CardComponent card={card}>
                  <div className="flex w-full gap-2 mt-4">
                    <Link
                      href={`/cards/${card.id}`}
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-center text-sm"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => {
                        if (isInWatchlist(card.id)) {
                          removeFromWatchlist(card.id)
                        } else {
                          addToWatchlist(card)
                        }
                      }}
                      disabled={false}
                      className={`p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition-colors flex items-center justify-center ${isInWatchlist(card.id) ? 'text-red-500' : 'text-gray-400'}`}
                    >
                      {isInWatchlist(card.id) ? (
                        <HeartSolidIcon className="h-5 w-5" />
                      ) : (
                        <HeartIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </CardComponent>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="h-4 w-4 mr-1" />
              Previous
            </button>

            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                if (page > totalPages) return null
                
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRightIcon className="h-4 w-4 ml-1" />
            </button>
          </div>
        )}

        {/* No Results */}
        {!loading && sortedCards.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No cards found matching your criteria.</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  )
} 