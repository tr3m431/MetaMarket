'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  CalendarIcon, 
  MapPinIcon, 
  UsersIcon, 
  TrophyIcon,
  ChartBarIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

// Mock tournament data
const tournaments = [
  {
    id: '1',
    name: 'YCS Las Vegas 2024',
    date: '2024-01-15',
    location: 'Las Vegas, NV',
    format: 'Advanced',
    size: 1024,
    topCut: 32,
    winner: 'Joshua Schmidt',
    winningDeck: 'Kashtira',
    runnerUp: 'Michael Zhang',
    runnerUpDeck: 'Labrynth',
    status: 'completed'
  },
  {
    id: '2',
    name: 'YCS Chicago 2024',
    date: '2024-01-08',
    location: 'Chicago, IL',
    format: 'Advanced',
    size: 856,
    topCut: 32,
    winner: 'Michael Zhang',
    winningDeck: 'Labrynth',
    runnerUp: 'Sarah Johnson',
    runnerUpDeck: 'Purrley',
    status: 'completed'
  },
  {
    id: '3',
    name: 'YCS Dallas 2024',
    date: '2024-01-01',
    location: 'Dallas, TX',
    format: 'Advanced',
    size: 724,
    topCut: 32,
    winner: 'Sarah Johnson',
    winningDeck: 'Purrley',
    runnerUp: 'David Kim',
    runnerUpDeck: 'Swordsoul',
    status: 'completed'
  },
  {
    id: '4',
    name: 'YCS Orlando 2024',
    date: '2024-02-15',
    location: 'Orlando, FL',
    format: 'Advanced',
    size: 0,
    topCut: 32,
    winner: '',
    winningDeck: '',
    runnerUp: '',
    runnerUpDeck: '',
    status: 'upcoming'
  },
  {
    id: '5',
    name: 'YCS Seattle 2024',
    date: '2024-02-22',
    location: 'Seattle, WA',
    format: 'Advanced',
    size: 0,
    topCut: 32,
    winner: '',
    winningDeck: '',
    runnerUp: '',
    runnerUpDeck: '',
    status: 'upcoming'
  }
]

const deckUsageData = [
  { deck: 'Kashtira', usage: 18.5, topCut: 8, wins: 2 },
  { deck: 'Labrynth', usage: 15.2, topCut: 6, wins: 1 },
  { deck: 'Purrley', usage: 12.8, topCut: 5, wins: 1 },
  { deck: 'Swordsoul', usage: 10.3, topCut: 4, wins: 0 },
  { deck: 'Branded', usage: 8.9, topCut: 3, wins: 0 },
  { deck: 'Spright', usage: 7.2, topCut: 2, wins: 0 },
]

const recentResults = [
  { tournament: 'YCS Las Vegas', date: '2024-01-15', players: 1024, topCut: 32 },
  { tournament: 'YCS Chicago', date: '2024-01-08', players: 856, topCut: 32 },
  { tournament: 'YCS Dallas', date: '2024-01-01', players: 724, topCut: 32 },
  { tournament: 'YCS Atlanta', date: '2023-12-25', players: 892, topCut: 32 },
  { tournament: 'YCS San Diego', date: '2023-12-18', players: 678, topCut: 32 },
]

export default function EventsPage() {
  const [selectedFormat, setSelectedFormat] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedRegion, setSelectedRegion] = useState<string>('all')

  const completedTournaments = tournaments.filter(t => t.status === 'completed')
  const upcomingTournaments = tournaments.filter(t => t.status === 'upcoming')

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status: string) => {
    if (status === 'completed') {
      return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Completed</span>
    } else if (status === 'upcoming') {
      return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Upcoming</span>
    }
    return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Unknown</span>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tournament Events</h1>
          <p className="text-gray-600">Track Yu-Gi-Oh! tournament results and meta analysis</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <CalendarIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{tournaments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <UsersIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Players</p>
                <p className="text-2xl font-bold text-gray-900">
                  {completedTournaments.reduce((sum, t) => sum + t.size, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <TrophyIcon className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedTournaments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingTournaments.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Formats</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Traditional">Traditional</option>
                  <option value="Sealed">Sealed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Events</option>
                  <option value="completed">Completed</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Tournaments */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Tournaments</h2>
          
          <div className="space-y-6">
            {completedTournaments.map((tournament) => (
              <div key={tournament.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{tournament.name}</h3>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{formatDate(tournament.date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPinIcon className="h-4 w-4" />
                        <span>{tournament.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <UsersIcon className="h-4 w-4" />
                        <span>{tournament.size} players</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(tournament.status)}
                    <Link
                      href={`/events/${tournament.id}`}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <EyeIcon className="h-4 w-4" />
                      <span>View Results</span>
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Winner</h4>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="font-semibold text-green-900">{tournament.winner}</p>
                      <p className="text-sm text-green-700">{tournament.winningDeck}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Runner-Up</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <p className="font-semibold text-gray-900">{tournament.runnerUp}</p>
                      <p className="text-sm text-gray-700">{tournament.runnerUpDeck}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tournaments */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Upcoming Tournaments</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingTournaments.map((tournament) => (
              <div key={tournament.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{tournament.name}</h3>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{formatDate(tournament.date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPinIcon className="h-4 w-4" />
                        <span>{tournament.location}</span>
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(tournament.status)}
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Format:</span> {tournament.format}</p>
                  <p><span className="font-medium">Top Cut:</span> {tournament.topCut} players</p>
                </div>

                <div className="mt-4">
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    Register Interest
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deck Usage Analysis */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Meta Analysis</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Usage Chart */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Deck Usage in Recent Events</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deckUsageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="deck" />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value: number) => [`${value}%`, 'Usage']} />
                    <Bar dataKey="usage" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Cut Distribution */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Cut Distribution</h3>
              <div className="space-y-3">
                {deckUsageData.map((deck) => (
                  <div key={deck.deck} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{deck.deck}</p>
                      <p className="text-sm text-gray-600">{deck.topCut} top cut appearances</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatPercentage(deck.usage)}</p>
                      <p className="text-sm text-gray-600">{deck.wins} wins</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tournament History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Tournament History</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tournament
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Players
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Top Cut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Winner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentResults.map((result, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{result.tournament}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(result.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {result.players}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {result.topCut}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index === 0 ? 'Joshua Schmidt (Kashtira)' : 
                       index === 1 ? 'Michael Zhang (Labrynth)' : 
                       index === 2 ? 'Sarah Johnson (Purrley)' : 'TBD'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/events/${index + 1}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Results
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

const formatPercentage = (value: number) => `${value.toFixed(1)}%` 