from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change for security)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)


class Coin(BaseModel):
    symbol: str
    market_cap: float
    price: float


class FundRequest(BaseModel):
    asset_cap: float
    total_capital: float
    coins: List[Coin]

    class Config:
        schema_extra = {
            "example": {
                "asset_cap": 0.5,
                "total_capital": 1000,
                "coins": [
                    {"symbol": "BTC", "market_cap": 20000, "price": 80},
                    {"symbol": "ETH", "market_cap": 10000, "price": 25},
                    {"symbol": "LTC", "market_cap": 5000, "price": 10},
                ],
            }
        }


class FundResponse(BaseModel):
    symbol: str
    amount: float
    price: float
    allocation_percentage: float

    class Config:
        schema_extra = {
            "example": [
                {
                    "symbol": "BTC",
                    "amount": 10.0,
                    "price": 80,
                    "allocation_percentage": 50.0,
                },
                {
                    "symbol": "ETH",
                    "amount": 5.71,
                    "price": 25,
                    "allocation_percentage": 33.33,
                },
                {
                    "symbol": "LTC",
                    "amount": 7.14,
                    "price": 10,
                    "allocation_percentage": 16.67,
                },
            ]
        }


@app.post("/calculate", response_model=List[FundResponse])
def calculate_fund(fund: FundRequest):
    if fund.asset_cap <= 0 or fund.asset_cap > 1:
        raise HTTPException(status_code=400, detail="Asset cap must be between 0 and 1")
    if fund.total_capital <= 0:
        raise HTTPException(status_code=400, detail="Total capital must be positive")

    # Sort coins by market cap in descending order
    coins = sorted(fund.coins, key=lambda c: c.market_cap, reverse=True)

    # Calculate total market cap
    total_market_cap = sum(coin.market_cap for coin in coins)

    # Determine total investable capital
    investable_capital = fund.total_capital * fund.asset_cap

    # Compute correct market share weights
    weights = [coin.market_cap / total_market_cap for coin in coins]

    allocations = []
    total_allocated = 0  # Track allocated funds
    total_percentage = 0  # Track allocated percentage

    for coin, weight in zip(coins, weights):
        # Correctly distribute funds based on adjusted market cap weight
        allocated_capital = weight * investable_capital
        amount = allocated_capital / coin.price  # Convert ZAR to crypto units
        zar_value = amount * coin.price  # Confirm correct ZAR value
        allocation_percentage = (zar_value / investable_capital) * 100  # Compute %

        allocations.append(
            FundResponse(
                symbol=coin.symbol,
                amount=round(amount, 6),  # Fix precision
                price=coin.price,
                allocation_percentage=round(allocation_percentage, 4),
            )
        )

        total_allocated += zar_value  # Track total allocated ZAR
        total_percentage += allocation_percentage  # Track allocation percentage

    # Adjust last allocation to correct rounding errors
    if total_percentage != 100.0:
        difference = 100.0 - total_percentage
        allocations[-1].allocation_percentage += difference  # Adjust last entry

    return allocations
