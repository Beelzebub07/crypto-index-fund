import React, { useState } from "react";
import axios from "axios";

function App() {
  const [formData, setFormData] = useState({
    assetCap: "",
    totalCapital: "",
    coins: [{ symbol: "", marketCap: "", price: "" }],
  });
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState("Checking...");

  // Check if the backend is running
  React.useEffect(() => {
    axios
      .get("http://localhost:8000/docs")
      .then(() => setBackendStatus("✅ Backend Connected"))
      .catch(() => setBackendStatus("❌ Backend Not Found"));
  }, []);

  const handleInputChange = (e, index, field) => {
    const coins = [...formData.coins];
    coins[index][field] = e.target.value;
    setFormData({ ...formData, coins });
  };

  const addCoin = () => {
    setFormData({
      ...formData,
      coins: [...formData.coins, { symbol: "", marketCap: "", price: "" }],
    });
  };

  const handleSubmit = async () => {
    setError(null); // Reset errors

    // Validate input
    if (!formData.assetCap || !formData.totalCapital) {
      setError("Asset Cap and Total Capital are required.");
      return;
    }
    if (formData.coins.some((c) => !c.symbol || !c.marketCap || !c.price)) {
      setError("All coin fields (Symbol, Market Cap, Price) must be filled.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/calculate", {
        asset_cap: parseFloat(formData.assetCap),
        total_capital: parseFloat(formData.totalCapital),
        coins: formData.coins.map((coin) => ({
          symbol: coin.symbol,
          market_cap: parseFloat(coin.marketCap),
          price: parseFloat(coin.price),
        })),
      });
      setResults(response.data);
    } catch (error) {
      setError("Failed to connect to the backend. Check if FastAPI is running.");
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>Crypto Index Fund Calculator</h1>

      <p style={{ color: backendStatus.includes("❌") ? "red" : "green" }}>
        {backendStatus}
      </p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <label>Asset Cap:</label>
        <input
          type="number"
          step="0.01"
          value={formData.assetCap}
          onChange={(e) => setFormData({ ...formData, assetCap: e.target.value })}
        />
        <label>Total Capital:</label>
        <input
          type="number"
          value={formData.totalCapital}
          onChange={(e) => setFormData({ ...formData, totalCapital: e.target.value })}
        />
      </div>

      <div>
        {formData.coins.map((coin, index) => (
          <div key={index}>
            <label>Symbol:</label>
            <input
              type="text"
              value={coin.symbol}
              onChange={(e) => handleInputChange(e, index, "symbol")}
            />
            <label>Market Cap:</label>
            <input
              type="number"
              value={coin.marketCap}
              onChange={(e) => handleInputChange(e, index, "marketCap")}
            />
            <label>Price:</label>
            <input
              type="number"
              value={coin.price}
              onChange={(e) => handleInputChange(e, index, "price")}
            />
          </div>
        ))}
        <button onClick={addCoin}>Add Coin</button>
      </div>

      <button onClick={handleSubmit}>Calculate</button>

      <div>
        <h2>Results:</h2>
        <ul>
          {results.map((result, index) => (
            <li key={index}>
              {result.symbol}: {result.allocation_percentage.toFixed(2)}% (
              {result.amount.toFixed(2)} units at ZAR {result.price})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
