import { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function PlantReadyEstimator() {
  const [selectedPlant, setSelectedPlant] = useState('');
  const [moisture, setMoisture] = useState({ N: 50, P: 50, K: 50 });
  const [toggles, setToggles] = useState({ turning: 3, foodInput: 2, waterInput: 1, temp: 30 });
  const [recommendation, setRecommendation] = useState('');
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  const handleEstimate = () => {
    const baseDays = selectedPlant === 'Mint' ? 28 : 35;
    const adjustment = (toggles.turning + toggles.foodInput + toggles.waterInput) * -1 + (toggles.temp - 25) * -0.5;
    const result = Math.max(7, baseDays + adjustment);
    setDaysLeft(Math.round(result));
    setRecommendation('You are 80% there! Try adding more banana peels or turning more frequently.');
  };

  const idealNPK = {
    N: 40,
    P: 30,
    K: 30
  };

  const npkPieData = {
    labels: ['Nitrogen (N)', 'Phosphorus (P)', 'Potassium (K)'],
    datasets: [
      {
        label: 'Ideal NPK Ratio',
        data: [idealNPK.N, idealNPK.P, idealNPK.K],
        backgroundColor: ['#34d399', '#facc15', '#60a5fa'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6 bg-white rounded shadow-md max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Plant-Ready Compost Estimator</h1>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Select Plant</label>
        <select
          value={selectedPlant}
          onChange={(e) => setSelectedPlant(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">-- Select --</option>
          <option value="Mint">Mint 🌱</option>
          <option value="Tomato">Tomato 🍅</option>
          <option value="Chili">Chili 🌶️</option>
        </select>
      </div>

      <div className="bg-gray-100 p-4 rounded mb-6">
        <p className="font-bold">Ideal NPK Ratio</p>
        <div className="w-64 mx-auto mt-4">
          <Pie data={npkPieData} />
        </div>
        <p className="text-xs text-center text-gray-600 mt-4 italic">
          {selectedPlant === 'Mint'
            ? 'Mint compost typically matures in 3–4 weeks.'
            : 'Choose a plant to see baseline.'}
        </p>
      </div>

      <h2 className="font-semibold mb-2">Compare with my compost condition:</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {['N', 'P', 'K'].map((key) => (
          <div key={key}>
            <label>{key} Moisture</label>
            <input
              type="range"
              min="0"
              max="100"
              value={moisture[key as keyof typeof moisture]}
              onChange={(e) =>
                setMoisture({ ...moisture, [key]: parseInt(e.target.value) })
              }
              className="w-full"
            />
            <div className="text-center">{moisture[key as keyof typeof moisture]}%</div>
          </div>
        ))}
      </div>

      <h2 className="font-semibold mb-2">Compost Activity Settings</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label>Turning Frequency (per week)</label>
          <input
            type="number"
            min="0"
            value={toggles.turning}
            onChange={(e) => setToggles({ ...toggles, turning: parseInt(e.target.value) })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label>Amount of Food Input</label>
          <input
            type="number"
            min="0"
            value={toggles.foodInput}
            onChange={(e) => setToggles({ ...toggles, foodInput: parseInt(e.target.value) })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label>Water Added (litres/week)</label>
          <input
            type="number"
            min="0"
            value={toggles.waterInput}
            onChange={(e) => setToggles({ ...toggles, waterInput: parseInt(e.target.value) })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label>Temperature (°C)</label>
          <input
            type="number"
            min="10"
            max="50"
            value={toggles.temp}
            onChange={(e) => setToggles({ ...toggles, temp: parseInt(e.target.value) })}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <button
        onClick={handleEstimate}
        className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition"
      >
        Estimate Maturity Time
      </button>

      {daysLeft !== null && (
        <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-900 rounded-md">
          <p className="font-semibold">Estimated Time Left:</p>
          <p>{daysLeft} days to maturity.</p>
          <p className="mt-2 text-sm text-gray-700 italic">{recommendation}</p>
        </div>
      )}
    </div>
  );
}

export default PlantReadyEstimator;
