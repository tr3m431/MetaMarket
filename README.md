# MetaMarket - Yu-Gi-Oh! Card Value Tracker & Predictor

An AI-powered web application that tracks, analyzes, and predicts Yu-Gi-Oh! card values based on meta trends, tournament results, and product releases.

## 🎯 Core Functionalities

### 1. Card Price Tracking
- Track prices over time from vendors (TCGPlayer, Cardmarket)
- View graphs of price history for each card by version/rarity
- Allow comparison across multiple vendors
- Cache recent data for fast reloads

### 2. Meta Usage & Event Insights
- Scrape or manually enter tournament top cut data
- Link cards to decks and decks to events
- Display usage stats of a card in meta over time
- Include data filters (format, event size, region)

### 3. Price Prediction
- Time series and ML-based price forecasting
- Use features such as:
  - Past price history (lag features)
  - Deck usage rate in top tournaments
  - Banlist proximity
  - Set/reprint announcements
- Show forecasted change (direction, magnitude, confidence)
- Provide simple explanations ("card spiked in top decks at YCS")

### 4. User Accounts and Watchlists
- Register/login with Supabase Auth or Clerk.dev
- Users can:
  - Save watchlist of cards
  - Enable alert preferences
  - See predicted trends for their tracked cards

### 5. Alerts and Notifications
- Notify users via email or push when:
  - A card on their watchlist is predicted to spike or drop
  - A new event is detected with relevant deck usage
  - Banlist updates or reprint announcements affect tracked cards

### 6. Set & Reprint Tracker
- Track official set release calendar
- Tag cards likely to be reprinted
- Show reprint probability as part of price prediction
- Maintain a history of reprints per card

### 7. Admin & Scraping Dashboard
- Scraper monitoring and data inspection
- Manual override/correction of card usage in decks
- Logs of latest data imports (decklists, prices, sets)

## 🛠️ Technical Stack

### Frontend
- **Framework**: Next.js 14 + TypeScript
- **Styling**: Tailwind CSS
- **Charting**: Recharts
- **Icons**: Heroicons
- **Date Handling**: date-fns

### Backend/API (Future)
- **Framework**: FastAPI (Python)
- **Models**: LightGBM / Prophet / XGBoost
- **Serving**: REST endpoints for predictions and queries
- **Queueing**: Celery + Redis for background scraping, model runs

### Database (Future)
- **Primary**: PostgreSQL (via Supabase)
- **Tables**: Cards, Prices, Events, Decks, Predictions, Users/Watchlists

### Storage (Future)
- AWS S3 / Supabase Storage for decklist files, images

### Scraping (Future)
- **Tools**: BeautifulSoup, Playwright
- **Sources**: TCGPlayer, YugiohTopDecks, YGOrganization, Reddit
- **Schedule**: Regular scraping (daily/weekly)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd metamarket-yugioh-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Features in Development

### MVP Phase
- [x] Basic card search and display
- [x] Price history charts
- [x] User authentication system
- [x] Watchlist functionality
- [ ] Tournament data integration
- [ ] Price prediction models

### Future Additions
- [ ] Discord bot integration
- [ ] Historical banlist change predictor
- [ ] Community-contributed matchup logs
- [ ] Resale arbitrage alerts (TCGPlayer vs Cardmarket spreads)

## 🏗️ Project Structure

```
app/
├── cards/           # Card detail pages
├── events/          # Tournament events
├── meta/            # Meta analysis
├── dashboard/       # User dashboard
├── admin/           # Admin panel
└── api/             # API routes

components/
├── charts/          # Chart components
├── cards/           # Card display components
├── events/          # Event components
└── ui/              # Reusable UI components

contexts/
├── AuthContext.tsx  # Authentication
└── WatchlistContext.tsx # Watchlist management

lib/
├── api/             # API utilities
├── charts/          # Chart configurations
└── utils/           # Utility functions
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Yu-Gi-Oh! community for inspiration
- TCGPlayer and Cardmarket for data sources
- Tournament organizers for deck data 
