import React from 'react'
import { Tournament } from '../types/card'

interface TournamentDetailPageProps {
  tournament: Tournament
}

const formatDate = (date: string) => new Date(date).toLocaleDateString()

export default function TournamentDetailPage({ tournament }: TournamentDetailPageProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{tournament.name}</h1>
      <div className="mb-2 text-gray-700">
        {formatDate(tournament.date)} &bull; {tournament.location} &bull; {tournament.format}
      </div>
      <div className="mb-4 text-gray-600">Top Cut: {tournament.topCut}</div>
      <h2 className="text-2xl font-semibold mb-2">Decklists</h2>
      {tournament.decklists.length === 0 ? (
        <div className="text-gray-500">No decklists available</div>
      ) : (
        <ul className="space-y-4">
          {tournament.decklists.map(deck => (
            <li key={deck.id} className="border rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold">{deck.player}</span>
                <span className="text-gray-500">#{deck.placement}</span>
                <span className="text-blue-600 font-medium">{deck.deckType}</span>
              </div>
              <div className="flex space-x-4 text-sm text-gray-600">
                <span>Main Deck: {deck.mainDeck.reduce((sum, c) => sum + c.quantity, 0)}</span>
                <span>Extra Deck: {deck.extraDeck.reduce((sum, c) => sum + c.quantity, 0)}</span>
                <span>Side Deck: {deck.sideDeck.reduce((sum, c) => sum + c.quantity, 0)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
} 