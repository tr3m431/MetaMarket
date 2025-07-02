import { useRouter } from 'next/router'
import { mockTournaments } from '../../../types/mockTournaments'
import TournamentDetailPage from '../../../components/TournamentDetailPage'

export default function Page({ params }: { params: { id: string } }) {
  const tournament = mockTournaments.find(t => t.id === params.id)
  if (!tournament) {
    return <div className="p-8 text-center text-red-600">Tournament not found.</div>
  }
  return <TournamentDetailPage tournament={tournament} />
} 