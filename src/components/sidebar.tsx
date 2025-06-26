import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';
import {
  FaRobot, FaSeedling, FaCamera, FaTree, FaSignOutAlt, FaChevronDown, FaChevronUp
} from 'react-icons/fa';
import { IoMdInformationCircle, IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { PiPencilSimpleLineDuotone } from 'react-icons/pi';
import { BiSolidCloudDownload } from 'react-icons/bi';
import { GiTeamIdea } from 'react-icons/gi';
import { motion, AnimatePresence } from 'framer-motion';
import vmlogo from '../assets/vmlogo.png';
import vmlogoIcon from '../assets/smallerlogo.png';
import { BiMessageAltDetail } from 'react-icons/bi';
import { useSearchParams } from 'react-router-dom';



interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onLogout: () => Promise<void>;
}

const navItems = [
  { name: 'Green Hub', icon: <FaSeedling />, to: '/dashboards', description: 'Dashboard overview and stats' },
  { name: 'Grow Bot', icon: <FaRobot />, to: '/chatbot', description: 'Talk to the AI assistant' },
  { name: 'Bio Lens', icon: <FaCamera />, to: '/segmentation', description: 'Analyze and segment images' },
  { name: 'Growth Forest', icon: <FaTree />, to: '/predictive', description: 'Predict growth patterns' },
  { name: 'Community Forum', icon: <BiMessageAltDetail />, to: '/community', description: 'Discuss with other users' },
];

const predictorOptions = [
  { name: 'CO₂e Savings Estimator', to: '/predictive/co2-savings', description: 'See how much carbon you\'re saving by composting.', icon: '🌱' },
  { name: 'Nutrient Deficiency Predictor', to: '/predictive/nutrient-deficiency', description: 'Find out which nutrients your compost might be lacking.', icon: '🧪' },
  { name: 'Plant-Ready Compost Estimator', to: '/predictive/plant-ready', description: 'Get a compost plan that suits what you\'re growing.', icon: '🌿' },
  { name: 'Compost Outcome Simulator', to: '/predictive/compost-simulator', description: 'Change the inputs. See the outcome.', icon: '🔄' },
  { name: 'Weather Impact on Composting', to: '/predictive/weather-impact', description: 'Check how weather affects composting speed.', icon: '⛅' }
];

export const Sidebar = ({ isCollapsed, setIsCollapsed, onLogout }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showAbout, setShowAbout] = useState(false);
  const [showPredictors, setShowPredictors] = useState(location.pathname.startsWith('/predictive'));
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [searchParams] = useSearchParams();
  const currentTopic = searchParams.get('topic') || 'all';


  const forumTopics = [
      { id: 'all', name: 'All Topics' , icon: ' 📚 '  },
      { id: 'Composting', name: 'Composting', icon: ' ♻️ '  },
      { id: 'Plants', name: 'Plants' , icon: ' 🪴 '  },
      { id: 'Tank Maintenance', name: 'Tank Maintenance' , icon: ' 🛠️ '  },
      { id: 'Community', name: 'Community', icon: ' 👥  '  },
    ];


  // Automatically collapse predictors on route change
  useEffect(() => {
  if (!location.pathname.startsWith('/predictive')) {
    setShowPredictors(false);
  }
  }, [location.pathname]);

  const handleLogoutClick = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await onLogout();
      localStorage.clear();
      navigate('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`${isCollapsed ? 'w-20' : 'w-80'} min-h-screen bg-green-950 text-white p-4 flex flex-col justify-between rounded-r-2xl shadow-2xl border-l border-green-800 transition-all duration-300 relative
`}
    >
      {/* Collapse Toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-4 right-4 text-white hover:bg-green-800 p-2 rounded-lg"
      >
        {isCollapsed ? <IoIosArrowForward /> : <IoIosArrowBack />}
      </motion.button>

      <div>
        {/* Logo */}
        <div className="flex flex-col items-center mt-15 mb-8">
          <Link to="/homepage">
            <motion.img
              whileHover={{ scale: 1.05 }}
              src={isCollapsed ? vmlogoIcon : vmlogo}
              alt="VermiMetrics Logo"
              className={`transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-70'} cursor-pointer`}
            />
          </Link>
        </div>

        {/* About Section */}
        {!isCollapsed && (
          <div className="mb-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAbout(!showAbout)}
              className="flex items-center justify-between w-full px-4 py-2 bg-green-800 hover:bg-green-700 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <IoMdInformationCircle className="text-xl" />
                <span className="font-medium">About VermiMetrics</span>
              </div>
              <span>{showAbout ? '−' : '+'}</span>
            </motion.button>
            <AnimatePresence>
              {showAbout && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 text-sm bg-green-900/60 p-3 rounded-lg text-green-100 shadow-inner">
                    This platform helps you monitor compost data and optimize plant growth using sensor analytics.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Navigation */}
        {!isCollapsed && <h2 className="text-md mt-10 overflow-y-auto font-semibold text-yellow-100 mb-3">What would you like to do today?</h2>}
        <div className="flex flex-col space-y-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || (item.name === 'Growth Forest' && location.pathname.startsWith('/predictive'));
            const handleClick = (e: React.MouseEvent) => {
              if (item.name === 'Growth Forest') {
                e.preventDefault();
                setShowPredictors((prev) => !prev);
              }
            };

            return (
              <motion.div key={item.name} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to={item.to}
                  onClick={handleClick}
                  className={`group flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-md ${
                    isActive ? 'bg-yellow-200 text-green-950 ring-2 ring-yellow-100' : 'bg-green-900 text-white hover:bg-yellow-100 hover:text-green-950'
                  }`}
                >
                  <div className={`flex items-center ${isCollapsed ? '' : 'space-x-3'}`}>
                    <span className="text-lg">{item.icon}</span>
                    {!isCollapsed && <span>{item.name}</span>}
                  </div>
                  {!isCollapsed && item.name === 'Growth Forest' && (showPredictors ? <FaChevronUp /> : <FaChevronDown />)}

                  {/* Tooltip */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-emerald-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-75 pointer-events-none">
                      {item.description}
                      <div className="absolute top-1/2 right-full -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-0 border-r-4 border-t-transparent border-b-transparent border-r-emerald-700"></div>
                    </div>
                  )}
                </Link>


                {/* Predictive Sub-menu */}
              {item.name === 'Growth Forest' && !isCollapsed && (
                <AnimatePresence initial={false}>
                  {showPredictors && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="ml-8 mt-2 space-y-2 border-l-2 border-green-500 pl-4 overflow-hidden"
                    >
                      {predictorOptions.map((predictor) => (
                        <Link
                          key={predictor.name}
                          to={predictor.to}
                          className={`group flex items-center px-3 py-2 rounded-lg text-sm transition-all ${
                            location.pathname === predictor.to
                              ? 'bg-yellow-100 text-green-900 font-medium'
                              : 'text-green-100 hover:bg-green-800'
                          }`}
                        >
                          <span className="mr-2">{predictor.icon}</span>
                          <span>{predictor.name}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}

              
                {/* Community forum */}
              {item.name === 'Community Forum' && location.pathname.startsWith('/community') && !isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="ml-8 mt-2 space-y-1 border-l-2 border-green-500 pl-4 overflow-hidden"
                >
                  {forumTopics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() =>
                        navigate(topic.id === 'all' ? '/community' : `/community?topic=${encodeURIComponent(topic.id)}`)
                      }
                      className={`text-left w-full text-sm px-3 py-2 rounded-md transition ${
                        currentTopic === topic.id
                          ? 'bg-yellow-100 text-green-900 font-medium'
                          : 'text-green-100 hover:bg-green-800'
                      }`}
                    >
                      <span className="mr-2">{topic.icon}</span>
                      <span>{topic.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}




              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="space-y-4">
        {/* Logout */}
        <motion.button
          onClick={handleLogoutClick}
          disabled={isLoggingOut}
          whileHover={{ scale: isLoggingOut ? 1 : 1.05 }}
          whileTap={{ scale: isLoggingOut ? 1 : 0.95 }}
          className={`flex items-center justify-center gap-3 p-3 rounded-lg w-full ${
            isLoggingOut 
              ? 'bg-green-900/70 text-green-900' 
              : 'bg-green-800/20 hover:bg-green-800/30 hover:text-green-300'
          } transition-colors border ${
            isLoggingOut 
              ? 'border-green-800/50' 
              : 'border-green-700/30 hover:border-green-600/50'
          }`}
        >
          <FaSignOutAlt className="text-lg" />
          {!isCollapsed && <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>}
          {isCollapsed && isLoggingOut && <span className="text-xs text-green-300">...</span>}
        </motion.button>

        {/* Info */}
        {!isCollapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-green-300 space-y-2">
            <div className="flex items-center space-x-2">
              <PiPencilSimpleLineDuotone /> <span>Version: 1.0.2</span>
            </div>
            <div className="flex items-center space-x-2">
              <BiSolidCloudDownload /> <span>Last updated: June 2025</span>
            </div>
            <div className="flex items-center space-x-2">
              <GiTeamIdea /> <span>Developed by Team 4 (+1)</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
