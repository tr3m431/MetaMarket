export interface Card {
  id: string
  name: string
  type: CardType
  attribute?: string
  level?: number
  subtype?: string
  attack?: number
  defense?: number
  description: string
  imageUrl: string
  rarity: string
  set: string
  setCode: string
  cardNumber: string
  isReprint: boolean
  isBanned: boolean
  isLimited: boolean
  isSemiLimited: boolean
  createdAt: string
  updatedAt: string
}

export type CardType = 
  | 'Normal Monster'
  | 'Effect Monster'
  | 'Ritual Monster'
  | 'Fusion Monster'
  | 'Synchro Monster'
  | 'XYZ Monster'
  | 'Link Monster'
  | 'Pendulum Monster'
  | 'Spell Card'
  | 'Trap Card'

export interface CardPrice {
  id: string
  cardId: string
  vendor: Vendor
  price: number
  condition: CardCondition
  rarity: string
  setCode: string
  timestamp: string
}

export type Vendor = 'TCGPlayer' | 'Cardmarket' | 'YugiohPrices'

export type CardCondition = 'Near Mint' | 'Lightly Played' | 'Played' | 'Poor'

export interface PriceHistory {
  cardId: string
  vendor: Vendor
  prices: {
    date: string
    price: number
    condition: CardCondition
  }[]
}

export interface Tournament {
  id: string
  name: string
  date: string
  location: string
  format: TournamentFormat
  size: number
  region: string
  topCut: number
  decklists: Decklist[]
}

export type TournamentFormat = 'Advanced' | 'Traditional' | 'Sealed' | 'Draft'

export interface Decklist {
  id: string
  tournamentId: string
  player: string
  placement: number
  mainDeck: DeckCard[]
  extraDeck: DeckCard[]
  sideDeck: DeckCard[]
  deckType: string
}

export interface DeckCard {
  cardId: string
  quantity: number
  card: Card
}

export interface CardUsage {
  cardId: string
  card: Card
  usageCount: number
  usagePercentage: number
  topCutCount: number
  topCutPercentage: number
  averagePlacement: number
  tournaments: string[]
}

export interface PricePrediction {
  cardId: string
  card: Card
  currentPrice: number
  predictedPrice: number
  changeAmount: number
  changePercentage: number
  confidence: number
  direction: 'up' | 'down' | 'stable'
  explanation: string
  factors: PredictionFactor[]
  timeframe: '1week' | '1month' | '3months' | '6months'
  timestamp: string
}

export interface PredictionFactor {
  factor: string
  impact: 'positive' | 'negative' | 'neutral'
  weight: number
  description: string
}

export interface Set {
  id: string
  name: string
  code: string
  releaseDate: string
  isReprint: boolean
  cards: Card[]
}

export interface Reprint {
  id: string
  cardId: string
  originalSet: string
  reprintSet: string
  reprintDate: string
  impact: 'high' | 'medium' | 'low'
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  watchlist: WatchlistItem[]
  alertPreferences: AlertPreferences
  createdAt: string
}

export interface WatchlistItem {
  id: string
  userId: string
  cardId: string
  card: Card
  alertPrice?: number
  alertDirection?: 'up' | 'down'
  createdAt: string
}

export interface AlertPreferences {
  emailAlerts: boolean
  pushAlerts: boolean
  priceSpikeThreshold: number
  priceDropThreshold: number
  tournamentAlerts: boolean
  banlistAlerts: boolean
  reprintAlerts: boolean
}

export interface Alert {
  id: string
  userId: string
  type: AlertType
  title: string
  message: string
  cardId?: string
  card?: Card
  isRead: boolean
  createdAt: string
}

export type AlertType = 
  | 'price_spike'
  | 'price_drop'
  | 'tournament_usage'
  | 'banlist_update'
  | 'reprint_announcement'
  | 'prediction_alert'

export interface MetaAnalysis {
  cardId: string
  card: Card
  usageTrend: UsageTrend[]
  topDecks: TopDeck[]
  matchupData: MatchupData[]
  banlistProximity: number
  reprintProbability: number
}

export interface UsageTrend {
  date: string
  usagePercentage: number
  tournamentCount: number
}

export interface TopDeck {
  deckType: string
  usageCount: number
  averagePlacement: number
  recentTournaments: string[]
}

export interface MatchupData {
  opponentDeck: string
  winRate: number
  gameCount: number
  averageGameLength: number
} 