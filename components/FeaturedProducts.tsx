'use client'

import { useState, useEffect } from 'react'
import ProductCard from './ProductCard'

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

interface FeaturedProductsProps {
  searchQuery: string
}

// Mock data - in a real app, this would come from an API
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Digital Art Collection',
    description: 'High-quality digital artwork perfect for wallpapers and prints',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
    category: 'Art & Design',
    seller: 'CreativeStudio',
    rating: 4.8,
    reviews: 124
  },
  {
    id: '2',
    name: 'Professional Photography Template',
    description: 'Complete photography workflow template for Lightroom',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    category: 'Photography',
    seller: 'PhotoPro',
    rating: 4.9,
    reviews: 89
  },
  {
    id: '3',
    name: 'Original Music Track',
    description: 'Exclusive royalty-free music track for your projects',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    category: 'Music',
    seller: 'SoundWave',
    rating: 4.7,
    reviews: 156
  },
  {
    id: '4',
    name: 'E-Book: Digital Marketing Guide',
    description: 'Comprehensive guide to modern digital marketing strategies',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
    category: 'Books & Writing',
    seller: 'MarketingExpert',
    rating: 4.6,
    reviews: 203
  },
  {
    id: '5',
    name: 'Mobile App UI Kit',
    description: 'Complete UI kit for mobile app development',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
    category: 'Technology',
    seller: 'DesignLab',
    rating: 4.9,
    reviews: 78
  },
  {
    id: '6',
    name: 'Indie Game: Pixel Adventure',
    description: 'Retro-style pixel art adventure game',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop',
    category: 'Games',
    seller: 'GameDev',
    rating: 4.5,
    reviews: 342
  }
]

export default function FeaturedProducts({ searchQuery }: FeaturedProductsProps) {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    let filtered = mockProducts

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    setProducts(filtered)
  }, [searchQuery, selectedCategory])

  const categories = ['all', ...Array.from(new Set(mockProducts.map(p => p.category)))]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover handpicked products from our community of creators
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category === 'all' ? 'All Categories' : category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No products found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </section>
  )
} 