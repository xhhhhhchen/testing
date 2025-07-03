import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaQuestionCircle, FaUserCircle } from 'react-icons/fa';
import { BiMessageAltDetail } from 'react-icons/bi';
import { IoIosNotifications } from 'react-icons/io';
import UserPopover from '../pages/Users';
import { supabase } from '../supabaseClient.ts';
import { getTanksByIds } from '../api';
import { motion, AnimatePresence } from 'framer-motion';


const pageTitles: { [key: string]: string } = {
  '/homepage': 'Welcome!',
  '/dashboards': 'Live compost and plant tracking',
  '/chatbot': 'Composting Assistant Chatbot',
  '/segmentation': 'Compost Data Segmentation',
  '/community': 'Community Forum',
  '/user': 'Profile',
  '/notification': 'Notification',
  '/faq': 'Frequently Asked Questions',


  '/predictive/co2-savings': 'CO₂e Savings Estimator',
  '/predictive/plant-ready': 'Plant Readiness Estimator',
  '/predictive/nutrient-deficiency': 'Nutrient Deficiency Estimator',
  '/predictive/compost-simulator': 'Compost Simulator',
  '/predictive/weather-impact': 'Weather Impact Estimator',
};

interface Tank {
  id: string;
  name: string;
  description?: string;
  location_id?: string; // optional if returned from API
}


export const TopNavbar = () => {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState('');
  const [showPopover, setShowPopover] = useState(false);

useEffect(() => {
  const fetchUserDetails = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('accessToken');

    if (!userId || !token) return;

    try {
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('user_id,username, created_at, location_id')
        .eq('auth_uid', userId)
        .single();

      if (profileError || !userProfile) throw new Error('User profile not found');

      const { data: locationData } = await supabase
        .from('locations')
        .select('location_id, location_name')
        .eq('location_id', userProfile.location_id)
        .single();

      const { data: tankMappings, error: tankMappingError } = await supabase
        .from('user_tanks')
        .select('tank_id')
        .eq('user_id', userProfile.user_id);

      if (tankMappingError) throw tankMappingError;

      const tankIds = tankMappings?.map(t => t.tank_id) || [];
      const fullTankInfo = tankIds.length > 0 ? await getTanksByIds(tankIds) : [];

      const userObject = {
        id: userProfile.user_id,
        email: localStorage.getItem('email'),
        name: userProfile.username,
        created_at: userProfile.created_at,
        accessToken: token,
        location: locationData,
        tanks: fullTankInfo
      };

      localStorage.setItem('user', JSON.stringify(userObject));
      setUser({ name: userObject.name }); // 👈 update the state too

    } catch (e) {
      console.error('Failed to refresh user info:', e);
    }
  };

  fetchUserDetails();
}, []);


  const [user, setUser] = useState<{ name?: string } | null>(null);

  useEffect(() => {
  const cachedUser = JSON.parse(localStorage.getItem('user') || '{}');
  setUser({ name: cachedUser.name });
  }, []);

  useEffect(() => {
    let title = pageTitles[location.pathname] || '';
    if (location.pathname === '/homepage' && user?.name) {
      const capitalized = user.name.charAt(0).toUpperCase() + user.name.slice(1);
      title = `Welcome! ${capitalized}`;
    }
    setPageTitle(title);
  }, [location.pathname, user]);


  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex justify-between items-center h-20 px-6 bg-amber-300/20 shadow-md shadow-yellow-900/20 backdrop-blur-md">
      <AnimatePresence mode="wait">
  <motion.h1
    key={pageTitle}
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 50 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
    className="text-2xl font-bold text-black"
  >
    {pageTitle}
  </motion.h1>
</AnimatePresence>


      <div className="flex items-center space-x-4  z-[9999]">

        {/* FAQ */}
        <div className="relative group">
          <Link
            to="/faq"
            className={`w-9 h-9 flex items-center justify-center rounded-full transition cursor-pointer hover:scale-[1.2] ${
              isActive('/faq')
                ? 'bg-green-950 text-yellow-200'
                : 'bg-white hover:bg-green-950'
            }`}
          >
            <FaQuestionCircle className="text-xl hover:text-yellow-200" />
          </Link>
          <span className="absolute z-10 w-max left-1/2 -translate-x-1/2 bottom-full mb-0 px-2 py-1 text-xs font-medium text-white bg-green-900/60 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
            Frequently Asked Questions
          </span>
        </div>


        {/* Notifications */}
        <div className="relative group">
          <Link
            to="/notification"
            className={`w-9 h-9 flex items-center justify-center rounded-full transition cursor-pointer hover:scale-[1.2] ${
              isActive('/notification')
                ? 'bg-green-950 text-yellow-200'
                : 'bg-white hover:bg-green-950'
            }`}
          >
            <IoIosNotifications className="text-xl hover:text-yellow-200" />
          </Link>
          <span className="absolute z-10 w-max left-1/2 -translate-x-1/2 bottom-full mb-0 px-2 py-1 text-xs font-medium text-white bg-green-900/60 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
            Notifications
          </span>
        </div>

        {/* User Profile Popover */}
        <div className="relative group">
          <button
            onClick={() => setShowPopover((prev) => !prev)}
            className={`w-9 h-9 flex items-center justify-center rounded-full transition cursor-pointer hover:scale-[1.2] ${
              showPopover
                ? 'bg-green-950 text-yellow-200'
                : 'bg-white hover:bg-green-950'
            }`}
          >
            <FaUserCircle className="text-xl hover:text-yellow-200" />
          </button>
          <span className="absolute z-10 w-max left-1/2 -translate-x-1/2 bottom-full mb-0 px-2 py-1 text-xs font-medium text-white bg-green-900/60 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
            User Profile
          </span>

          {/* Popover */}
          <div className="absolute right-0 top-full mt-1">
            <UserPopover isOpen={showPopover} onClose={() => setShowPopover(false)} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default TopNavbar;