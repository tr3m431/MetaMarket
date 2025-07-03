from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware

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

# --- In-memory storage ---
tournaments: List[Tournament] = [
    Tournament(
        id='1',
        name='YCS Las Vegas 2024',
        date='2024-01-15',
        location='Las Vegas, NV',
        format='Advanced',
        size=1024,
        region='NA',
        topCut=32,
        decklists=[
            Decklist(
                id='d1',
                tournamentId='1',
                player='Alice',
                placement=1,
                deckType='Kashtira',
                mainDeck=[
                    DeckCard(cardId='c1', quantity=3, card=Card(id='c1', name='Ash Blossom & Joyous Spring', type='Effect Monster', description='', imageUrl='', rarity='', set='', setCode='', cardNumber='', isReprint=False, isBanned=False, isLimited=False, isSemiLimited=False, createdAt='', updatedAt='')),
                    DeckCard(cardId='c2', quantity=2, card=Card(id='c2', name='Kashtira Fenrir', type='Effect Monster', description='', imageUrl='', rarity='', set='', setCode='', cardNumber='', isReprint=False, isBanned=False, isLimited=False, isSemiLimited=False, createdAt='', updatedAt='')),
                ],
                extraDeck=[],
                sideDeck=[],
            ),
            Decklist(
                id='d2',
                tournamentId='1',
                player='Bob',
                placement=2,
                deckType='Labrynth',
                mainDeck=[
                    DeckCard(cardId='c3', quantity=3, card=Card(id='c3', name='Arianna the Labrynth Servant', type='Effect Monster', description='', imageUrl='', rarity='', set='', setCode='', cardNumber='', isReprint=False, isBanned=False, isLimited=False, isSemiLimited=False, createdAt='', updatedAt='')),
                ],
                extraDeck=[],
                sideDeck=[],
            ),
        ],
    ),
    Tournament(
        id='2',
        name='YCS Chicago 2024',
        date='2024-01-08',
        location='Chicago, IL',
        format='Advanced',
        size=856,
        region='NA',
        topCut=32,
        decklists=[
            Decklist(
                id='d3',
                tournamentId='2',
                player='Carol',
                placement=1,
                deckType='Purrely',
                mainDeck=[
                    DeckCard(cardId='c4', quantity=3, card=Card(id='c4', name='Purrely', type='Effect Monster', description='', imageUrl='', rarity='', set='', setCode='', cardNumber='', isReprint=False, isBanned=False, isLimited=False, isSemiLimited=False, createdAt='', updatedAt='')),
                ],
                extraDeck=[],
                sideDeck=[],
            ),
        ],
    ),
    Tournament(
        id='3',
        name='YCS Dallas 2024',
        date='2024-01-01',
        location='Dallas, TX',
        format='Advanced',
        size=724,
        region='NA',
        topCut=32,
        decklists=[
            Decklist(
                id='d4',
                tournamentId='3',
                player='Dave',
                placement=1,
                deckType='Purrely',
                mainDeck=[
                    DeckCard(cardId='c4', quantity=3, card=Card(id='c4', name='Purrely', type='Effect Monster', description='', imageUrl='', rarity='', set='', setCode='', cardNumber='', isReprint=False, isBanned=False, isLimited=False, isSemiLimited=False, createdAt='', updatedAt='')),
                ],
                extraDeck=[],
                sideDeck=[],
            ),
        ],
    ),
]

@app.get("/")
def read_root():
    return {"message": "MetaMarket FastAPI backend is running!"}

# --- Tournament Endpoints ---
@app.get("/tournaments", response_model=List[Tournament])
def get_tournaments():
    return tournaments

@app.get("/tournaments/{tournament_id}", response_model=Tournament)
def get_tournament(tournament_id: str):
    for t in tournaments:
        if t.id == tournament_id:
            return t
    raise HTTPException(status_code=404, detail="Tournament not found")

@app.post("/tournaments", response_model=Tournament)
def create_tournament(tournament: Tournament):
    tournaments.append(tournament)
    return tournament

@app.put("/tournaments/{tournament_id}", response_model=Tournament)
def update_tournament(tournament_id: str, tournament: Tournament):
    for i, t in enumerate(tournaments):
        if t.id == tournament_id:
            tournaments[i] = tournament
            return tournament
    raise HTTPException(status_code=404, detail="Tournament not found")

@app.delete("/tournaments/{tournament_id}")
def delete_tournament(tournament_id: str):
    for i, t in enumerate(tournaments):
        if t.id == tournament_id:
            del tournaments[i]
            return {"detail": "Tournament deleted"}
    raise HTTPException(status_code=404, detail="Tournament not found")

# --- Decklist Endpoints ---
@app.get("/tournaments/{tournament_id}/decklists", response_model=List[Decklist])
def get_decklists(tournament_id: str):
    for t in tournaments:
        if t.id == tournament_id:
            return t.decklists
    raise HTTPException(status_code=404, detail="Tournament not found")

@app.get("/tournaments/{tournament_id}/decklists/{decklist_id}", response_model=Decklist)
def get_decklist(tournament_id: str, decklist_id: str):
    for t in tournaments:
        if t.id == tournament_id:
            for d in t.decklists:
                if d.id == decklist_id:
                    return d
            raise HTTPException(status_code=404, detail="Decklist not found")
    raise HTTPException(status_code=404, detail="Tournament not found")

@app.post("/tournaments/{tournament_id}/decklists", response_model=Decklist)
def create_decklist(tournament_id: str, decklist: Decklist):
    for t in tournaments:
        if t.id == tournament_id:
            t.decklists.append(decklist)
            return decklist
    raise HTTPException(status_code=404, detail="Tournament not found")

@app.put("/tournaments/{tournament_id}/decklists/{decklist_id}", response_model=Decklist)
def update_decklist(tournament_id: str, decklist_id: str, decklist: Decklist):
    for t in tournaments:
        if t.id == tournament_id:
            for i, d in enumerate(t.decklists):
                if d.id == decklist_id:
                    t.decklists[i] = decklist
                    return decklist
            raise HTTPException(status_code=404, detail="Decklist not found")
    raise HTTPException(status_code=404, detail="Tournament not found")

@app.delete("/tournaments/{tournament_id}/decklists/{decklist_id}")
def delete_decklist(tournament_id: str, decklist_id: str):
    for t in tournaments:
        if t.id == tournament_id:
            for i, d in enumerate(t.decklists):
                if d.id == decklist_id:
                    del t.decklists[i]
                    return {"detail": "Decklist deleted"}
            raise HTTPException(status_code=404, detail="Decklist not found")
    raise HTTPException(status_code=404, detail="Tournament not found")
