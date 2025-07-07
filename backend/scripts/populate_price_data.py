#!/usr/bin/env python3
"""
Script to populate the database with sample vendors and price data
"""

import sys
import os
import uuid
from datetime import datetime, timedelta
import random

# Add the parent directory to the path so we can import from the main module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import SessionLocal
from models import Vendor, PriceHistory, Card
import requests

def create_sample_vendors():
    """Create sample vendors in the database"""
    db = SessionLocal()
    
    try:
        # Check if vendors already exist
        existing_vendors = db.query(Vendor).count()
        if existing_vendors > 0:
            print(f"Vendors already exist ({existing_vendors}). Skipping vendor creation.")
            return
        
        vendors = [
            {
                'id': 'tcgplayer',
                'name': 'TCGPlayer',
                'url': 'https://www.tcgplayer.com',
                'api_endpoint': 'https://api.tcgplayer.com',
                'created_at': datetime.now(),
                'updated_at': datetime.now()
            },
            {
                'id': 'cardmarket',
                'name': 'Cardmarket',
                'url': 'https://www.cardmarket.com',
                'api_endpoint': 'https://api.cardmarket.com',
                'created_at': datetime.now(),
                'updated_at': datetime.now()
            },
            {
                'id': 'ebay',
                'name': 'eBay',
                'url': 'https://www.ebay.com',
                'api_endpoint': 'https://api.ebay.com',
                'created_at': datetime.now(),
                'updated_at': datetime.now()
            }
        ]
        
        for vendor_data in vendors:
            vendor = Vendor(**vendor_data)
            db.add(vendor)
        
        db.commit()
        print(f"Created {len(vendors)} vendors: TCGPlayer, Cardmarket, eBay")
        
    except Exception as e:
        print(f"Error creating vendors: {e}")
        db.rollback()
    finally:
        db.close()

def generate_sample_price_data():
    """Generate sample price data for existing cards"""
    db = SessionLocal()
    
    try:
        # Get all cards
        cards = db.query(Card).limit(50).all()  # Limit to first 50 cards for testing
        vendors = db.query(Vendor).all()
        
        if not vendors:
            print("No vendors found. Please run create_sample_vendors() first.")
            return
        
        print(f"Generating price data for {len(cards)} cards across {len(vendors)} vendors...")
        
        # Generate price data for the last 30 days
        base_date = datetime.now() - timedelta(days=30)
        
        for card in cards:
            for vendor in vendors:
                # Generate 30 days of price data
                for day in range(30):
                    date = base_date + timedelta(days=day)
                    
                    # Generate realistic price variations
                    base_price = random.uniform(0.50, 50.00)  # Base price between $0.50 and $50
                    
                    # Add some price volatility (some cards spike, others decline)
                    if random.random() < 0.1:  # 10% chance of a price spike
                        price_multiplier = random.uniform(1.5, 3.0)
                    elif random.random() < 0.05:  # 5% chance of a price drop
                        price_multiplier = random.uniform(0.3, 0.7)
                    else:
                        # Normal daily variation (±10%)
                        price_multiplier = random.uniform(0.9, 1.1)
                    
                    final_price = base_price * price_multiplier
                    
                    # Create price record
                    price_record = PriceHistory(
                        id=str(uuid.uuid4()),
                        card_id=card.id,
                        vendor_id=vendor.id,
                        price=round(final_price, 2),
                        currency='USD',
                        condition='NM',  # Near Mint
                        rarity=card.rarity.split(',')[0] if card.rarity else 'Common',
                        set_code=card.setCode.split(',')[0] if card.setCode else None,
                        recorded_at=date,
                        created_at=datetime.now()
                    )
                    
                    db.add(price_record)
        
        db.commit()
        print(f"Generated price data for {len(cards)} cards across {len(vendors)} vendors")
        
    except Exception as e:
        print(f"Error generating price data: {e}")
        db.rollback()
    finally:
        db.close()

def main():
    """Main function to populate the database"""
    print("Populating price tracking data...")
    
    # Create vendors
    create_sample_vendors()
    
    # Generate price data
    generate_sample_price_data()
    
    print("Price tracking data population complete!")

if __name__ == "__main__":
    main() 