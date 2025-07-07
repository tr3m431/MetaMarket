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
  children?: React.ReactNode
}

export default function CardComponent({ card, children }: CardComponentProps) {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist()
  const [isAddingToWatchlist, setIsAddingToWatchlist] = useState(false)
  const [expanded, setExpanded] = useState(false)

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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col h-full min-h-[480px]">
      {/* Card Image */}
      <div className="relative w-full h-64 flex items-center justify-center bg-gray-100">
        <Image
          src={card.imageUrl}
          alt={card.name}
          fill
          className="object-contain"
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
      </div>

      {/* Card Info */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {card.name}
          </h3>
        </div>
        
        <div className="space-y-2 mb-3">
          {(() => {
            const infoRows = [
              { label: 'Type', value: card.type },
              card.attribute ? { label: 'Attribute', value: card.attribute } : null,
              card.level ? { label: 'Level', value: card.level } : null,
              card.subtype ? { label: 'Subtype', value: card.subtype } : null,
              card.attack && card.defense ? { label: 'ATK/DEF', value: `${card.attack}/${card.defense}` } : null,
              card.set ? { label: 'Set', value: card.set } : null,
            ].filter((row): row is { label: string; value: string } => row !== null)
            const rowsToShow = expanded ? infoRows : infoRows.slice(0, 2)
            return (
              <>
                {rowsToShow.map((row, idx) => (
                  <div key={idx} className="flex items-center text-sm">
                    {row.label === 'Set' ? (
                      <>
                        <span className="text-gray-600 whitespace-nowrap">{row.label}:&nbsp;</span>
                        <span className="font-medium max-w-[8rem] truncate" title={row.value}>{row.value}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-600 whitespace-nowrap">{row.label}:&nbsp;</span>
                        <span className="font-medium">{row.value}</span>
                      </>
                    )}
                  </div>
                ))}
                {infoRows.length > 2 && (
                  <button
                    className="text-xs text-primary-600 hover:underline mt-1"
                    onClick={() => setExpanded(e => !e)}
                  >
                    {expanded ? 'Show less' : 'Show more'}
                  </button>
                )}
              </>
            )
          })()}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {card.description}
        </p>

        {/* Actions */}
        <div className="mt-auto">{children}</div>
      </div>
    </div>
  )
} 