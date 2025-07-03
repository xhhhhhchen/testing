"use client";

import React, { useEffect, useState, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getTanksByLocation } from '../api';
import { registerUserAndAssignTanks } from '../utils/authUtils';
import { LoadingSpinner } from './LoadingSpinner';
import { supabase } from '../supabaseClient.ts';
import { useUser } from '../contexts/UserContext';

// types
interface Location {
  id: number;
  name: string;
}

interface Site {
  site_id: number;
  site_name: string;
  location_id: string;
}

interface Tank {
  id: string;
  name: string;
  description?: string;
  siteId?: string;
}

interface AnimatedTankItemProps {
  tank: Tank;
  selected: boolean;
  onChange: (id: string) => void;
}

// Renders a single animated tank item with checkbox.
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
  const { setIsAuthenticated, refreshUser } = useUser();
  const [locations, setLocations] = useState<Location[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [tanksBySite, setTanksBySite] = useState<Record<string, Tank[]>>({});
  const [selectedTanks, setSelectedTanks] = useState<string[]>([]);
  const [loading, setLoading] = useState({ 
    locations: true, 
    sites: false, 
    tanks: false, 
    submission: false 
  });
  const [error, setError] = useState({ 
    locations: '', 
    sites: '', 
    tanks: '', 
    submission: '' 
  });
  const [emailConflict, setEmailConflict] = useState({ exists: false, email: '' });
  const navigate = useNavigate();

  // Load locations on component mount
  useEffect(() => {
    const loadLocations = async () => {
      try {

        console.log("Fetching locations...");
        const { data, error } = await supabase
          .from('locations')
          .select('location_id, location_name')
          .order('location_name', { ascending: true });
        console.log("Locations data:", data);
        console.log("Error:", error);

        if (error) throw error;
        setLocations(
          (data || []).map((loc: any) => ({
            id: loc.location_id,
            name: loc.location_name
          }))
        );
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

  // Load sites when location changes
  useEffect(() => {
    const loadSites = async () => {
      if (!selectedLocationId) {
        setSites([]);
        setTanksBySite({});
        return;
      }

      setLoading(prev => ({ ...prev, sites: true, tanks: true }));
      setError(prev => ({ ...prev, sites: '', tanks: '' }));

      try {
        const { data, error } = await supabase
          .from('sites')
          .select('*')
          .eq('location_id', selectedLocationId)
          .order('site_name', { ascending: true });

        if (error) throw error;
        setSites(data || []);
        setTanksBySite({});
      } catch (err) {
        setError(prev => ({
          ...prev,
          sites: 'Failed to load sites for this location.'
        }));
        console.error('Failed to load sites', err);
      } finally {
        setLoading(prev => ({ ...prev, sites: false }));
      }
    };

    loadSites();
  }, [selectedLocationId]);

  // Load tanks when sites change
  useEffect(() => {
    const loadTanksForSites = async () => {
      if (!sites.length || !selectedLocationId) return;

      setLoading(prev => ({ ...prev, tanks: true }));
      setError(prev => ({ ...prev, tanks: '' }));

      try {
        const tankResults = await Promise.all(
          sites.map(async site => {
            const tanks = await getTanksByLocation(String(site.site_id));
            return { siteId: site.site_id, tanks };
          })
        );

        const newTanksBySite: Record<string, Tank[]> = {};
        tankResults.forEach(({ siteId, tanks }) => {
          newTanksBySite[siteId] = tanks;
        });

        setTanksBySite(newTanksBySite);
      } catch (err) {
        setError(prev => ({
          ...prev,
          tanks: 'Failed to load tanks for these sites.'
        }));
        console.error('Failed to load tanks', err);
      } finally {
        setLoading(prev => ({ ...prev, tanks: false }));
      }
    };

    loadTanksForSites();
  }, [sites, selectedLocationId]);

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

      localStorage.setItem('accessToken', session.access_token);
      localStorage.setItem('userId', session.user.id);
      localStorage.setItem('email', session.user.email ?? '');
      localStorage.removeItem('tempAuthData');

      setIsAuthenticated(true);
      await refreshUser(); 
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

  const totalTanks = Object.values(tanksBySite).reduce((sum, tanks) => sum + tanks.length, 0);

return (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
    className="min-h-screen flex items-center justify-center bg-[#00421D] p-4"
  >
    <div className="p-6 sm:p-8 bg-green-900/90 rounded-xl shadow-2xl w-full max-w-2xl ring-2 ring-green-700/50 backdrop-blur-sm">
      <motion.h2 
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-2xl sm:text-3xl font-bold text-yellow-300 mb-6 text-center"
      >
        {!selectedLocationId 
          ? "Select Your Composting Location" 
          : "Select Your Composting Tanks"}
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
      {/* Step 1: Location Selection (only shown when no location selected) */}
      {!selectedLocationId && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {loading.locations ? (
            <div className="flex justify-center py-4">
              <LoadingSpinner size="small" />
            </div>
          ) : (
            // Change this div to use only one column
            <div className="grid grid-cols-1 gap-3"> {/* Removed sm:grid-cols-2 */}
              {locations
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((location) => (
                <motion.button
                  key={location.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedLocationId(String(location.id))}
                  className="p-4 rounded-lg bg-green-800 border-2 border-green-600 hover:border-yellow-400 text-white text-left transition-all"
                >
                  <h3 className="font-bold text-yellow-100">{location.name}</h3>
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>
      )}

        {/* Step 2: Sites and Tanks Selection (shown after location is selected) */}
        {selectedLocationId && (
          <>
            {/* Back button to change location */}
            <motion.button
              onClick={() => setSelectedLocationId('')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center text-yellow-300 hover:text-yellow-200 text-sm mb-4"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Change Location
            </motion.button>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <label className="block text-yellow-100 font-medium">
                Available Composting Tanks
              </label>
              
              {error.tanks && (
                <div className="text-red-400 text-sm">{error.tanks}</div>
              )}

              {loading.sites ? (
                <div className="flex justify-center py-4">
                  <LoadingSpinner size="small" />
                </div>
              ) : sites.length === 0 ? (
                <p className="text-green-200">No sites available at this location</p>
              ) : (
                <div className="space-y-6">
                  {sites
                  .sort((a, b) => a.site_name.localeCompare(b.site_name))
                  .map(site => {
                    const siteTanks = tanksBySite[site.site_id] || [];
                    return (
                      <div key={site.site_id} className="space-y-3">
                        <h3 className="text-green-200 font-medium border-b border-green-700 pb-1">
                          {site.site_name}
                        </h3>
                        
                        {loading.tanks ? (
                          <div className="flex justify-center py-2">
                            <LoadingSpinner size="small" />
                          </div>
                        ) : siteTanks.length === 0 ? (
                          <p className="text-green-200/70 text-sm">No tanks at this site</p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <AnimatePresence mode="popLayout">
                              {siteTanks
                              .sort((a, b) => a.name.localeCompare(b.name))
                              .map(tank => (
                                <AnimatedTankItem
                                  key={tank.id}
                                  tank={tank}
                                  selected={selectedTanks.includes(tank.id)}
                                  onChange={handleCheckboxChange}
                                />
                              ))}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Submit button */}
              {selectedTanks.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={loading.submission}
                    className={`w-full py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center ${
                      !loading.submission
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
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  </motion.div>
);}