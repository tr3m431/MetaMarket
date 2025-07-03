'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  StarIcon, 
  HeartIcon, 
  ShoppingCartIcon,
  ShareIcon,
  ArrowLeftIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/solid'
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline'
import { useCart } from '@/contexts/CartContext'

interface Product {
  id: string
  name: string
  description: string
  longDescription: string
  price: number
  originalPrice?: number
  image: string
  images: string[]
  category: string
  seller: string
  rating: number
  reviews: number
  features: string[]
  tags: string[]
  fileSize?: string
  fileType?: string
  license?: string
  downloads: number
  lastUpdated: string
}

interface Review {
  id: string
  user: string
  rating: number
  comment: string
  date: string
  helpful: number
}

// Mock data - in a real app, this would come from an API
const mockProduct: Product = {
  id: '1',
  name: 'Premium Digital Art Collection',
  description: 'High-quality digital artwork perfect for wallpapers and prints',
  longDescription: 'This comprehensive digital art collection features over 50 high-resolution artworks created by professional artists. Each piece is carefully crafted to provide stunning visuals for your creative projects. Perfect for wallpapers, prints, digital displays, and commercial use.',
  price: 29.99,
  originalPrice: 49.99,
  image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
  images: [
    'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop'
  ],
  category: 'Art & Design',
  seller: 'CreativeStudio',
  rating: 4.8,
  reviews: 124,
  features: [
    '50+ High-resolution artworks',
    'Multiple file formats (PNG, JPG, SVG)',
    'Commercial license included',
    'Lifetime updates',
    '24/7 support',
    'Easy download system'
  ],
  tags: ['digital art', 'wallpapers', 'prints', 'commercial use', 'high resolution'],
  fileSize: '2.5 GB',
  fileType: 'ZIP Archive',
  license: 'Commercial License',
  downloads: 1247,
  lastUpdated: '2024-01-15'
}

const mockReviews: Review[] = [
  {
    id: '1',
    user: 'Sarah M.',
    rating: 5,
    comment: 'Absolutely stunning collection! The quality is exceptional and the variety is amazing. Perfect for my design projects.',
    date: '2024-01-20',
    helpful: 12
  },
  {
    id: '2',
    user: 'Mike R.',
    rating: 4,
    comment: 'Great value for money. The artworks are high quality and the download process was smooth.',
    date: '2024-01-18',
    helpful: 8
  },
  {
    id: '3',
    user: 'Emma L.',
    rating: 5,
    comment: 'Love this collection! Using it for my website backgrounds and it looks professional.',
    date: '2024-01-15',
    helpful: 15
  }
]

export default function ProductPage({ params }: { params: { id: string } }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { addItem } = useCart()

  const product = mockProduct // In real app, fetch by params.id
  const reviews = mockReviews

  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0

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
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-700">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-gray-700">Products</Link>
            <span>/</span>
            <Link href={`/categories/${product.category.toLowerCase().replace(' & ', '-')}`} className="hover:text-gray-700">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
              />
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
              >
                {isFavorite ? (
                  <HeartIcon className="h-5 w-5 text-red-500" />
                ) : (
                  <HeartOutlineIcon className="h-5 w-5 text-gray-400 hover:text-red-500" />
                )}
              </button>
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
                  -{discount}%
                </div>
              )}
            </div>
            
            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square bg-white rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-primary-500' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{product.description}</p>
              
              {/* Rating */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">{product.downloads} downloads</span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
                )}
                {discount > 0 && (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-md text-sm font-medium">
                    Save ${(product.originalPrice! - product.price).toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Seller</p>
                  <p className="font-medium text-gray-900">{product.seller}</p>
                </div>
                <Link
                  href={`/seller/${product.seller}`}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View Profile
                </Link>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Category:</span>
                  <span className="ml-2 text-gray-900">{product.category}</span>
                </div>
                <div>
                  <span className="text-gray-500">File Size:</span>
                  <span className="ml-2 text-gray-900">{product.fileSize}</span>
                </div>
                <div>
                  <span className="text-gray-500">File Type:</span>
                  <span className="ml-2 text-gray-900">{product.fileType}</span>
                </div>
                <div>
                  <span className="text-gray-500">License:</span>
                  <span className="ml-2 text-gray-900">{product.license}</span>
                </div>
                <div>
                  <span className="text-gray-500">Last Updated:</span>
                  <span className="ml-2 text-gray-900">{product.lastUpdated}</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Included</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <CheckIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {isAddingToCart ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCartIcon className="h-5 w-5" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <ShareIcon className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <ExclamationTriangleIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Instant Download</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Get immediate access to your files after purchase. No waiting, no shipping costs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Description</h2>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <p className="text-gray-700 leading-relaxed">{product.longDescription}</p>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
            <button className="text-primary-600 hover:text-primary-700 font-medium">
              Write a Review
            </button>
          </div>
          
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-medium text-gray-900">{review.user}</p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <p className="text-gray-700 mb-3">{review.comment}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <button className="hover:text-gray-700">Helpful ({review.helpful})</button>
                  <button className="hover:text-gray-700">Reply</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 