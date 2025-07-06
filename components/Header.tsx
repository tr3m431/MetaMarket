'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MagnifyingGlassIcon, HeartIcon, UserIcon, Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/contexts/AuthContext'
import { useWatchlist } from '@/contexts/WatchlistContext'

interface HeaderProps {
  onSearch?: (query: string) => void
}

export default function Header({ onSearch }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const { user, logout } = useAuth()
  const { getWatchlistCount } = useWatchlist()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchInput)
    } else {
      // Default behavior: navigate to cards page with search query
      window.location.href = `/cards?search=${encodeURIComponent(searchInput)}`
    }
  }

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold text-gray-900">MetaMarket</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 ml-12">
            <Link href="/cards" className="text-gray-600 hover:text-gray-900 transition-colors">
              Cards
            </Link>
            <Link href="/events" className="text-gray-600 hover:text-gray-900 transition-colors">
              Events
            </Link>
            <Link href="/meta" className="text-gray-600 hover:text-gray-900 transition-colors">
              Meta Analysis
            </Link>
            <Link href="/predictions" className="text-gray-600 hover:text-gray-900 transition-colors">
              Predictions
            </Link>
            {user && (
              <Link href="/watchlist" className="text-gray-600 hover:text-gray-900 transition-colors">
                Watchlist
              </Link>
            )}
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search cards..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </form>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user && (
              <Link
                href="/watchlist"
                className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <HeartIcon className="h-6 w-6" />
                {getWatchlistCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getWatchlistCount()}
                  </span>
                )}
              </Link>
            )}
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden lg:block text-sm font-medium">{user.name}</span>
                  <ChevronDownIcon className="h-4 w-4" />
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/watchlist"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      My Watchlist
                    </Link>
                    <Link
                      href="/alerts"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Alerts
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <UserIcon className="h-6 w-6" />
              </Link>
            )}
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link href="/cards" className="text-gray-600 hover:text-gray-900 transition-colors">
                Cards
              </Link>
              <Link href="/events" className="text-gray-600 hover:text-gray-900 transition-colors">
                Events
              </Link>
              <Link href="/meta" className="text-gray-600 hover:text-gray-900 transition-colors">
                Meta Analysis
              </Link>
              <Link href="/predictions" className="text-gray-600 hover:text-gray-900 transition-colors">
                Predictions
              </Link>
              {user && (
                <>
                  <Link href="/watchlist" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Watchlist
                  </Link>
                  <Link href="/alerts" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Alerts
                  </Link>
                  <Link href="/profile" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Profile
                  </Link>
                </>
              )}
              {!user && (
                <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Sign In
                </Link>
              )}
            </nav>
            <form onSubmit={handleSearch} className="mt-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search cards..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </form>
          </div>
        )}
      </div>
    </header>
  )
} 