'use client'

import React, { useState, useEffect } from 'react'
import { CurrencyDollarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline'

interface PriceData {
  vendor_id: string
  price: number
  currency: string
  condition?: string
  recorded_at: string
}

interface PriceSummaryProps {
  cardId: string
}

export default function PriceSummary({ cardId }: PriceSummaryProps) {
  const [priceData, setPriceData] = useState<PriceData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPriceSummary = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cards/${cardId}/price-summary`)
        if (!response.ok) {
          throw new Error('Failed to fetch price summary')
        }
        
        const data = await response.json()
        setPriceData(data.prices || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchPriceSummary()
  }, [cardId])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <p className="text-red-600">Error loading price data: {error}</p>
        </div>
      </div>
    )
  }

  if (!priceData.length) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <CurrencyDollarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No price data available for this card.</p>
        </div>
      </div>
    )
  }

  // Calculate price statistics
  const prices = priceData.map(p => p.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length

  // Determine price trend (simple comparison of min vs max)
  const priceRange = maxPrice - minPrice
  const priceVariation = (priceRange / avgPrice) * 100

  const getVendorDisplayName = (vendorId: string) => {
    const names: { [key: string]: string } = {
      'tcgplayer': 'TCGPlayer',
      'cardmarket': 'Cardmarket',
      'ebay': 'eBay'
    }
    return names[vendorId] || vendorId
  }

  const getVendorColor = (vendorId: string) => {
    const colors: { [key: string]: string } = {
      'tcgplayer': 'bg-blue-100 text-blue-800',
      'cardmarket': 'bg-green-100 text-green-800',
      'ebay': 'bg-purple-100 text-purple-800'
    }
    return colors[vendorId] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Prices</h3>
        
        {/* Price Statistics */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Lowest</p>
            <p className="text-xl font-bold text-green-600">${minPrice.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Average</p>
            <p className="text-xl font-bold text-blue-600">${avgPrice.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Highest</p>
            <p className="text-xl font-bold text-red-600">${maxPrice.toFixed(2)}</p>
          </div>
        </div>

        {/* Price Variation Indicator */}
        {priceVariation > 5 && (
          <div className="flex items-center justify-center mb-4 p-2 rounded-lg bg-yellow-50">
            {priceVariation > 20 ? (
              <ArrowTrendingUpIcon className="h-5 w-5 text-red-500 mr-2" />
            ) : (
              <ArrowTrendingDownIcon className="h-5 w-5 text-green-500 mr-2" />
            )}
            <span className="text-sm text-gray-700">
              {priceVariation > 20 ? 'High' : 'Moderate'} price variation ({priceVariation.toFixed(1)}%)
            </span>
          </div>
        )}
      </div>

      {/* Vendor Prices */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Vendor Prices</h4>
        {priceData.map((price, index) => (
          <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVendorColor(price.vendor_id)}`}>
                {getVendorDisplayName(price.vendor_id)}
              </span>
              {price.condition && (
                <span className="ml-2 text-xs text-gray-500">({price.condition})</span>
              )}
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">
                ${price.price.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(price.recorded_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p>Prices updated as of {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  )
} 