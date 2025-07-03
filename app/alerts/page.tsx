'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useWatchlist } from '@/contexts/WatchlistContext'
import { BellIcon, BellSlashIcon, TrashIcon, PlusIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function AlertsPage() {
  const { user } = useAuth()
  const { watchlist, updateAlertSettings, removeFromWatchlist } = useWatchlist()
  const [showAlertForm, setShowAlertForm] = useState(false)
  const [selectedCard, setSelectedCard] = useState<string>('')
  const [alertPrice, setAlertPrice] = useState('')
  const [alertDirection, setAlertDirection] = useState<'up' | 'down'>('down')

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign in to manage alerts</h2>
          <p className="text-gray-600 mb-6">Create an account or sign in to set up price alerts.</p>
          <Link href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  const cardsWithAlerts = watchlist.filter(item => item.alertPrice)
  const cardsWithoutAlerts = watchlist.filter(item => !item.alertPrice)

  const handleCreateAlert = () => {
    if (selectedCard && alertPrice) {
      const card = watchlist.find(item => item.cardId === selectedCard)
      if (card) {
        updateAlertSettings(selectedCard, parseFloat(alertPrice), alertDirection)
        setShowAlertForm(false)
        setSelectedCard('')
        setAlertPrice('')
        setAlertDirection('down')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Price Alerts</h1>
              <p className="text-gray-600">Manage your price alerts and notifications</p>
            </div>
            <button
              onClick={() => setShowAlertForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>New Alert</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <BellIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{cardsWithAlerts.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Triggered Today</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold">↓</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Price Drops</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 font-bold">↑</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Price Rises</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
            </div>
          </div>
        </div>

        {/* Create Alert Form */}
        {showAlertForm && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Create New Alert</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Card</label>
                  <select
                    value={selectedCard}
                    onChange={(e) => setSelectedCard(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose a card...</option>
                    {cardsWithoutAlerts.map((item) => (
                      <option key={item.cardId} value={item.cardId}>
                        {item.card.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alert Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={alertPrice}
                    onChange={(e) => setAlertPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Direction</label>
                  <select
                    value={alertDirection}
                    onChange={(e) => setAlertDirection(e.target.value as 'up' | 'down')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="down">Price drops below</option>
                    <option value="up">Price rises above</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleCreateAlert}
                  disabled={!selectedCard || !alertPrice}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Create Alert
                </button>
                <button
                  onClick={() => setShowAlertForm(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active Alerts */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Active Alerts</h2>
          </div>
          {cardsWithAlerts.length === 0 ? (
            <div className="p-12 text-center">
              <BellSlashIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No active alerts</h3>
              <p className="text-gray-600 mb-6">Create your first price alert to get notified when card prices change.</p>
              <button
                onClick={() => setShowAlertForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Alert
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {cardsWithAlerts.map((item) => (
                <div key={item.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.card.imageUrl}
                        alt={item.card.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.card.name}</h3>
                        <p className="text-sm text-gray-600">{item.card.set}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-600">Current: $25.00</span>
                          <span className={`text-sm font-medium ${
                            item.alertDirection === 'up' ? 'text-red-600' : 'text-green-600'
                          }`}>
                            Alert: ${item.alertPrice} {item.alertDirection === 'up' ? '↑' : '↓'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateAlertSettings(item.cardId)}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <BellSlashIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => removeFromWatchlist(item.cardId)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Alerts</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="h-3 w-3 bg-green-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Blue-Eyes White Dragon dropped below $25.00</p>
                  <p className="text-sm text-gray-600">Current price: $24.50</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="h-3 w-3 bg-red-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Dark Magician rose above $15.00</p>
                  <p className="text-sm text-gray-600">Current price: $16.75</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="h-3 w-3 bg-green-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Red-Eyes Black Dragon dropped below $20.00</p>
                  <p className="text-sm text-gray-600">Current price: $19.25</p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 