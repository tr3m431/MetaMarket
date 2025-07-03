'use client'

import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Discover Amazing Products
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto animate-slide-up">
            Your one-stop digital marketplace for unique products, digital goods, and creative services.
            Buy, sell, and connect with creators worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <Link
              href="/products"
              className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <span>Start Shopping</span>
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <Link
              href="/sell"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Start Selling
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-bounce-gentle"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-white opacity-10 rounded-full animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-white opacity-10 rounded-full animate-bounce-gentle" style={{ animationDelay: '2s' }}></div>
      </div>
    </section>
  )
} 