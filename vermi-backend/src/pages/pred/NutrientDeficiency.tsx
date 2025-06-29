import { useState } from 'react';

function NutrientDeficiency() {
  const [nutrients, setNutrients] = useState({ N: 30, P: 40, K: 20 });
  const [pH, setPH] = useState(6.0);
  const [diagnosis, setDiagnosis] = useState<string[]>([]);

  const handleAnalyze = () => {
    const recs: string[] = [];

    if (nutrients.N < 40) recs.push('Low Nitrogen: Add green waste like vegetable scraps or coffee grounds.');
    if (nutrients.P < 30) recs.push('Low Phosphorus: Add bone meal or banana peels.');
    if (nutrients.K < 30) recs.push('Low Potassium: Add fruit peels or wood ash.');
    if (pH < 6.5) recs.push('pH too acidic: Add crushed eggshells or lime.');
    if (pH > 7.5) recs.push('pH too alkaline: Add citrus scraps or coffee grounds.');

    setDiagnosis(recs);
  };

  return (
    <div className="p-6 bg-white rounded max-w-4xl mx-auto shadow-md">
      <h1 className="text-2xl font-bold mb-4">Nutrient Deficiency Predictor</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {['N', 'P', 'K'].map((key) => (
          <div key={key}>
            <label className="font-semibold">{key} Level</label>
            <input
              type="range"
              min="0"
              max="100"
              value={nutrients[key as keyof typeof nutrients]}
              onChange={(e) =>
                setNutrients({ ...nutrients, [key]: Number(e.target.value) })
              }
              className="w-full"
            />
            <p className="text-center">{nutrients[key as keyof typeof nutrients]}%</p>
          </div>
        ))}
        <div>
          <label className="font-semibold">pH Level</label>
          <input
            type="number"
            min={0}
            max={14}
            step={0.1}
            value={pH}
            onChange={(e) => setPH(parseFloat(e.target.value))}
            className="w-full border p-2 rounded"
          />
        </div>
      </div>

      <button
        onClick={handleAnalyze}
        className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition"
      >
        Analyze Compost
      </button>

      {diagnosis.length > 0 && (
        <div className="mt-6 bg-gray-100 p-4 rounded text-sm space-y-2">
          <p className="font-semibold">Diagnosis & Recommendations:</p>
          {diagnosis.map((d, i) => (
            <p key={i}>• {d}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default NutrientDeficiency;
