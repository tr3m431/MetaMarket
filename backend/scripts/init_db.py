import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import SessionLocal
from models import Vendor as VendorModel, Card as CardModel, PriceHistory as PriceHistoryModel
from datetime import datetime
import requests

YGOPRODECK_API = "https://db.ygoprodeck.com/api/v7/cardinfo.php"

def create_vendors():
    db = SessionLocal()
    try:
        existing = db.query(VendorModel).count()
        if existing == 0:
            vendors = [
                VendorModel(id='tcgplayer', name='TCGPlayer', url='https://www.tcgplayer.com', api_endpoint='https://api.tcgplayer.com', created_at=datetime.now(), updated_at=datetime.now()),
                VendorModel(id='ebay', name='eBay', url='https://www.ebay.com', api_endpoint='https://api.ebay.com', created_at=datetime.now(), updated_at=datetime.now()),
                VendorModel(id='cardmarket', name='Cardmarket', url='https://www.cardmarket.com', api_endpoint='https://api.cardmarket.com', created_at=datetime.now(), updated_at=datetime.now()),
            ]
            for v in vendors:
                db.add(v)
            db.commit()
            print("Vendors table populated.")
        else:
            print(f"Vendors table already has {existing} vendors. Skipping vendor population.")
    except Exception as e:
        print(f"Error populating vendors: {e}")
    finally:
        db.close()

def map_card(ygocard):
    price_info = ygocard.get('card_prices', [{}])[0]
    tcgplayer_price = price_info.get('tcgplayer_price')
    ebay_price = price_info.get('ebay_price')
    cardmarket_price = price_info.get('cardmarket_price')
    card_sets = ygocard.get('card_sets', [])
    is_reprint = len(card_sets) > 1
    banlist_info = ygocard.get('banlist_info', {})
    is_banned = bool(banlist_info.get('ban_tcg') == 'Banned')
    is_limited = bool(banlist_info.get('ban_tcg') == 'Limited')
    is_semi_limited = bool(banlist_info.get('ban_tcg') == 'Semi-Limited')
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
        'rarity': ', '.join([setinfo.get('rarity', '') for setinfo in card_sets]),
        'set': ', '.join([setinfo.get('set_name', '') for setinfo in card_sets]),
        'setCode': ', '.join([setinfo.get('set_code', '') for setinfo in card_sets]),
        'cardNumber': ygocard.get('id', ''),
        'isReprint': is_reprint,
        'isBanned': is_banned,
        'isLimited': is_limited,
        'isSemiLimited': is_semi_limited,
        'createdAt': '',
        'updatedAt': '',
        'tcgplayer_price': tcgplayer_price,
        'ebay_price': ebay_price,
        'cardmarket_price': cardmarket_price,
    }

def populate_cards_and_prices():
    db = SessionLocal()
    try:
        card_count = db.query(CardModel).count()
        if card_count == 0:
            print("Cards table is empty. Populating from YGOPRODeck...")
            response = requests.get(YGOPRODECK_API)
            response.raise_for_status()
            data = response.json()
            cards = data.get('data', [])
            print(f"Fetched {len(cards)} cards from YGOPRODeck")
            tcg_count = 0
            price_count = 0
            for ygocard in cards:
                card_sets = ygocard.get('card_sets', [])
                has_tcg_set = any('OCG' not in setinfo.get('set_name', '') and 'Speed Duel' not in setinfo.get('set_name', '') for setinfo in card_sets)
                if not has_tcg_set:
                    continue
                card_data = map_card(ygocard)
                db_card = CardModel(**{k: v for k, v in card_data.items() if k in CardModel.__table__.columns.keys()})
                db.add(db_card)
                tcg_count += 1
                now = datetime.now()
                for vendor_id, price_key, currency in [
                    ("tcgplayer", "tcgplayer_price", "USD"),
                    ("ebay", "ebay_price", "USD"),
                    ("cardmarket", "cardmarket_price", "EUR")
                ]:
                    price = card_data.get(price_key)
                    if price and price not in ("0.00", None, ""):
                        try:
                            price_val = float(price)
                        except Exception:
                            continue
                        price_record = PriceHistoryModel(
                            id=f"{db_card.id}-{vendor_id}",
                            card_id=db_card.id,
                            vendor_id=vendor_id,
                            price=price_val,
                            currency=currency,
                            condition="NM",
                            rarity=db_card.rarity.split(",")[0] if db_card.rarity else None,
                            set_code=db_card.setCode.split(",")[0] if db_card.setCode else None,
                            recorded_at=now,
                            created_at=now
                        )
                        db.add(price_record)
                        price_count += 1
            db.commit()
            print(f"Successfully populated {tcg_count} TCG cards and {price_count} price records into database")
        else:
            print(f"Cards table already has {card_count} cards. Skipping population.")
    except Exception as e:
        print(f"Error populating cards: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_vendors()
    populate_cards_and_prices() 