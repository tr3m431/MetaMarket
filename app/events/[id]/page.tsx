'use client'
// import { useRouter } from 'next/router'
// import { mockTournaments } from '../../../types/mockTournaments'
import TournamentDetailPage from '../../../components/TournamentDetailPage'
import { useEffect, useState } from 'react'
import { Tournament } from '../../../types/card'

export default function Page({ params }: { params: { id: string } }) {
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`http://localhost:8000/tournaments/${params.id}`)
      .then(res => {
        if (!res.ok) throw new Error('Tournament not found')
        return res.json()
      })
      .then(setTournament)
      .catch(err => setError(err.message))
  }, [params.id])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 px-6">
          <div className="flex items-center gap-4 mb-4">
            <a 
              href="/events" 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Events
            </a>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {error ? (
            <div className="text-center py-8 text-red-600">
              <p className="text-lg font-medium">Error loading tournament</p>
              <p className="text-sm text-gray-500 mt-2">{error}</p>
            </div>
          ) : !tournament ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading tournament...</p>
            </div>
          ) : (
            <TournamentDetailPage tournament={tournament} />
          )}
        </div>
      </div>
    </div>
  )
} 