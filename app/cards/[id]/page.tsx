'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import CardDetailPage from '@/components/CardDetailPage'
import PriceChart from '@/components/PriceChart'
import PriceSummary from '@/components/PriceSummary'
import { Card } from '@/types/card'

export default function Page() {
  const { id } = useParams()
  const [card, setCard] = useState<Card | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/cards/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Card not found')
        return res.json()
      })
      .then(setCard)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">{error}</div>
  if (!card) return <div>Card not found.</div>
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Card Details */}
        <CardDetailPage card={card} />
        
        {/* Price Tracking Section */}
        <div className="mt-8 space-y-8">
          {/* Price Summary */}
          <PriceSummary cardId={card.id} />
          
          {/* Price Chart */}
          <PriceChart cardId={card.id} days={30} />
        </div>
      </div>
    </div>
  )
} 