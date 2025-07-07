import os
import sys
import requests
from bs4 import BeautifulSoup
from bs4.element import Tag
from datetime import datetime, timedelta
import time

# Add backend to path for DB access
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import SessionLocal
from models import Tournament, Decklist

TCGPLAYER_DECKS_URL = 'https://www.tcgplayer.com/content/yugioh/decks/'

# Helper to parse date from TCGPlayer (e.g., '5/20/2024')
def parse_tcgplayer_date(date_str):
    try:
        return datetime.strptime(date_str, '%m/%d/%Y').strftime('%Y-%m-%d')
    except Exception:
        return date_str

def fetch_events():
    events = []
    one_year_ago = datetime.now() - timedelta(days=365)
    page = 1
    while True:
        url = f'{TCGPLAYER_DECKS_URL}?page={page}'
        print(f"Scraping {url}")
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        deck_rows = soup.select('tr.deck-row')
        print(f"Found {len(deck_rows)} deck rows on page {page}.")
        if not deck_rows:
            print("No deck rows found. HTML snippet:")
            print(soup.prettify()[:2000])  # Print first 2000 chars for inspection
            break
        stop = False
        for row in deck_rows:
            # Event info is in the 'Event' column
            event_cell = row.select_one('td.event')
            if not event_cell:
                continue
            event_link = event_cell.find('a')
            event_name = event_link.text.strip() if event_link and hasattr(event_link, 'text') and event_link.text else event_cell.text.strip()
            event_url = None
            if event_link and isinstance(event_link, Tag) and event_link.has_attr('href'):
                event_url = 'https://www.tcgplayer.com' + str(event_link['href'])
            # Date is in the 'Date' column
            date_cell = row.select_one('td.date')
            date_str = date_cell.text.strip() if date_cell else ''
            date_parsed = parse_tcgplayer_date(date_str)
            # Stop if event is older than a year
            try:
                if datetime.strptime(date_parsed, '%Y-%m-%d') < one_year_ago:
                    stop = True
                    break
            except Exception:
                pass
            # Format and region are not always present
            format_cell = row.select_one('td.format')
            format_ = format_cell.text.strip() if format_cell else ''
            region = ''  # Not available on TCGPlayer
            location = ''  # Not available on TCGPlayer
            # Add event if not already in list
            event_id = f"{event_name}-{date_parsed}"
            if not any(e['id'] == event_id for e in events):
                events.append({
                    'id': event_id,
                    'name': event_name,
                    'date': date_parsed,
                    'location': location,
                    'format': format_,
                    'region': region,
                    'event_url': event_url,
                    'decklists': []
                })
        if stop:
            break
        page += 1
        time.sleep(1)  # Be polite to TCGPlayer
    # Now, for each event, fetch decklists
    for event in events:
        if not event['event_url']:
            continue
        print(f"Scraping decklists for event: {event['name']} ({event['date']})")
        try:
            resp = requests.get(event['event_url'])
            resp.raise_for_status()
            soup = BeautifulSoup(resp.text, 'html.parser')
            deck_rows = soup.select('tr.deck-row')
            for row in deck_rows:
                player_cell = row.select_one('td.player')
                player = player_cell.text.strip() if player_cell else ''
                placement_cell = row.select_one('td.placement')
                placement = int(placement_cell.text.strip().replace('th','').replace('st','').replace('nd','').replace('rd','')) if placement_cell and placement_cell.text.strip().isdigit() else 0
                deck_name_cell = row.select_one('td.deck a')
                deck_name = deck_name_cell.text.strip() if deck_name_cell and deck_name_cell.text else ''
                deck_url = None
                if deck_name_cell and isinstance(deck_name_cell, Tag) and deck_name_cell.has_attr('href'):
                    deck_url = 'https://www.tcgplayer.com' + str(deck_name_cell['href'])
                # Fetch card list from deck page
                main_deck, extra_deck, side_deck = [], [], []
                if deck_url:
                    try:
                        deck_resp = requests.get(deck_url)
                        deck_resp.raise_for_status()
                        deck_soup = BeautifulSoup(deck_resp.text, 'html.parser')
                        # Main Deck
                        for card_row in deck_soup.select('div#main-deck .deck-card'):
                            qty_elem = card_row.select_one('.deck-card-qty')
                            name_elem = card_row.select_one('.deck-card-name')
                            if qty_elem and name_elem:
                                try:
                                    qty = int(qty_elem.text.strip())
                                except Exception:
                                    qty = 1
                                name = name_elem.text.strip()
                                main_deck.append({'cardId': name, 'quantity': qty, 'card': None})
                        # Extra Deck
                        for card_row in deck_soup.select('div#extra-deck .deck-card'):
                            qty_elem = card_row.select_one('.deck-card-qty')
                            name_elem = card_row.select_one('.deck-card-name')
                            if qty_elem and name_elem:
                                try:
                                    qty = int(qty_elem.text.strip())
                                except Exception:
                                    qty = 1
                                name = name_elem.text.strip()
                                extra_deck.append({'cardId': name, 'quantity': qty, 'card': None})
                        # Side Deck
                        for card_row in deck_soup.select('div#side-deck .deck-card'):
                            qty_elem = card_row.select_one('.deck-card-qty')
                            name_elem = card_row.select_one('.deck-card-name')
                            if qty_elem and name_elem:
                                try:
                                    qty = int(qty_elem.text.strip())
                                except Exception:
                                    qty = 1
                                name = name_elem.text.strip()
                                side_deck.append({'cardId': name, 'quantity': qty, 'card': None})
                    except Exception as e:
                        print(f"Error scraping deck page: {deck_url}: {e}")
                event['decklists'].append({
                    'id': f"{event['id']}-{player}",
                    'tournamentId': event['id'],
                    'player': player,
                    'placement': placement,
                    'mainDeck': main_deck,
                    'extraDeck': extra_deck,
                    'sideDeck': side_deck,
                    'deckType': deck_name
                })
        except Exception as e:
            print(f"Error scraping event page: {event['event_url']}: {e}")
        time.sleep(1)
    return events

def store_events(events):
    db = SessionLocal()
    added = 0
    for event in events:
        exists = db.query(Tournament).filter_by(name=event['name'], date=event['date']).first()
        if not exists:
            t = Tournament(
                id=event['id'],
                name=event['name'],
                date=event['date'],
                location=event['location'],
                format=event['format'],
                region=event['region'],
                size=0,
                topCut=0
            )
            db.add(t)
            added += 1
        # Store decklists
        for deck in event['decklists']:
            exists_deck = db.query(Decklist).filter_by(id=deck['id']).first()
            if not exists_deck:
                d = Decklist(
                    id=deck['id'],
                    tournamentId=deck['tournamentId'],
                    player=deck['player'],
                    placement=deck['placement'],
                    mainDeck=deck['mainDeck'],
                    extraDeck=deck['extraDeck'],
                    sideDeck=deck['sideDeck'],
                    deckType=deck['deckType']
                )
                db.add(d)
    db.commit()
    db.close()
    print(f"Added {added} new tournaments.")

def main():
    print("Fetching events from TCGPlayer Yu-Gi-Oh! Decks...")
    events = fetch_events()
    print(f"Found {len(events)} events.")
    store_events(events)

if __name__ == '__main__':
    main() 