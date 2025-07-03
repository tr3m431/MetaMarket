'use client'
import EventBrowser from '../../components/EventBrowser'
// import { mockTournaments } from '../../types/mockTournaments'
import { useEffect, useState } from 'react'
import { Tournament } from '../../types/card'

export default function EventsPage() {
  const [tournaments, setTournaments] = useState<Tournament[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('http://localhost:8000/tournaments')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch tournaments')
        return res.json()
      })
      .then(setTournaments)
      .catch(err => setError(err.message))
  }, [])

  if (error) return <div className="p-8 text-center text-red-600">{error}</div>
  if (!tournaments) return <div className="p-8 text-center">Loading tournaments...</div>
  return <EventBrowser tournaments={tournaments} />
} 