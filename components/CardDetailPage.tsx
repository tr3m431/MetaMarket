"use client"

import { useState } from 'react'
import { HeartIcon, ShareIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { Card, PriceHistory, PricePrediction } from '@/types/card'
import { useWatchlist } from '@/contexts/WatchlistContext'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts'
import { mockTournaments } from '@/types/mockTournaments'

interface CardDetailPageProps {
  card: Card
  priceHistory: PriceHistory
  prediction: PricePrediction
}

function getCardUsageStats(cardId: string) {
  let deckCount = 0
  let tournamentSet = new Set<string>()
  let placements: number[] = []
  let usageDetails: { tournament: string, player: string, placement: number, deckType: string }[] = []
  for (const t of mockTournaments) {
    for (const deck of t.decklists) {
      const inDeck = [...deck.mainDeck, ...deck.extraDeck, ...deck.sideDeck].some(dc => dc.cardId === cardId)
      if (inDeck) {
        deckCount++
        tournamentSet.add(t.name)
        placements.push(deck.placement)
        usageDetails.push({ tournament: t.name, player: deck.player, placement: deck.placement, deckType: deck.deckType })
      }
    }
  }
  const avgPlacement = placements.length ? (placements.reduce((a, b) => a + b, 0) / placements.length).toFixed(2) : 'N/A'
  return {
    deckCount,
    tournamentCount: tournamentSet.size,
    avgPlacement,
    usageDetails
  }
}

export default function CardDetailPage({ card, priceHistory, prediction }: CardDetailPageProps) {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist()
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1week' | '1month' | '3months' | '6months'>('1month')
  const [selectedVendor, setSelectedVendor] = useState<'TCGPlayer' | 'Cardmarket' | 'YugiohPrices'>('TCGPlayer')

  const handleWatchlistToggle = () => {
    if (isInWatchlist(card.id)) {
      removeFromWatchlist(card.id)
    } else {
      addToWatchlist(card)
    }
  }

  const formatPrice = (price: number) => `$${price.toFixed(2)}`
  const formatPercentage = (percentage: number) => `${percentage > 0 ? '+' : ''}${percentage.toFixed(1)}%`

  const usageStats = getCardUsageStats(card.id)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb should be handled by the page */}
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
                      <ArrowTrendingUpIcon className="h-5 w-5 text-green-600" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-5 w-5 text-red-600" />
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

            {/* Tournament Usage Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Tournament Usage</h2>
              <div className="mb-2 text-gray-700">
                Used in <span className="font-semibold">{usageStats.deckCount}</span> deck(s) across <span className="font-semibold">{usageStats.tournamentCount}</span> tournament(s).<br/>
                Average placement: <span className="font-semibold">{usageStats.avgPlacement}</span>
              </div>
              {usageStats.usageDetails.length > 0 ? (
                <table className="min-w-full bg-white rounded-lg shadow mb-4">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Tournament</th>
                      <th className="px-4 py-2">Player</th>
                      <th className="px-4 py-2">Placement</th>
                      <th className="px-4 py-2">Deck Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usageStats.usageDetails.map((u, i) => (
                      <tr key={i} className="border-t">
                        <td className="px-4 py-2">{u.tournament}</td>
                        <td className="px-4 py-2">{u.player}</td>
                        <td className="px-4 py-2">{u.placement}</td>
                        <td className="px-4 py-2">{u.deckType}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-gray-500">This card has not appeared in any tournament decks yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 