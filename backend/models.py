from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, Date, Text, Numeric, DateTime
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.dialects.postgresql import JSONB

Base = declarative_base()

class Card(Base):
    __tablename__ = 'cards'
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    type = Column(String)
    attribute = Column(String)
    level = Column(Integer)
    race = Column(String)
    attack = Column(Integer)
    defense = Column(Integer)
    description = Column(Text)
    imageUrl = Column(String)
    rarity = Column(String)
    set = Column(String)
    setCode = Column(String)
    cardNumber = Column(String)
    isReprint = Column(Boolean, default=False)
    isBanned = Column(Boolean, default=False)
    isLimited = Column(Boolean, default=False)
    isSemiLimited = Column(Boolean, default=False)
    createdAt = Column(String)
    updatedAt = Column(String)

class Tournament(Base):
    __tablename__ = 'tournaments'
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    date = Column(String)
    location = Column(String)
    format = Column(String)
    size = Column(Integer)
    region = Column(String)
    topCut = Column(Integer)
    decklists = relationship('Decklist', back_populates='tournament', cascade='all, delete-orphan')

class Decklist(Base):
    __tablename__ = 'decklists'
    id = Column(String, primary_key=True)
    tournamentId = Column(String, ForeignKey('tournaments.id'))
    player = Column(String)
    placement = Column(Integer)
    deckType = Column(String)
    mainDeck = Column(JSONB)
    extraDeck = Column(JSONB)
    sideDeck = Column(JSONB)
    tournament = relationship('Tournament', back_populates='decklists')

# --- Price Tracking Models ---
class Vendor(Base):
    __tablename__ = 'vendors'
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    url = Column(String)
    api_endpoint = Column(String)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

class PriceHistory(Base):
    __tablename__ = 'price_history'
    id = Column(String, primary_key=True)
    card_id = Column(String, ForeignKey('cards.id'), nullable=False)
    vendor_id = Column(String, ForeignKey('vendors.id'), nullable=False)
    price = Column(Numeric(precision=10, scale=2), nullable=False)
    currency = Column(String, nullable=False)
    condition = Column(String)  # NM, LP, MP, etc.
    rarity = Column(String)
    set_code = Column(String)
    recorded_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime)
    
    # Relationships
    card = relationship('Card')
    vendor = relationship('Vendor')

class PriceAlert(Base):
    __tablename__ = 'price_alerts'
    id = Column(String, primary_key=True)
    user_id = Column(String, nullable=False)
    card_id = Column(String, ForeignKey('cards.id'), nullable=False)
    target_price = Column(Numeric(precision=10, scale=2))
    alert_type = Column(String, nullable=False)  # 'above', 'below', 'change'
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    
    # Relationships
    card = relationship('Card') 