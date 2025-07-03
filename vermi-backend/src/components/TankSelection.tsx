"use client";

import React, { useEffect, useState, forwardRef,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllLocations, getTanksByLocation } from '../api';
import { registerUserAndAssignTanks } from '../utils/authUtils';
import { LoadingSpinner } from './LoadingSpinner';
import { supabase } from '../supabaseClient.ts';
import { useUser } from '../contexts/UserContext';

interface Location {
  id: string;
  name: string;
}

interface Tank {
  id: string;
  name: string;
  description?: string;
  locationId?: string;
}

interface AnimatedTankItemProps {
  tank: Tank;
  selected: boolean;
  onChange: (id: string) => void;
}

const AnimatedTankItem = forwardRef<HTMLDivElement, AnimatedTankItemProps>(
  ({ tank, selected, onChange }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`p-3 rounded-lg border-2 transition-all ${
        selected
          ? 'bg-green-800/90 border-yellow-400 shadow-md shadow-yellow-400/30'
          : 'bg-green-900/40 border-green-800 hover:bg-green-800/70 hover:border-green-600'
      }`}
    >
      <label className="flex items-start cursor-pointer gap-3">
        <div className="relative flex items-center group">
          <input
            type="checkbox"
            id={`tank-${tank.id}`}
            className="absolute opacity-0 h-0 w-0 peer"
            checked={selected}
            onChange={() => onChange(tank.id)}
            aria-checked={selected}
          />
          <div className="flex items-center">
            <span className={`mr-3 flex items-center justify-center w-5 h-5 border-2 rounded transition-all
              ${selected 
                ? 'bg-yellow-400 border-yellow-400 shadow-inner'
                : 'bg-green-900/80 border-green-500 group-hover:border-yellow-400 group-hover:bg-green-800'
              }`}
            >
              {selected && (
                <motion.svg 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-3 h-3 text-green-900" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </motion.svg>
              )}
            </span>
            <div className="flex-1 min-w-0">
              <span className="block font-medium text-yellow-100 truncate tracking-wide">
                {tank.name}
              </span>
              {tank.description && (
                <span className="block text-xs text-green-200/90 mt-1 leading-snug">
                  {tank.description}
                </span>
              )}
            </div>
          </div>
        </div>
      </label>
    </motion.div>
  )
);

AnimatedTankItem.displayName = 'AnimatedTankItem';


export const TankSelection = () => {
  const { setIsAuthenticated,refreshUser } = useUser(); 
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [tanks, setTanks] = useState<Tank[]>([]);
  const [selectedTanks, setSelectedTanks] = useState<string[]>([]);
  const [loading, setLoading] = useState({
    locations: true,
    tanks: false,
    submission: false
  });
  const [error, setError] = useState({
    locations: '',
    tanks: '',
    submission: ''
  });
  const [emailConflict, setEmailConflict] = useState({
    exists: false,
    email: ''
  });
  const navigate = useNavigate();

  // Load locations on component mount
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const locationsData = await getAllLocations();
        setLocations(locationsData);
      } catch (err) {
        setError(prev => ({
          ...prev,
          locations: 'Failed to load locations. Please try again later.'
        }));
        console.error('Failed to load locations', err);
      } finally {
        setLoading(prev => ({ ...prev, locations: false }));
      }
    };

    loadLocations();
  }, []);

  // Load tanks when location changes
  useEffect(() => {
    if (!selectedLocationId) {
      setTanks([]);
      setSelectedTanks([]);
      return;
    }

    const loadTanks = async () => {
      setLoading(prev => ({ ...prev, tanks: true }));
      setError(prev => ({ ...prev, tanks: '' }));

      try {
        const tanksData = await getTanksByLocation(selectedLocationId);
        setTanks(tanksData);
      } catch (err) {
        setError(prev => ({
          ...prev,
          tanks: 'Failed to load tanks for this location.'
        }));
        console.error('Failed to load tanks', err);
      } finally {
        setLoading(prev => ({ ...prev, tanks: false }));
      }
    };

    loadTanks();
  }, [selectedLocationId]);

  const handleCheckboxChange = (tankId: string) => {
    setSelectedTanks(prev =>
      prev.includes(tankId)
        ? prev.filter(id => id !== tankId)
        : [...prev, tankId]
    );
  };

  const handleSubmit = async () => {
    if (!selectedTanks.length) {
      setError(prev => ({
        ...prev,
        submission: 'Please select at least one tank'
      }));
      return;
    }

    const authData = localStorage.getItem('tempAuthData');
    if (!authData) {
      alert('Missing registration data. Please start again.');
      navigate('/');
      return;
    }

    setLoading(prev => ({ ...prev, submission: true }));
    setError(prev => ({ ...prev, submission: '' }));
    setEmailConflict({ exists: false, email: '' });

    try {
      const { name, email, password } = JSON.parse(authData);
      const selectedLocation = locations.find(loc => String(loc.id) === String(selectedLocationId));

      if (!selectedLocation) {
        throw new Error('Selected location not found');
      }

      // Check if email already exists
      const { data: existingUsers, error: emailCheckError } = await supabase
        .from('users')
        .select('email')
        .eq('email', email);

      if (emailCheckError) throw emailCheckError;

      if (existingUsers && existingUsers.length > 0) {
        setEmailConflict({ exists: true, email });
        setLoading(prev => ({ ...prev, submission: false }));
        return;
      }

      // Proceed with registration
      const { session } = await registerUserAndAssignTanks({
        name,
        email,
        password,
        locationId: selectedLocationId,
        selectedTanks
      });

      // ✅ Store token under correct key
      localStorage.setItem('accessToken', session.access_token);
      localStorage.setItem('userId', session.user.id);
      localStorage.setItem('email', session.user.email ?? '');
      localStorage.removeItem('tempAuthData');

      // ✅ Update authentication state
      setIsAuthenticated(true);
      await refreshUser(); 

      // ✅ Navigate to authenticated homepage
      navigate('/homepage');
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(prev => ({
        ...prev,
        submission: error.message || 'Registration failed. Please try again.'
      }));
    } finally {
      setLoading(prev => ({ ...prev, submission: false }));
    }
  };

   return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex items-center justify-center bg-[#00421D] p-4"
    >
      <div className="p-6 sm:p-8 bg-green-900/90 rounded-xl shadow-2xl w-full max-w-md ring-2 ring-green-700/50 backdrop-blur-sm">
        <motion.h2 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-2xl sm:text-3xl font-bold text-yellow-300 mb-6 text-center"
        >
          Select Your Location
        </motion.h2>

        {error.locations && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-4 p-3 bg-red-900/50 text-red-100 rounded-lg"
          >
            {error.locations}
          </motion.div>
        )}

        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <label className="block text-yellow-100 font-medium">
              Select Location
            </label>
            {loading.locations ? (
              <div className="flex justify-center py-4">
                <LoadingSpinner size="small" />
              </div>
            ) : (
              <select
                className="w-full px-4 py-2 rounded-lg bg-green-800 border border-green-600 text-white focus:ring-2 focus:ring-yellow-200 focus:outline-none transition-all"
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value)}
                disabled={loading.locations}
              >
                <option value="">-- Choose a location --</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            )}
          </motion.div>

          {selectedLocationId && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <label className="block text-yellow-100 font-medium">
                Select Tank(s)
              </label>
              
              {error.tanks && (
                <div className="text-red-400 text-sm">{error.tanks}</div>
              )}

              {loading.tanks ? (
                <div className="flex justify-center py-4">
                  <LoadingSpinner size="small" />
                </div>
              ) : tanks.length === 0 ? (
                <p className="text-green-200">No tanks available at this location</p>
              ) : (
                <div className="relative">
             
          {/* Top indicator - subtle line */}
          <div className="sticky top-0 h-1 z-10 pointer-events-none 
            bg-gradient-to-b from-neutral-900/30 to-transparent" />
          
          {/* Scrollable content */}
          <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto py-3 px-1 tank-scrollbar">
                    <AnimatePresence mode="popLayout">
                      {[...tanks]
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((tank) => (
                          <AnimatedTankItem
                            key={tank.id}
                            tank={tank}
                            selected={selectedTanks.includes(tank.id)}
                            onChange={handleCheckboxChange}
                          />
                        ))}
                    </AnimatePresence>
                  </div>

                  {tanks.length > 5 && (
         <div className="sticky bottom-0 h-1 z-10 pointer-events-none bg-gradient-to-t from-neutral-900/30 to-transparent" />
                  )}
                </div>
              )}
            </motion.div>
          )}

          {emailConflict.exists && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-4 p-4 bg-yellow-900/50 border border-yellow-600 rounded-lg"
            >
              <div className="flex items-start">
                <svg className="h-5 w-5 text-yellow-400 mt-0.5 mr-2 flex-shrink-0" 
                     fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-yellow-300 font-medium">
                    Account already exists
                  </h3>
                  <p className="text-yellow-100 mt-1">
                    The email <span className="font-semibold">{emailConflict.email}</span> is already registered.
                  </p>
                  <div className="mt-3 flex items-center justify-center">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/login', { state: { prefilledEmail: emailConflict.email } })}
                      className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-500 text-yellow-900 rounded text-sm font-medium transition-colors"
                    >
                      Sign in instead
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {error.submission && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-center"
            >
              {error.submission}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              whileHover={selectedTanks.length && !loading.submission && !emailConflict.exists ? { 
                scale: 1.02,
                boxShadow: '0 4px 15px rgba(250, 204, 21, 0.3)'
              } : {}}
              whileTap={selectedTanks.length && !loading.submission && !emailConflict.exists ? { 
                scale: 0.98 
              } : {}}
              onClick={handleSubmit}
              disabled={selectedTanks.length === 0 || loading.submission || emailConflict.exists}
              className={`w-full py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center ${
                (selectedTanks.length && !loading.submission && !emailConflict.exists)
                  ? 'bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold shadow-md'
                  : 'bg-gray-500 cursor-not-allowed text-gray-200'
              }`}
            >
              {loading.submission ? (
                <>
                  <LoadingSpinner size="small" className="mr-2" />
                  Creating Account...
                </>
              ) : (
                'Create Account & Continue'
              )}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};