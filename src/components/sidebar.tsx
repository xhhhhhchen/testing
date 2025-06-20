import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaRobot, FaSeedling, FaCamera, FaTree, FaSignOutAlt } from 'react-icons/fa';
import { IoMdInformationCircle, IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { PiPencilSimpleLineDuotone } from 'react-icons/pi';
import { BiSolidCloudDownload } from 'react-icons/bi';
import { GiTeamIdea } from 'react-icons/gi';
import vmlogo from '../assets/vmlogo.png';
import vmlogoIcon from '../assets/smallerlogo.png';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onLogout: () => void;
}

// Define type for navigation item
const navItems = [
  { name: 'Green Hub', icon: <FaSeedling />, to: '/dashboards', description: 'Dashboard overview and stats' },
  { name: 'Grow Bot', icon: <FaRobot />, to: '/chatbot', description: 'Talk to the AI assistant' },
  { name: 'Bio Lens', icon: <FaCamera />, to: '/segmentation', description: 'Analyze and segment images' },
  { name: 'Growth Forest', icon: <FaTree />, to: '/predictive', description: 'Predict growth patterns' },
];

export const Sidebar = ({ isCollapsed, setIsCollapsed, onLogout }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showAbout, setShowAbout] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div
      className={`${
        isCollapsed ? 'w-20' : 'w-80'
      } bg-green-950 text-white h-screen p-4 flex flex-col justify-between rounded-r-2xl shadow-2xl border-l border-green-800 transition-all duration-300 relative`}
    >
      {/* Collapse/Expand button */}
      <button
        className="absolute top-4 right-4 text-white hover:bg-green-800 p-2 rounded-lg transition duration-300 cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <IoIosArrowForward /> : <IoIosArrowBack />}
      </button>

      <div>
        {/* Logo and heading with spacing from top */}
        <div className="flex flex-col items-center mt-15 mb-8">
          <Link to="/homepage">
            <img
              src={isCollapsed ? vmlogoIcon : vmlogo}
              alt="VermiMetrics Logo"
              className={`transition-all duration-300 ${
                isCollapsed ? 'w-20' : 'w-70'
              } cursor-pointer hover:scale-105 hover:drop-shadow-md`}
            />
          </Link>
          {!isCollapsed }
        </div>

        {/* About section toggle */}
        {!isCollapsed && (
          <div className="mb-6">
            <button
              className="flex items-center justify-between w-full px-4 py-2 bg-green-800 hover:bg-green-700 rounded-lg text-left transition-all cursor-pointer hover:scale-[1.02]"
              onClick={() => setShowAbout(!showAbout)}
            >
              <div className="flex items-center space-x-2">
                <IoMdInformationCircle className="text-xl" />
                <span className="font-medium">About VermiMetrics</span>
              </div>
              <span>{showAbout ? '−' : '+'}</span>
            </button>
            {showAbout && (
              <div className="mt-3 text-sm bg-green-900/60 p-3 rounded-lg text-green-100 shadow-inner">
                This platform helps you monitor compost data and optimize plant growth using sensor analytics.
              </div>
            )}
          </div>
        )}

        {/* Navigation links */}
        <div>
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-green-100 mb-3">Select an Option:</h2>
          )}
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className={`group flex items-center ${
                    isCollapsed ? 'justify-center' : 'space-x-3'
                  } px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-md cursor-pointer hover:scale-[1.02] hover:shadow-md hover:shadow-yellow-300/50 ${
                    location.pathname === item.to 
                      ? 'bg-yellow-200 ring-2 ring-yellow-100 text-green-950' 
                      : 'bg-green-900 text-white hover:bg-yellow-100 hover:text-green-950'
                  }`}
                  >
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
                  <span className="text-lg">{item.icon}</span>
                  {!isCollapsed && <span>{item.name}</span>}
                </div>
                
                {/* Tooltip */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-emerald-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-75 pointer-events-none">
                  {item.description}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-0 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"></div>
                </div>  
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer with meta info and logout button */}
      <div className="space-y-4">
        
        {/* Logout button */}
        <button
          onClick={handleLogout}
          className={`group flex items-center ${
            isCollapsed ? 'justify-center' : 'space-x-3'
          } w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:bg-green-800 text-white cursor-pointer hover:scale-[1.02]`}
        >
          <FaSignOutAlt className="text-lg" />
          {!isCollapsed && <span>Logout</span>}
          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-emerald-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-75 pointer-events-none">
              Logout
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-0 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"></div>
            </div>
          )}
        </button>

        {/* Version info (only shown when expanded) */}
        {!isCollapsed && (
          <div className="text-xs text-green-300 space-y-2">
            <div className="flex items-center space-x-2">
              <PiPencilSimpleLineDuotone className="text-sm" /> <span>Version: 1.0.2</span>
            </div>
            <div className="flex items-center space-x-2">
              <BiSolidCloudDownload className="text-sm" /> <span>Last updated: June 2025</span>
            </div>
            <div className="flex items-center space-x-2">
              <GiTeamIdea className="text-sm" /> <span>Developed by Team 4 (+1)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};