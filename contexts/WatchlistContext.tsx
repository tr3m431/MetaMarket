'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Card, WatchlistItem } from '@/types/card'

interface WatchlistContextType {
  watchlist: WatchlistItem[]
  addToWatchlist: (card: Card, alertPrice?: number, alertDirection?: 'up' | 'down') => void
  removeFromWatchlist: (cardId: string) => void
  isInWatchlist: (cardId: string) => boolean
  updateAlertSettings: (cardId: string, alertPrice?: number, alertDirection?: 'up' | 'down') => void
  getWatchlistCount: () => number
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined)

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const savedWatchlist = localStorage.getItem('metamarket_watchlist')
    if (savedWatchlist) {
      try {
        setWatchlist(JSON.parse(savedWatchlist))
      } catch (error) {
        console.error('Failed to load watchlist:', error)
      }
    }
  }, [])

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('metamarket_watchlist', JSON.stringify(watchlist))
  }, [watchlist])

  const addToWatchlist = (card: Card, alertPrice?: number, alertDirection?: 'up' | 'down') => {
    setWatchlist(prev => {
      // Check if card is already in watchlist
      const existingIndex = prev.findIndex(item => item.cardId === card.id)
      
      if (existingIndex >= 0) {
        // Update existing item
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          alertPrice,
          alertDirection
        }
        return updated
      } else {
        // Add new item
        const newItem: WatchlistItem = {
          id: Date.now().toString(),
          userId: 'current-user', // In real app, this would come from auth
          cardId: card.id,
          card,
          alertPrice,
          alertDirection,
          createdAt: new Date().toISOString()
        }
        return [...prev, newItem]
      }
    })
  }

  const removeFromWatchlist = (cardId: string) => {
    setWatchlist(prev => prev.filter(item => item.cardId !== cardId))
  }

  const isInWatchlist = (cardId: string) => {
    return watchlist.some(item => item.cardId === cardId)
  }

  const updateAlertSettings = (cardId: string, alertPrice?: number, alertDirection?: 'up' | 'down') => {
    setWatchlist(prev => 
      prev.map(item => 
        item.cardId === cardId 
          ? { ...item, alertPrice, alertDirection }
          : item
      )
    )
  }

  const getWatchlistCount = () => {
    return watchlist.length
  }

  const value = {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    updateAlertSettings,
    getWatchlistCount,
  }

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  )
}

export function useWatchlist() {
  const context = useContext(WatchlistContext)
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider')
  }
  return context
} 