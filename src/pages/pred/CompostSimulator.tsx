import { useState } from 'react';

function CompostSimulator() {
  const [waste, setWaste] = useState(11);
  const [weather, setWeather] = useState('Dry');
  const [maturity, setMaturity] = useState(65);
  const [co2Saved, setCo2Saved] = useState(12.4); // kg

  const handleConfirm = () => {
    // Normally calculated via ML model or rules
    const newMaturity = Math.min(100, waste * 5 + (weather === 'Rainy' ? -10 : 0));
    setMaturity(newMaturity);
    setCo2Saved(Number((waste * 1.1).toFixed(1)));
  };

  return (
    <div className="p-6 bg-white rounded-md max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Compost Outcome Simulator</h1>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="font-semibold">Food Waste per Day (kg): {waste}kg</label>
          <input
            type="range"
            min={0}
            max={20}
            step={1}
            value={waste}
            onChange={(e) => setWaste(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="font-semibold">Weather Conditions:</label>
          <select
            value={weather}
            onChange={(e) => setWeather(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option>Dry</option>
            <option>Rainy</option>
            <option>Humid</option>
            <option>Stormy</option>
          </select>
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleConfirm}
        className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition"
      >
        Confirm
      </button>

      {/* Results */}
      <div className="mt-6 space-y-4">
        <div>
          <p className="font-semibold">Compost Estimated Maturity Level</p>
          <div className="w-full bg-gray-200 h-6 rounded">
            <div
              className="bg-yellow-500 h-6 rounded text-sm text-white text-center"
              style={{ width: `${maturity}%` }}
            >
              {maturity}%
            </div>
          </div>
        </div>

        <div>
          <p className="font-semibold">CO₂e Impact:</p>
          <p>
            🌍 CO₂e saved: <strong>{co2Saved} kg</strong> → 🌳 Equal to planting{' '}
            <strong>{(co2Saved / 9.1).toFixed(1)}</strong> trees
          </p>
        </div>

        <div className="bg-gray-100 p-4 rounded text-sm">
          <p className="font-semibold mb-1">XAI Summary:</p>
          <p>
            Higher food waste and dry weather reduce composting time.
            Rainy conditions slow down the process.
            Adjusting temperature and NPK levels can further improve quality.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CompostSimulator;
