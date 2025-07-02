'use client'

import { useState } from 'react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, ChartBarIcon, UsersIcon } from '@heroicons/react/24/outline'

// Mock data for meta analysis
const topDecks = [
  { name: 'Kashtira', usage: 18.5, winRate: 62.3, topCutRate: 45.2, trend: 'up' },
  { name: 'Labrynth', usage: 15.2, winRate: 58.7, topCutRate: 38.9, trend: 'stable' },
  { name: 'Purrley', usage: 12.8, winRate: 55.4, topCutRate: 32.1, trend: 'down' },
  { name: 'Swordsoul', usage: 10.3, winRate: 61.2, topCutRate: 28.7, trend: 'up' },
  { name: 'Branded', usage: 8.9, winRate: 53.8, topCutRate: 25.4, trend: 'down' },
  { name: 'Spright', usage: 7.2, winRate: 59.1, topCutRate: 22.3, trend: 'stable' },
]

const cardUsageData = [
  { card: 'Ash Blossom & Joyous Spring', usage: 85.2, decks: 12, trend: 'up' },
  { card: 'Infinite Impermanence', usage: 78.9, decks: 10, trend: 'stable' },
  { card: 'Called by the Grave', usage: 72.4, decks: 8, trend: 'down' },
  { card: 'Nibiru, the Primal Being', usage: 68.7, decks: 9, trend: 'up' },
  { card: 'Effect Veiler', usage: 65.3, decks: 7, trend: 'stable' },
  { card: 'Ghost Belle & Haunted Mansion', usage: 58.9, decks: 6, trend: 'down' },
]

const matchupData = [
  { deck1: 'Kashtira', deck2: 'Labrynth', winRate: 65.2, games: 45 },
  { deck1: 'Kashtira', deck2: 'Purrley', winRate: 58.7, games: 38 },
  { deck1: 'Labrynth', deck2: 'Purrley', winRate: 52.3, games: 42 },
  { deck1: 'Swordsoul', deck2: 'Kashtira', winRate: 48.9, games: 35 },
  { deck1: 'Branded', deck2: 'Labrynth', winRate: 44.7, games: 28 },
  { deck1: 'Spright', deck2: 'Purrley', winRate: 61.2, games: 31 },
]

const metaTrends = [
  { date: '2024-01-01', kashtira: 15.2, labrynth: 12.8, purrley: 14.5 },
  { date: '2024-01-08', kashtira: 16.8, labrynth: 13.2, purrley: 13.8 },
  { date: '2024-01-15', kashtira: 18.5, labrynth: 15.2, purrley: 12.8 },
  { date: '2024-01-22', kashtira: 19.2, labrynth: 16.1, purrley: 11.9 },
  { date: '2024-01-29', kashtira: 20.1, labrynth: 17.3, purrley: 10.8 },
  { date: '2024-02-05', kashtira: 21.5, labrynth: 18.9, purrley: 9.7 },
]

const formatPercentage = (value: number) => `${value.toFixed(1)}%`
const formatWinRate = (value: number) => `${value.toFixed(1)}%`

export default function MetaPage() {
  const [selectedDeck, setSelectedDeck] = useState<string>('all')
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1week' | '1month' | '3months'>('1month')

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />
    if (trend === 'down') return <ArrowTrendingDownIcon className="h-4 w-4 text-red-600" />
    return <ChartBarIcon className="h-4 w-4 text-gray-600" />
  }

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-green-600'
    if (trend === 'down') return 'text-red-600'
    return 'text-gray-600'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meta Analysis</h1>
          <p className="text-gray-600">Analyze deck usage, card trends, and tournament performance</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deck Filter</label>
                <select
                  value={selectedDeck}
                  onChange={(e) => setSelectedDeck(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Decks</option>
                  {topDecks.map(deck => (
                    <option key={deck.name} value={deck.name}>{deck.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Timeframe</label>
                <select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1week">Last Week</option>
                  <option value="1month">Last Month</option>
                  <option value="3months">Last 3 Months</option>
                </select>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <UsersIcon className="h-4 w-4" />
              <span>Based on 1,247 tournament results</span>
            </div>
          </div>
        </div>

        {/* Top Decks Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Top Decks</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Usage Chart */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Deck Usage</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topDecks}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value: number) => [`${value}%`, 'Usage']} />
                    <Bar dataKey="usage" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Win Rate Chart */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Win Rates</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topDecks}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value: number) => [`${value}%`, 'Win Rate']} />
                    <Bar dataKey="winRate" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Deck Table */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Stats</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deck
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Win Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Top Cut Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topDecks.map((deck) => (
                    <tr key={deck.name} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{deck.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPercentage(deck.usage)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatWinRate(deck.winRate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPercentage(deck.topCutRate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          {getTrendIcon(deck.trend)}
                          <span className={`text-sm font-medium ${getTrendColor(deck.trend)}`}>
                            {deck.trend === 'up' ? 'Rising' : deck.trend === 'down' ? 'Declining' : 'Stable'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Card Usage Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Most Used Cards</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Usage Chart */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Card Usage</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cardUsageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="card" />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value: number) => [`${value}%`, 'Usage']} />
                    <Bar dataKey="usage" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Card Table */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Card Details</h3>
              <div className="space-y-3">
                {cardUsageData.map((card) => (
                  <div key={card.card} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{card.card}</p>
                      <p className="text-sm text-gray-600">Used in {card.decks} decks</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatPercentage(card.usage)}</p>
                      <div className="flex items-center space-x-1">
                        {getTrendIcon(card.trend)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Meta Trends Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Meta Trends</h2>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metaTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number) => [`${value}%`, 'Usage']}
                />
                <Line 
                  type="monotone" 
                  dataKey="kashtira" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Kashtira"
                />
                <Line 
                  type="monotone" 
                  dataKey="labrynth" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Labrynth"
                />
                <Line 
                  type="monotone" 
                  dataKey="purrley" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  name="Purrley"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Matchup Analysis */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Deck Matchups</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchupData.map((matchup, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-center flex-1">
                    <p className="font-medium text-gray-900">{matchup.deck1}</p>
                  </div>
                  <div className="text-center mx-2">
                    <p className="text-sm text-gray-500">vs</p>
                  </div>
                  <div className="text-center flex-1">
                    <p className="font-medium text-gray-900">{matchup.deck2}</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{formatWinRate(matchup.winRate)}</p>
                  <p className="text-sm text-gray-600">Win Rate ({matchup.games} games)</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 