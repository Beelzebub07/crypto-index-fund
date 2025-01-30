# Crypto Index Fund Calculator API

This FastAPI-based application calculates the allocation of capital into a cryptocurrency index fund based on market capitalization. It helps distribute a given total capital among different assets proportionally, considering an asset cap.

## Features
- Calculates fund allocation based on market capitalization.
- Ensures proper distribution of capital within a specified asset cap.
- Provides allocation in ZAR and cryptocurrency units.
- Returns results in JSON format for easy integration.

## Installation & Setup

### Clone the Repository

git clone https://github.com/your-username/crypto-index-fund.git
cd crypto-index-fund

###Create a Virtual Environment (Optional but Recommended)

python -m venv venv
source venv/bin/activate  # On macOS/Linux
venv\Scripts\activate     # On Windows

### Install Dependencies

pip install fastapi pydantic uvicorn

### Running the API
Start the FastAPI server with:

uvicorn main:app --reload

###The server will be available at:
http://127.0.0.1:8000

### API Usage

Endpoint: Calculate Fund Allocation
URL: POST /calculate
Description: Takes in market capitalization data and distributes total capital accordingly.
Request Body (JSON):
json

{
  "asset_cap": 0.5,
  "total_capital": 1000,
  "coins": [
    { "symbol": "BTC", "market_cap": 20000, "price": 80 },
    { "symbol": "ETH", "market_cap": 10000, "price": 25 },
    { "symbol": "LTC", "market_cap": 5000, "price": 10 }
  ]
}
Response Example:
json
Copy
Edit
[
  { "symbol": "BTC", "amount": 10.0, "price": 80, "allocation_percentage": 50.0 },
  { "symbol": "ETH", "amount": 13.333, "price": 25, "allocation_percentage": 33.33 },
  { "symbol": "LTC", "amount": 16.667, "price": 10, "allocation_percentage": 16.67 }
]

### Testing the API
Using CURL

curl -X 'POST' \
  'http://127.0.0.1:8000/calculate' \
  -H 'Content-Type: application/json' \
  -d '{
    "asset_cap": 0.5,
    "total_capital": 1000,
    "coins": [
      { "symbol": "BTC", "market_cap": 20000, "price": 80 },
      { "symbol": "ETH", "market_cap": 10000, "price": 25 },
      { "symbol": "LTC", "market_cap": 5000, "price": 10 }
    ]
  }'

Using Postman
Open Postman.
Set Method to POST.
Enter URL: http://127.0.0.1:8000/calculate
Go to Body → raw → JSON, paste the request body.
Click Send.

Troubleshooting
Server not running? Ensure uvicorn main:app --reload is executed.
Missing dependencies? Run pip install -r requirements.txt if using a requirements file.
Incorrect allocations? Ensure you're passing valid data with correct market caps and prices.


Developed by Keeveshin Perumal.

