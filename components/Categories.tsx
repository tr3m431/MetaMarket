'use client'

import Link from 'next/link'
import { 
  ComputerDesktopIcon, 
  CameraIcon, 
  MusicalNoteIcon, 
  BookOpenIcon,
  PaintBrushIcon,
  PuzzlePieceIcon
} from '@heroicons/react/24/outline'

const categories = [
  {
    id: 'tech',
    name: 'Technology',
    description: 'Latest gadgets and software',
    icon: ComputerDesktopIcon,
    color: 'bg-blue-500',
    href: '/categories/technology'
  },
  {
    id: 'photography',
    name: 'Photography',
    description: 'Digital art and photos',
    icon: CameraIcon,
    color: 'bg-purple-500',
    href: '/categories/photography'
  },
  {
    id: 'music',
    name: 'Music',
    description: 'Audio tracks and instruments',
    icon: MusicalNoteIcon,
    color: 'bg-green-500',
    href: '/categories/music'
  },
  {
    id: 'books',
    name: 'Books & Writing',
    description: 'E-books and digital content',
    icon: BookOpenIcon,
    color: 'bg-orange-500',
    href: '/categories/books'
  },
  {
    id: 'art',
    name: 'Art & Design',
    description: 'Creative designs and artwork',
    icon: PaintBrushIcon,
    color: 'bg-pink-500',
    href: '/categories/art'
  },
  {
    id: 'games',
    name: 'Games',
    description: 'Digital games and entertainment',
    icon: PuzzlePieceIcon,
    color: 'bg-red-500',
    href: '/categories/games'
  }
]

export default function Categories() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explore Categories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover products across various categories, from technology to creative arts
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${category.color} text-white group-hover:scale-110 transition-transform duration-200`}>
                  <category.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {category.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
} 