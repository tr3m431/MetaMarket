'use client'

import { useState } from 'react'
import { useWatchlist } from '@/contexts/WatchlistContext'
import { useAuth } from '@/contexts/AuthContext'
import { TrashIcon, BellIcon, BellSlashIcon, EyeIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function WatchlistPage() {
  const { watchlist, removeFromWatchlist, updateAlertSettings } = useWatchlist()
  const { user } = useAuth()
  const [filter, setFilter] = useState<'all' | 'alerts'>('all')

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign in to view your watchlist</h2>
          <p className="text-gray-600 mb-6">Create an account or sign in to start tracking your favorite cards.</p>
          <Link href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  const filteredWatchlist = filter === 'alerts' 
    ? watchlist.filter(item => item.alertPrice) 
    : watchlist

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Watchlist</h1>
          <p className="text-gray-600">Track your favorite cards and set price alerts</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <EyeIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Cards</p>
                <p className="text-2xl font-bold text-gray-900">{watchlist.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <BellIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {watchlist.filter(item => item.alertPrice).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-bold">$</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">$0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === 'all' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All Cards ({watchlist.length})
                </button>
                <button
                  onClick={() => setFilter('alerts')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === 'alerts' 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  With Alerts ({watchlist.filter(item => item.alertPrice).length})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Watchlist Items */}
        {filteredWatchlist.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <EyeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'alerts' ? 'No alerts set' : 'No cards in watchlist'}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'alerts' 
                ? 'Set price alerts on your watched cards to get notified when prices change.'
                : 'Start adding cards to your watchlist to track their prices and set alerts.'
              }
            </p>
            <Link href="/cards" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Browse Cards
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWatchlist.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={item.card.imageUrl}
                    alt={item.card.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {item.card.name}
                      </h3>
                      <p className="text-sm text-gray-600">{item.card.set}</p>
                    </div>
                    <button
                      onClick={() => removeFromWatchlist(item.cardId)}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Current Price:</span>
                      <span className="font-medium">$25.00</span>
                    </div>

                    {item.alertPrice && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Alert Price:</span>
                        <span className="font-medium text-green-600">
                          ${item.alertPrice}
                          {item.alertDirection === 'up' ? ' ↑' : ' ↓'}
                        </span>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Link
                        href={`/cards/${item.cardId}`}
                        className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => updateAlertSettings(item.cardId)}
                        className={`p-2 rounded-lg transition-colors ${
                          item.alertPrice
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {item.alertPrice ? <BellIcon className="h-4 w-4" /> : <BellSlashIcon className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 