from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi import Depends
from database import SessionLocal
from models import Tournament as TournamentModel, Decklist as DecklistModel, Card as CardModel
from models import Vendor as VendorModel, PriceHistory as PriceHistoryModel, PriceAlert as PriceAlertModel
from models import Base
from datetime import datetime
import requests
import asyncio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or ["http://localhost:3000"] for frontend only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# YGOPRODeck API URL
YGOPRODECK_API = "https://db.ygoprodeck.com/api/v7/cardinfo.php"

# Map YGOPRODeck card data to your CardModel fields
def map_card(ygocard):
    return {
        'id': str(ygocard.get('id', '')),
        'name': ygocard.get('name', ''),
        'type': ygocard.get('type', ''),
        'attribute': ygocard.get('attribute'),
        'level': ygocard.get('level'),
        'race': ygocard.get('race'),
        'attack': ygocard.get('atk'),
        'defense': ygocard.get('def'),
        'description': ygocard.get('desc', ''),
        'imageUrl': ygocard.get('card_images', [{}])[0].get('image_url', ''),
        'rarity': ', '.join([setinfo.get('rarity', '') for setinfo in ygocard.get('card_sets', [])]),
        'set': ', '.join([setinfo.get('set_name', '') for setinfo in ygocard.get('card_sets', [])]),
        'setCode': ', '.join([setinfo.get('set_code', '') for setinfo in ygocard.get('card_sets', [])]),
        'cardNumber': ygocard.get('id', ''),
        'isReprint': False,  # Not directly available
        'isBanned': False,   # Not directly available
        'isLimited': False,  # Not directly available
        'isSemiLimited': False, # Not directly available
        'createdAt': '',
        'updatedAt': '',
    }

def populate_cards_on_startup():
    """Populate cards table on startup if empty"""
    try:
        db = SessionLocal()
        card_count = db.query(CardModel).count()
        
        if card_count == 0:
            print("Cards table is empty. Populating from YGOPRODeck...")
            
            # Fetch cards from YGOPRODeck
            response = requests.get(YGOPRODECK_API)
            response.raise_for_status()
            data = response.json()
            cards = data.get('data', [])
            
            print(f"Fetched {len(cards)} cards from YGOPRODeck")
            
            # Insert only TCG cards into database
            tcg_count = 0
            for ygocard in cards:
                card_sets = ygocard.get('card_sets', [])
                # Only add if at least one set is not OCG and not Speed Duel
                has_tcg_set = any('OCG' not in setinfo.get('set_name', '') and 'Speed Duel' not in setinfo.get('set_name', '') for setinfo in card_sets)
                if not has_tcg_set:
                    continue
                card_data = map_card(ygocard)
                db_card = CardModel(**card_data)
                db.add(db_card)
                tcg_count += 1
            
            db.commit()
            print(f"Successfully populated {tcg_count} TCG cards into database")
        else:
            print(f"Cards table already has {card_count} cards. Skipping population.")
            
    except Exception as e:
        print(f"Error populating cards: {e}")
    finally:
        db.close()

# Populate cards on startup
populate_cards_on_startup()

# Scrape and populate events on startup
try:
    from scripts.scrape_events import fetch_events, store_events
    events = fetch_events()
    print(f"Fetched {len(events)} events from official site.")
    store_events(events)
except Exception as e:
    print(f"Error scraping events on startup: {e}")

# --- Models ---
class Card(BaseModel):
    id: str
    name: str
    type: str
    attribute: Optional[str] = None
    level: Optional[int] = None
    race: Optional[str] = None
    attack: Optional[int] = None
    defense: Optional[int] = None
    description: str
    imageUrl: str
    rarity: str
    set: str
    setCode: str
    cardNumber: str
    isReprint: bool
    isBanned: bool
    isLimited: bool
    isSemiLimited: bool
    createdAt: str
    updatedAt: str

class DeckCard(BaseModel):
    cardId: str
    quantity: int
    card: Card

class Decklist(BaseModel):
    id: str
    tournamentId: str
    player: str
    placement: int
    mainDeck: List[DeckCard]
    extraDeck: List[DeckCard]
    sideDeck: List[DeckCard]
    deckType: str

class Tournament(BaseModel):
    id: str
    name: str
    date: str
    location: str
    format: str
    size: int
    region: str
    topCut: int
    decklists: List[Decklist]

# --- Price Tracking Models ---
class Vendor(BaseModel):
    id: str
    name: str
    url: Optional[str] = None
    api_endpoint: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

class PriceHistory(BaseModel):
    id: str
    card_id: str
    vendor_id: str
    price: float
    currency: str
    condition: Optional[str] = None
    rarity: Optional[str] = None
    set_code: Optional[str] = None
    recorded_at: datetime
    created_at: Optional[datetime] = None

class PriceAlert(BaseModel):
    id: str
    user_id: str
    card_id: str
    target_price: Optional[float] = None
    alert_type: str  # 'above', 'below', 'change'
    is_active: bool = True
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "MetaMarket FastAPI backend is running!"}

# --- Tournament Endpoints ---
@app.get("/tournaments", response_model=List[Tournament])
def get_tournaments(db: Session = Depends(get_db)):
    return db.query(TournamentModel).all()

@app.get("/tournaments/{tournament_id}", response_model=Tournament)
def get_tournament(tournament_id: str, db: Session = Depends(get_db)):
    tournament = db.query(TournamentModel).filter(TournamentModel.id == tournament_id).first()
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")
    return tournament

@app.post("/tournaments", response_model=Tournament)
def create_tournament(tournament: Tournament, db: Session = Depends(get_db)):
    db_tournament = TournamentModel(**tournament.dict())
    db.add(db_tournament)
    db.commit()
    db.refresh(db_tournament)
    return db_tournament

@app.put("/tournaments/{tournament_id}", response_model=Tournament)
def update_tournament(tournament_id: str, tournament: Tournament, db: Session = Depends(get_db)):
    db_tournament = db.query(TournamentModel).filter(TournamentModel.id == tournament_id).first()
    if not db_tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")
    for key, value in tournament.dict().items():
        setattr(db_tournament, key, value)
    db.commit()
    db.refresh(db_tournament)
    return db_tournament

@app.delete("/tournaments/{tournament_id}")
def delete_tournament(tournament_id: str, db: Session = Depends(get_db)):
    db_tournament = db.query(TournamentModel).filter(TournamentModel.id == tournament_id).first()
    if not db_tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")
    db.delete(db_tournament)
    db.commit()
    return {"detail": "Tournament deleted"}

# --- Decklist Endpoints ---
@app.get("/tournaments/{tournament_id}/decklists", response_model=List[Decklist])
def get_decklists(tournament_id: str, db: Session = Depends(get_db)):
    decklists = db.query(DecklistModel).filter(DecklistModel.tournamentId == tournament_id).all()
    return decklists

@app.get("/tournaments/{tournament_id}/decklists/{decklist_id}", response_model=Decklist)
def get_decklist(tournament_id: str, decklist_id: str, db: Session = Depends(get_db)):
    decklist = db.query(DecklistModel).filter(DecklistModel.tournamentId == tournament_id, DecklistModel.id == decklist_id).first()
    if not decklist:
        raise HTTPException(status_code=404, detail="Decklist not found")
    return decklist

@app.post("/tournaments/{tournament_id}/decklists", response_model=Decklist)
def create_decklist(tournament_id: str, decklist: Decklist, db: Session = Depends(get_db)):
    db_decklist = DecklistModel(**decklist.dict())
    db.add(db_decklist)
    db.commit()
    db.refresh(db_decklist)
    return db_decklist

@app.put("/tournaments/{tournament_id}/decklists/{decklist_id}", response_model=Decklist)
def update_decklist(tournament_id: str, decklist_id: str, decklist: Decklist, db: Session = Depends(get_db)):
    db_decklist = db.query(DecklistModel).filter(DecklistModel.tournamentId == tournament_id, DecklistModel.id == decklist_id).first()
    if not db_decklist:
        raise HTTPException(status_code=404, detail="Decklist not found")
    for key, value in decklist.dict().items():
        setattr(db_decklist, key, value)
    db.commit()
    db.refresh(db_decklist)
    return db_decklist

@app.delete("/tournaments/{tournament_id}/decklists/{decklist_id}")
def delete_decklist(tournament_id: str, decklist_id: str, db: Session = Depends(get_db)):
    db_decklist = db.query(DecklistModel).filter(DecklistModel.tournamentId == tournament_id, DecklistModel.id == decklist_id).first()
    if not db_decklist:
        raise HTTPException(status_code=404, detail="Decklist not found")
    db.delete(db_decklist)
    db.commit()
    return {"detail": "Decklist deleted"}

@app.get("/cards")
def get_cards(
    limit: int = 24, 
    offset: int = 0, 
    card_type: Optional[str] = None,
    attribute: Optional[str] = None,
    spell_type: Optional[str] = None,
    trap_type: Optional[str] = None,
    monster_type: Optional[str] = None,
    rarity: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(CardModel)
    
    # Apply filters
    if card_type and card_type != 'all':
        # For Effect Monster, include all effect monsters (including ritual monsters)
        if card_type == 'Effect Monster':
            query = query.filter(CardModel.type.like('%Effect Monster%'))
        else:
            query = query.filter(CardModel.type == card_type)
    
    if attribute and attribute != 'all':
        query = query.filter(CardModel.attribute == attribute)
    
    if spell_type and spell_type != 'all':
        query = query.filter(CardModel.race == spell_type)
    
    if trap_type and trap_type != 'all':
        query = query.filter(CardModel.race == trap_type)
    
    if monster_type and monster_type != 'all':
        query = query.filter(CardModel.race == monster_type)
    
    if rarity and rarity != 'all':
        if rarity == 'Unknown':
            query = query.filter((CardModel.rarity == None) | (CardModel.rarity == ''))
        else:
            query = query.filter(CardModel.rarity == rarity)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (CardModel.name.ilike(search_term)) | 
            (CardModel.description.ilike(search_term))
        )
    
    total = query.count()
    cards = query.offset(offset).limit(limit).all()
    return { 'cards': cards, 'total': total }

@app.get("/cards/{card_id}", response_model=Card)
def get_card(card_id: str, db: Session = Depends(get_db)):
    card = db.query(CardModel).filter(CardModel.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    return card

# --- Price Tracking Endpoints ---
@app.get("/vendors", response_model=List[Vendor])
def get_vendors(db: Session = Depends(get_db)):
    return db.query(VendorModel).all()

@app.get("/vendors/{vendor_id}", response_model=Vendor)
def get_vendor(vendor_id: str, db: Session = Depends(get_db)):
    vendor = db.query(VendorModel).filter(VendorModel.id == vendor_id).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return vendor

@app.post("/vendors", response_model=Vendor)
def create_vendor(vendor: Vendor, db: Session = Depends(get_db)):
    db_vendor = VendorModel(**vendor.dict())
    db.add(db_vendor)
    db.commit()
    db.refresh(db_vendor)
    return db_vendor

@app.get("/cards/{card_id}/prices", response_model=List[PriceHistory])
def get_card_prices(
    card_id: str, 
    vendor_id: Optional[str] = None,
    days: Optional[int] = 30,
    db: Session = Depends(get_db)
):
    """Get price history for a specific card"""
    query = db.query(PriceHistoryModel).filter(PriceHistoryModel.card_id == card_id)
    
    if vendor_id:
        query = query.filter(PriceHistoryModel.vendor_id == vendor_id)
    
    # Get prices from the last N days
    from datetime import datetime, timedelta
    days_to_use = days if days is not None else 30
    cutoff_date = datetime.now() - timedelta(days=days_to_use)
    query = query.filter(PriceHistoryModel.recorded_at >= cutoff_date)
    
    # Order by recorded_at descending (most recent first)
    prices = query.order_by(PriceHistoryModel.recorded_at.desc()).all()
    return prices

@app.get("/cards/{card_id}/price-summary")
def get_card_price_summary(card_id: str, db: Session = Depends(get_db)):
    """Get current price summary for a card across all vendors"""
    from sqlalchemy import func
    from datetime import datetime, timedelta
    
    # Get the most recent price for each vendor
    subquery = db.query(
        PriceHistoryModel.vendor_id,
        func.max(PriceHistoryModel.recorded_at).label('max_date')
    ).filter(
        PriceHistoryModel.card_id == card_id,
        PriceHistoryModel.recorded_at >= datetime.now() - timedelta(days=7)  # Last 7 days
    ).group_by(PriceHistoryModel.vendor_id).subquery()
    
    prices = db.query(PriceHistoryModel).join(
        subquery,
        (PriceHistoryModel.vendor_id == subquery.c.vendor_id) &
        (PriceHistoryModel.recorded_at == subquery.c.max_date)
    ).all()
    
    return {
        "card_id": card_id,
        "prices": [
            {
                "vendor_id": price.vendor_id,
                "price": float(price.price),
                "currency": price.currency,
                "condition": price.condition,
                "recorded_at": price.recorded_at.isoformat() if price.recorded_at else None
            }
            for price in prices
        ]
    }

@app.post("/price-history", response_model=PriceHistory)
def create_price_record(price_history: PriceHistory, db: Session = Depends(get_db)):
    """Add a new price record for a card"""
    db_price = PriceHistoryModel(**price_history.dict())
    db.add(db_price)
    db.commit()
    db.refresh(db_price)
    return db_price

@app.get("/price-alerts", response_model=List[PriceAlert])
def get_price_alerts(user_id: str, db: Session = Depends(get_db)):
    """Get price alerts for a user"""
    alerts = db.query(PriceAlertModel).filter(
        PriceAlertModel.user_id == user_id,
        PriceAlertModel.is_active == True
    ).all()
    return alerts

@app.post("/price-alerts", response_model=PriceAlert)
def create_price_alert(price_alert: PriceAlert, db: Session = Depends(get_db)):
    """Create a new price alert for a user"""
    db_alert = PriceAlertModel(**price_alert.dict())
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    return db_alert
