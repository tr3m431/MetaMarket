from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, Date, Text
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