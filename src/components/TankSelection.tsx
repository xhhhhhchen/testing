import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllLocations, getTanksByLocation, registerUser } from '../api';

interface Location {
  id: string;
  name: string;
}

interface Tank {
  id: string;
  name: string;
  description?: string;
}


export const TankSelection = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [tanks, setTanks] = useState<Tank[]>([]);
  const [selectedTank, setSelectedTank] = useState<Tank | null>(null);
  const [loadingTanks, setLoadingTanks] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getAllLocations()
      .then(setLocations)
      .catch(err => console.error('Failed to load locations', err));
  }, []);

  useEffect(() => {
    if (selectedLocationId) {
      setLoadingTanks(true);
      getTanksByLocation(selectedLocationId)
        .then(setTanks)
        .catch(err => console.error('Failed to load tanks', err))
        .finally(() => setLoadingTanks(false));
    } else {
      setTanks([]);
      setSelectedTank(null);
    }
  }, [selectedLocationId]);

  const handleSubmit = async () => {
  if (!selectedTank) return;

  const authData = localStorage.getItem('tempAuthData');
  if (!authData) {
    alert('Missing registration data. Please start again.');
    navigate('/');
    return;
  }

  try {
    const { name, email, password } = JSON.parse(authData);
    const selectedLocation = locations.find(
  loc => String(loc.id) === String(selectedLocationId)
);


    const response = await registerUser({
      name,
      email,
      password,
      location: selectedLocationId,
      tank_id: selectedTank.name
    });

    // Append location name to user object
    const userWithLocationName = {
      ...response.user,
      location_name: selectedLocation?.name || ''
    };

    localStorage.setItem('user', JSON.stringify(userWithLocationName));
    localStorage.setItem('token', response.token);
    localStorage.removeItem('tempAuthData');
    navigate('/homepage');
  } catch (error: any) {
    alert(error.message || 'Registration failed');
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#00421D] p-4">
      <div className="p-8 bg-green-900 rounded-xl shadow-2xl w-full max-w-md ring-2 ring-green-700 ring-opacity-50">
        <h2 className="text-3xl font-bold text-yellow-300 mb-6 text-center">
          Select Your Location
        </h2>

        <div className="space-y-6">
          {/* Location Selection */}
          <div className="space-y-2">
            <label className="block text-yellow-100 font-medium">
              Select Location
            </label>
            <select
              className="w-full px-4 py-2 rounded-lg bg-green-800 border border-green-600 text-white"
              value={selectedLocationId}
              onChange={(e) => setSelectedLocationId(e.target.value)}
            >
              <option value="">-- Choose a location --</option>
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          </div>

          {/* Tank Selection */}
          {selectedLocationId && (
            <div className="space-y-2">
              <label className="block text-yellow-100 font-medium">
                Select Tank
              </label>
              {loadingTanks ? (
                <p className="text-green-200">Loading tanks...</p>
              ) : (
                <select
                  className="w-full px-4 py-2 rounded-lg bg-green-800 border border-green-600 text-white"
                  value={selectedTank?.id || ''}
                  onChange={(e) => {
                    const id = e.target.value;
                    const tank = tanks.find(t => String(t.id) === id) || null;
                    setSelectedTank(tank);

                  }}
                >
                  <option value="">-- Choose a tank --</option>
                  {tanks.map(tank => (
                    <option key={tank.id} value={tank.id}>
                      {tank.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}



          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!selectedTank}
            className={`w-full py-3 px-4 rounded-lg transition duration-200 hover:shadow-lg hover:shadow-yellow-300/20 ${
              selectedTank
                ? 'bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold'
                : 'bg-gray-500 cursor-not-allowed text-gray-200'
            }`}

          >
            Create Account & Continue
          </button>
        </div>
      </div>
    </div>
  );
};
