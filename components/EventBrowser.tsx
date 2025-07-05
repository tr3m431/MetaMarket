'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Tournament } from '../types/card'
import { CalendarIcon, MapPinIcon, UsersIcon, TrophyIcon } from '@heroicons/react/24/outline'

interface EventBrowserProps {
  tournaments: Tournament[]
}

const formatDate = (date: string) => new Date(date).toLocaleDateString()

export default function EventBrowser({ tournaments }: EventBrowserProps) {
  const [format, setFormat] = useState<string>('all')

  const filtered = format === 'all'
    ? tournaments
    : tournaments.filter(t => t.format === format)

  const uniqueFormats = Array.from(new Set(tournaments.map(t => t.format)))

  if (tournaments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        <p className="text-lg font-medium">No tournaments found</p>
        <p className="text-sm text-gray-500 mt-2">Check back later for upcoming events!</p>
      </div>
    )
  }

  return (
    <div>
      {/* Filter Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Format
            </label>
            <select
              id="format"
              value={format}
              onChange={e => setFormat(e.target.value)}
              className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Formats</option>
              <option value="Advanced">Advanced</option>
              <option value="Traditional">Traditional</option>
              {uniqueFormats.filter(f => f !== 'Advanced' && f !== 'Traditional').map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-500">
            {filtered.length} tournament{filtered.length !== 1 ? 's' : ''} found
          </div>
        </div>
      </div>

      {/* Tournaments List */}
      <div className="space-y-4">
        {filtered.map(tournament => (
          <Link 
            key={tournament.id} 
            href={`/events/${tournament.id}`}
            className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200 hover:border-blue-300"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                  {tournament.name}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    {formatDate(tournament.date)}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="h-4 w-4" />
                    {tournament.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <UsersIcon className="h-4 w-4" />
                    {tournament.size} players
                  </div>
                  <div className="flex items-center gap-1">
                    <TrophyIcon className="h-4 w-4" />
                    Top {tournament.topCut}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  tournament.format === 'Advanced' 
                    ? 'bg-blue-100 text-blue-800' 
                    : tournament.format === 'Traditional'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {tournament.format}
                </span>
                <span className="text-xs text-gray-500">
                  {tournament.region}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 