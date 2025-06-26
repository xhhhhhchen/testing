import { useState } from 'react';

function WeatherImpact() {
  const [location, setLocation] = useState('');
  const [temperature, setTemperature] = useState(30);
  const [humidity, setHumidity] = useState(60);
  const [rainfall, setRainfall] = useState(10);
  const [sunlight, setSunlight] = useState(6);
  const [type, setType] = useState('Mixed');

  const [result, setResult] = useState<{ speed: string, days: number, tip: string } | null>(null);

  const handlePredict = () => {
    let speed = 'Moderate';
    let days = 30;
    let tip = 'Conditions are suitable. Monitor moisture regularly.';

    if (temperature > 35 && humidity < 40 && sunlight > 6) {
      speed = 'Fast';
      days = 20;
      tip = 'Dry & sunny. Turn compost regularly to maintain balance.';
    } else if (rainfall > 25 || humidity > 80) {
      speed = 'Slow';
      days = 40;
      tip = 'Too wet. Add brown materials like cardboard or leaves.';
    }

    setResult({ speed, days, tip });
  };

  return (
    <div className="min-h-screen px-10 py-8 bg-gray-50 text-gray-800">
      <h1 className="text-3xl font-bold text-center mb-8">Weather Impact on Composting</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Input Panel */}
        <div className="bg-green-950 text-white p-6 rounded-xl shadow-md">
          <div className="mb-4">
            <label className="block font-semibold mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Singapore"
              className="w-full p-2 text-black rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold">Compost Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2 text-black rounded"
            >
              <option>Food scraps</option>
              <option>Garden waste</option>
              <option>Mixed</option>
            </select>
          </div>

          {/* Sliders */}
          <div className="mb-4">
            <label>Temperature: {temperature}°C</label>
            <input type="range" min={10} max={45} value={temperature} onChange={(e) => setTemperature(+e.target.value)} className="w-full" />
          </div>

          <div className="mb-4">
            <label>Humidity: {humidity}%</label>
            <input type="range" min={0} max={100} value={humidity} onChange={(e) => setHumidity(+e.target.value)} className="w-full" />
          </div>

          <div className="mb-4">
            <label>Rainfall: {rainfall} mm/week</label>
            <input type="range" min={0} max={50} value={rainfall} onChange={(e) => setRainfall(+e.target.value)} className="w-full" />
          </div>

          <div className="mb-4">
            <label>Sunlight: {sunlight} hrs/day</label>
            <input type="range" min={0} max={12} value={sunlight} onChange={(e) => setSunlight(+e.target.value)} className="w-full" />
          </div>

          <button onClick={handlePredict} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded shadow">
            Predict
          </button>
        </div>

        {/* Right Output Panel */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="font-semibold text-xl mb-4">Results</h2>
          {result ? (
            <div>
              <p className="text-lg font-semibold mb-2">Estimated Compost Speed: <span className="text-green-700">{result.speed}</span></p>
              <p className="mb-4">Expected Time to Maturity: <strong>{result.days} days</strong></p>
              <div className="bg-gray-100 text-sm p-3 rounded text-gray-700">
                <strong>Tip:</strong> {result.tip}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Adjust the sliders and click predict to get results.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default WeatherImpact;
