'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { StarIcon, HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/solid'
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline'
import { useCart } from '@/contexts/CartContext'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  seller: string
  rating: number
  reviews: number
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      seller: product.seller,
    })
    
    // Simulate a brief delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500))
    setIsAddingToCart(false)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Product Image */}
      <div className="relative aspect-square">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
        >
          {isFavorite ? (
            <HeartIcon className="h-5 w-5 text-red-500" />
          ) : (
            <HeartOutlineIcon className="h-5 w-5 text-gray-400 hover:text-red-500" />
          )}
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {product.name}
          </h3>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">
            ({product.reviews})
          </span>
        </div>

        {/* Seller */}
        <p className="text-sm text-gray-500 mb-3">
          by {product.seller}
        </p>

        {/* Price and Actions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900">
              ${product.price}
            </span>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm"
            >
              {isAddingToCart ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <ShoppingCartIcon className="h-4 w-4" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
            
            <Link
              href={`/products/${product.id}`}
              className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 