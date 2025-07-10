'use client'
import EventBrowser from '../../components/EventBrowser'
// import { mockTournaments } from '../../types/mockTournaments'
import { useEffect, useState } from 'react'
import { Tournament } from '../../types/card'

export default function EventsPage() {
  const [tournaments, setTournaments] = useState<Tournament[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/tournaments`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch events')
        return res.json()
      })
      .then(setTournaments)
      .catch(err => setError(err.message))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 px-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
          <p className="text-gray-600">Browse upcoming and past Yu-Gi-Oh! tournaments</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {error ? (
            <div className="text-center py-8 text-red-600">
              <p className="text-lg font-medium">Error loading events</p>
              <p className="text-sm text-gray-500 mt-2">{error}</p>
            </div>
          ) : !tournaments ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading events...</p>
            </div>
          ) : (
            <EventBrowser tournaments={tournaments} />
          )}
        </div>
      </div>
    </div>
  )
} 