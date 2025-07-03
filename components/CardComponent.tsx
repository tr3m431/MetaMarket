'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { useWatchlist } from '@/contexts/WatchlistContext'
import { Card } from '@/types/card'

interface CardComponentProps {
  card: Card
}

export default function CardComponent({ card }: CardComponentProps) {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist()
  const [isAddingToWatchlist, setIsAddingToWatchlist] = useState(false)

  const handleWatchlistToggle = async () => {
    setIsAddingToWatchlist(true)
    
    if (isInWatchlist(card.id)) {
      removeFromWatchlist(card.id)
    } else {
      addToWatchlist(card)
    }
    
    // Simulate a brief delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300))
    setIsAddingToWatchlist(false)
  }

  const isInUserWatchlist = isInWatchlist(card.id)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Card Image */}
      <div className="relative aspect-[3/4]">
        <Image
          src={card.imageUrl}
          alt={card.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-1">
          {card.isBanned && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-semibold">
              BANNED
            </span>
          )}
          {card.isLimited && (
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded font-semibold">
              LIMITED
            </span>
          )}
          {card.isSemiLimited && (
            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded font-semibold">
              SEMI-LIMITED
            </span>
          )}
          {card.isReprint && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded font-semibold">
              REPRINT
            </span>
          )}
        </div>

        {/* Watchlist Button */}
        <button
          onClick={handleWatchlistToggle}
          disabled={isAddingToWatchlist}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
        >
          {isInUserWatchlist ? (
            <HeartSolidIcon className="h-5 w-5 text-red-500" />
          ) : (
            <HeartIcon className="h-5 w-5 text-gray-400 hover:text-red-500" />
          )}
        </button>
      </div>

      {/* Card Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {card.name}
          </h3>
        </div>
        
        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Type:</span>
            <span className="font-medium">{card.type}</span>
          </div>
          
          {card.attribute && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Attribute:</span>
              <span className="font-medium">{card.attribute}</span>
            </div>
          )}
          
          {card.level && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Level:</span>
              <span className="font-medium">{card.level}</span>
            </div>
          )}
          
          {card.race && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Race:</span>
              <span className="font-medium">{card.race}</span>
            </div>
          )}
          
          {card.attack && card.defense && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">ATK/DEF:</span>
              <span className="font-medium">{card.attack}/{card.defense}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Rarity:</span>
            <span className="font-medium">{card.rarity}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Set:</span>
            <span className="font-medium">{card.set}</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {card.description}
        </p>

        {/* Actions */}
        <div className="flex space-x-2">
          <Link
            href={`/cards/${card.id}`}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-center text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
} 