import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { WatchlistProvider } from '@/contexts/WatchlistContext'
import { CartProvider } from '@/contexts/CartContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MetaMarket - Yu-Gi-Oh! Card Value Tracker & Predictor',
  description: 'Track, analyze, and predict Yu-Gi-Oh! card values based on meta trends, tournament results, and product releases',
  keywords: 'yugioh, trading cards, price tracking, meta analysis, tournament data, price prediction',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <AuthProvider>
            <WatchlistProvider>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
            </WatchlistProvider>
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  )
} 