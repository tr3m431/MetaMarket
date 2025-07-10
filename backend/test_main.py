import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_get_cards():
    response = client.get("/cards?limit=2&offset=0")
    assert response.status_code == 200
    data = response.json()
    assert "cards" in data
    assert isinstance(data["cards"], list)
    assert "total" in data
    assert isinstance(data["total"], int)
    if data["cards"]:
        # Test detail endpoint for the first card
        card_id = data["cards"][0]["id"]
        detail_resp = client.get(f"/cards/{card_id}")
        assert detail_resp.status_code == 200
        card_data = detail_resp.json()
        assert card_data["id"] == card_id

def test_get_tournaments():
    response = client.get("/tournaments")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list) 