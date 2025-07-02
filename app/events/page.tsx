import EventBrowser from '../../components/EventBrowser'
import { mockTournaments } from '../../types/mockTournaments'

export default function EventsPage() {
  return <EventBrowser tournaments={mockTournaments} />
} 