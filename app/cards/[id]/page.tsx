'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import CardDetailPage from '@/components/CardDetailPage'
import { Card, PriceHistory, PricePrediction } from '@/types/card'

export default function Page() {
  const { id } = useParams()
  const [card, setCard] = useState<Card | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Placeholder data for price history and prediction
  const placeholderPriceHistory: PriceHistory = {
    data: [
      { date: '2024-01-01', price: 25.99 },
      { date: '2024-01-08', price: 28.50 },
      { date: '2024-01-15', price: 26.75 },
      { date: '2024-01-22', price: 30.25 },
      { date: '2024-01-29', price: 32.00 },
      { date: '2024-02-05', price: 29.50 },
      { date: '2024-02-12', price: 31.75 },
    ],
    vendor: 'TCGPlayer'
  }

  const placeholderPrediction: PricePrediction = {
    currentPrice: 31.75,
    predictedPrice: 35.50,
    changePercentage: 11.8,
    direction: 'up',
    confidence: 0.85,
    factors: [
      'Recent tournament usage',
      'Meta relevance',
      'Limited print run'
    ]
  }

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
  return <CardDetailPage card={card} priceHistory={placeholderPriceHistory} prediction={placeholderPrediction} />
} 