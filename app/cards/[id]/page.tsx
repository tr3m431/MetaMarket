'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { HeartIcon, ShareIcon, TrendingUpIcon, TrendingDownIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { Card, PriceHistory, CardUsage, PricePrediction } from '@/types/card'
import { useWatchlist } from '@/contexts/WatchlistContext'

// Mock data - in a real app, this would come from an API
const mockCard: Card = {
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
}

const mockPriceHistory: PriceHistory = {
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
}

const mockUsageData = [
  { tournament: 'YCS Las Vegas', usage: 15, placement: 2 },
  { tournament: 'YCS Chicago', usage: 12, placement: 4 },
  { tournament: 'YCS Dallas', usage: 18, placement: 1 },
  { tournament: 'YCS Orlando', usage: 14, placement: 3 },
  { tournament: 'YCS Seattle', usage: 16, placement: 2 },
]

const mockPrediction: PricePrediction = {
  cardId: '1',
  card: mockCard,
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
}

export default function CardDetailPage() {
  const params = useParams()
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist()
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1week' | '1month' | '3months' | '6months'>('1month')
  const [selectedVendor, setSelectedVendor] = useState<'TCGPlayer' | 'Cardmarket' | 'YugiohPrices'>('TCGPlayer')

  const card = mockCard // In real app, fetch by params.id
  const priceHistory = mockPriceHistory
  const prediction = mockPrediction

  const handleWatchlistToggle = () => {
    if (isInWatchlist(card.id)) {
      removeFromWatchlist(card.id)
    } else {
      addToWatchlist(card)
    }
  }

  const formatPrice = (price: number) => `$${price.toFixed(2)}`
  const formatPercentage = (percentage: number) => `${percentage > 0 ? '+' : ''}${percentage.toFixed(1)}%`

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <a href="/" className="hover:text-gray-700">Home</a>
          <span>/</span>
          <a href="/cards" className="hover:text-gray-700">Cards</a>
          <span>/</span>
          <span className="text-gray-900">{card.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Card Image */}
              <div className="aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-500">Card Image</span>
              </div>

              {/* Card Details */}
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{card.name}</h1>
                  <p className="text-gray-600">{card.type}</p>
                </div>

                {card.attribute && (
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-500">Attribute:</span>
                    <span className="font-medium">{card.attribute}</span>
                    {card.level && (
                      <>
                        <span className="text-gray-500">Level:</span>
                        <span className="font-medium">{card.level}</span>
                      </>
                    )}
                  </div>
                )}

                {card.race && (
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-500">Type:</span>
                    <span className="font-medium">{card.race}</span>
                  </div>
                )}

                {card.attack && (
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-500">ATK:</span>
                    <span className="font-medium">{card.attack}</span>
                    {card.defense && (
                      <>
                        <span className="text-gray-500">DEF:</span>
                        <span className="font-medium">{card.defense}</span>
                      </>
                    )}
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-700 leading-relaxed">{card.description}</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Set:</span>
                    <span className="font-medium">{card.set}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Rarity:</span>
                    <span className="font-medium">{card.rarity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Card Number:</span>
                    <span className="font-medium">{card.setCode}-{card.cardNumber}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleWatchlistToggle}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-colors ${
                      isInWatchlist(card.id)
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {isInWatchlist(card.id) ? (
                      <HeartSolidIcon className="h-5 w-5" />
                    ) : (
                      <HeartIcon className="h-5 w-5" />
                    )}
                    <span>{isInWatchlist(card.id) ? 'Watching' : 'Add to Watchlist'}</span>
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <ShareIcon className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Charts and Analysis */}
          <div className="lg:col-span-2 space-y-8">
            {/* Price Prediction */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Price Prediction</h2>
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedTimeframe}
                    onChange={(e) => setSelectedTimeframe(e.target.value as any)}
                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                  >
                    <option value="1week">1 Week</option>
                    <option value="1month">1 Month</option>
                    <option value="3months">3 Months</option>
                    <option value="6months">6 Months</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Current Price</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(prediction.currentPrice)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Predicted Price</p>
                  <p className="text-2xl font-bold text-green-600">{formatPrice(prediction.predictedPrice)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Change</p>
                  <div className="flex items-center justify-center space-x-1">
                    {prediction.direction === 'up' ? (
                      <TrendingUpIcon className="h-5 w-5 text-green-600" />
                    ) : (
                      <TrendingDownIcon className="h-5 w-5 text-red-600" />
                    )}
                    <span className={`text-xl font-bold ${prediction.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercentage(prediction.changePercentage)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900 font-medium mb-2">Prediction Explanation</p>
                <p className="text-sm text-blue-700">{prediction.explanation}</p>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Factors</h3>
                <div className="space-y-3">
                  {prediction.factors.map((factor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{factor.factor}</p>
                        <p className="text-sm text-gray-600">{factor.description}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          factor.impact === 'positive' ? 'bg-green-100 text-green-800' :
                          factor.impact === 'negative' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {factor.impact}
                        </span>
                        <p className="text-sm text-gray-500 mt-1">Weight: {(factor.weight * 100).toFixed(0)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Price History Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Price History</h2>
                <select
                  value={selectedVendor}
                  onChange={(e) => setSelectedVendor(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                >
                  <option value="TCGPlayer">TCGPlayer</option>
                  <option value="Cardmarket">Cardmarket</option>
                  <option value="YugiohPrices">YugiohPrices</option>
                </select>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceHistory.prices}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis 
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value: number) => [`$${value}`, 'Price']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Tournament Usage */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Tournament Usage</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage by Tournament</h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mockUsageData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="tournament" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="usage" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Placement</h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mockUsageData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="tournament" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="placement" fill="#10B981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 