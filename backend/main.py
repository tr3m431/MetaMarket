from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi import Depends
from database import SessionLocal
from models import Tournament as TournamentModel, Decklist as DecklistModel
from models import Base

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or ["http://localhost:3000"] for frontend only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
