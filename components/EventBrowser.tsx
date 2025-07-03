'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Tournament } from '../types/card'

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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Tournament Events</h1>
      <div className="mb-4">
        <label htmlFor="format" className="mr-2 font-medium">Format</label>
        <select
          id="format"
          value={format}
          onChange={e => setFormat(e.target.value)}
          className="border rounded px-3 py-1"
        >
          <option value="all">All</option>
          {uniqueFormats.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>
      <ul className="space-y-4">
        {filtered.map(tournament => (
          <li key={tournament.id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                <Link href={`/events/${tournament.id}`}>{tournament.name}</Link>
              </h2>
              <div className="text-gray-600 text-sm">
                {formatDate(tournament.date)} &bull; {tournament.location} &bull; {tournament.format}
              </div>
            </div>
            <div className="mt-2 md:mt-0 text-sm text-gray-500">
              {tournament.size} players &bull; Top Cut: {tournament.topCut}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
} 