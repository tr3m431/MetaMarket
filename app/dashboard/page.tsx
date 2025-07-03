'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useWatchlist } from '@/contexts/WatchlistContext'
import { 
  EyeIcon, 
  BellIcon, 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  HeartIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useAuth()
  const { watchlist } = useWatchlist()
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign in to view your dashboard</h2>
          <p className="text-gray-600 mb-6">Create an account or sign in to access your personalized dashboard.</p>
          <Link href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  const cardsWithAlerts = watchlist.filter(item => item.alertPrice)
  const recentAlerts = [
    { id: 1, card: 'Blue-Eyes White Dragon', type: 'drop', price: 24.50, time: '2 hours ago' },
    { id: 2, card: 'Dark Magician', type: 'rise', price: 16.75, time: '1 day ago' },
    { id: 3, card: 'Red-Eyes Black Dragon', type: 'drop', price: 19.25, time: '3 days ago' },
  ]

  const stats = [
    { name: 'Watched Cards', value: watchlist.length, icon: EyeIcon, color: 'blue' },
    { name: 'Active Alerts', value: cardsWithAlerts.length, icon: BellIcon, color: 'green' },
    { name: 'Price Drops', value: 2, icon: ArrowTrendingDownIcon, color: 'green' },
    { name: 'Price Rises', value: 1, icon: ArrowTrendingUpIcon, color: 'red' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}! Here's your Yu-Gi-Oh! card tracking overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.name} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className={`h-8 w-8 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 text-${stat.color}-600`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                  </select>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className={`h-3 w-3 rounded-full ${
                        alert.type === 'drop' ? 'bg-green-600' : 'bg-red-600'
                      }`}></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{alert.card}</p>
                        <p className="text-sm text-gray-600">
                          Price {alert.type === 'drop' ? 'dropped' : 'rose'} to ${alert.price}
                        </p>
                        <p className="text-xs text-gray-500">{alert.time}</p>
                      </div>
                      <div className={`text-sm font-medium ${
                        alert.type === 'drop' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {alert.type === 'drop' ? '↓' : '↑'}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Link href="/alerts" className="text-blue-600 hover:text-blue-700 font-medium">
                    View all alerts →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-4">
                <Link
                  href="/cards"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <EyeIcon className="h-6 w-6 text-blue-600" />
                  <span className="text-gray-900">Browse Cards</span>
                </Link>
                <Link
                  href="/watchlist"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <HeartIcon className="h-6 w-6 text-red-600" />
                  <span className="text-gray-900">My Watchlist</span>
                </Link>
                <Link
                  href="/alerts"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <BellIcon className="h-6 w-6 text-green-600" />
                  <span className="text-gray-900">Manage Alerts</span>
                </Link>
                <Link
                  href="/predictions"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ChartBarIcon className="h-6 w-6 text-purple-600" />
                  <span className="text-gray-900">View Predictions</span>
                </Link>
              </div>
            </div>

            {/* Market Overview */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Market Overview</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Market Trend</span>
                  <span className="text-green-600 font-medium">↗ Bullish</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Top Gainer</span>
                  <span className="text-green-600 font-medium">+15.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Top Loser</span>
                  <span className="text-red-600 font-medium">-8.7%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active Sets</span>
                  <span className="font-medium">24</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Watchlist Items */}
        {watchlist.length > 0 && (
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Watchlist Items</h2>
                  <Link href="/watchlist" className="text-blue-600 hover:text-blue-700 font-medium">
                    View all →
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {watchlist.slice(0, 6).map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.card.imageUrl}
                        alt={item.card.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.card.name}</p>
                        <p className="text-xs text-gray-600">{item.card.set}</p>
                        {item.alertPrice && (
                          <p className="text-xs text-green-600">
                            Alert: ${item.alertPrice}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 