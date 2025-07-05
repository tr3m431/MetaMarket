import React from 'react'
import { Tournament } from '../types/card'
import { CalendarIcon, MapPinIcon, UsersIcon, TrophyIcon, UserGroupIcon } from '@heroicons/react/24/outline'

interface TournamentDetailPageProps {
  tournament: Tournament
}

const formatDate = (date: string) => new Date(date).toLocaleDateString()

export default function TournamentDetailPage({ tournament }: TournamentDetailPageProps) {
  return (
    <div>
      {/* Tournament Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{tournament.name}</h1>
        <div className="flex flex-wrap items-center gap-6 text-gray-600">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            <span>{formatDate(tournament.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-5 w-5" />
            <span>{tournament.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5" />
            <span>{tournament.size} players</span>
          </div>
          <div className="flex items-center gap-2">
            <TrophyIcon className="h-5 w-5" />
            <span>Top {tournament.topCut}</span>
          </div>
        </div>
        <div className="mt-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            tournament.format === 'Advanced' 
              ? 'bg-blue-100 text-blue-800' 
              : tournament.format === 'Traditional'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {tournament.format}
          </span>
          <span className="ml-3 text-sm text-gray-500">
            {tournament.region}
          </span>
        </div>
      </div>

      {/* Decklists Section */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <UserGroupIcon className="h-6 w-6 text-gray-600" />
          <h2 className="text-2xl font-semibold text-gray-900">Decklists</h2>
        </div>
        
        {tournament.decklists.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <UserGroupIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No decklists available</p>
            <p className="text-sm mt-2">Decklists will be posted after the tournament concludes</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tournament.decklists.map(deck => (
              <div key={deck.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-gray-900">{deck.player}</span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        #{deck.placement}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {deck.deckType}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span>Main Deck: {deck.mainDeck.reduce((sum, c) => sum + c.quantity, 0)} cards</span>
                      <span>Extra Deck: {deck.extraDeck.reduce((sum, c) => sum + c.quantity, 0)} cards</span>
                      <span>Side Deck: {deck.sideDeck.reduce((sum, c) => sum + c.quantity, 0)} cards</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 