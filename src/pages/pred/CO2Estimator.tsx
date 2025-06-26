import { useState } from 'react';

function CO2Estimator() {
  const [wasteAmount, setWasteAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [wasteType, setWasteType] = useState('general');
  const [co2Saved, setCo2Saved] = useState<number | null>(null);

  const handleCalculate = () => {
    // Placeholder calculation formula
    const amount = parseFloat(wasteAmount);
    const time = parseFloat(duration);
    const typeFactor = wasteType === 'fruit' ? 1.1 : wasteType === 'veg' ? 1.05 : 1;

    if (!isNaN(amount) && !isNaN(time)) {
      const savings = amount * 0.0042 * time * typeFactor * 28; // simplified CH₄ GWP
      setCo2Saved(savings);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">ESTIMATE YOUR CARBON SAVINGS</h1>

      <div className="mb-4">
        <label className="block font-semibold">Amount of food waste composted (kg)</label>
        <input
          type="number"
          value={wasteAmount}
          onChange={(e) => setWasteAmount(e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
          placeholder="e.g., 10"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Duration (weeks)</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
          placeholder="e.g., 4"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Type of Waste</label>
        <select
          value={wasteType}
          onChange={(e) => setWasteType(e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
        >
          <option value="general">General Food Waste</option>
          <option value="fruit">Fruit Scraps</option>
          <option value="veg">Vegetable Scraps</option>
        </select>
      </div>

      <button
        onClick={handleCalculate}
        className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition"
      >
        Calculate CO₂ Saved
      </button>

      {co2Saved !== null && (
        <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-900 rounded-md">
          <p className="font-semibold">RESULT:</p>
          <p>You saved approximately <strong>{co2Saved.toFixed(2)} kg CO₂e</strong> through composting!</p>
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-200 rounded-md">
        <p className="font-semibold">Explanations using XAI</p>
        <p className="text-sm text-gray-700">The estimate is based on methane emissions avoided from landfill disposal and the global warming potential of CH₄ (x28 CO₂e).</p>
      </div>
    </div>
  );
}

export default CO2Estimator;
