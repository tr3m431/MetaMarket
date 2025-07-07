'use client'

import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'

interface PriceData {
  id: string
  card_id: string
  vendor_id: string
  price: number
  currency: string
  condition?: string
  rarity?: string
  set_code?: string
  recorded_at: string
  created_at?: string
}

interface PriceChartProps {
  cardId: string
  vendorId?: string
  days?: number
}

interface ChartDataPoint {
  date: string
  [key: string]: string | number
}

export default function PriceChart({ cardId, vendorId, days = 30 }: PriceChartProps) {
  const [priceData, setPriceData] = useState<PriceData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        let url = `${process.env.NEXT_PUBLIC_API_URL}/cards/${cardId}/prices?days=${days}`
        if (vendorId) {
          url += `&vendor_id=${vendorId}`
        }
        
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error('Failed to fetch price data')
        }
        
        const data = await response.json()
        setPriceData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchPriceData()
  }, [cardId, vendorId, days])

  // Transform data for chart
  const chartData: ChartDataPoint[] = React.useMemo(() => {
    if (!priceData.length) return []

    // Group by date and vendor
    const groupedData: { [key: string]: { [key: string]: number } } = {}
    
    priceData.forEach(item => {
      const date = format(new Date(item.recorded_at), 'MMM dd')
      const vendor = item.vendor_id
      
      if (!groupedData[date]) {
        groupedData[date] = {}
      }
      
      groupedData[date][vendor] = item.price
    })

    // Convert to chart format
    return Object.entries(groupedData).map(([date, vendors]) => ({
      date,
      ...vendors
    }))
  }, [priceData])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading price data: {error}</p>
      </div>
    )
  }

  if (!priceData.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No price data available for this card.</p>
      </div>
    )
  }

  // Get unique vendors for legend
  const vendors = [...new Set(priceData.map(item => item.vendor_id))]
  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6']

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Price History</h3>
        <p className="text-sm text-gray-600">
          Last {days} days • {vendors.length} vendor{vendors.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          {vendors.map((vendor, index) => (
            <Line
              key={vendor}
              type="monotone"
              dataKey={vendor}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              name={vendor.charAt(0).toUpperCase() + vendor.slice(1)}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>Data from: {vendors.join(', ')}</p>
        <p>Prices shown in USD</p>
      </div>
    </div>
  )
} 