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

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>
  }
  if (!tournament) {
    return <div className="p-8 text-center">Loading tournament...</div>
  }
  return <TournamentDetailPage tournament={tournament} />
} 