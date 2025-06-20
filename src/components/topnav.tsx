import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaQuestionCircle, FaUserCircle } from 'react-icons/fa';
import { BiMessageAltDetail } from 'react-icons/bi';
import { IoIosNotifications } from 'react-icons/io';
import UserPopover from '../pages/Users';

const pageTitles: { [key: string]: string } = {
  '/homepage': 'Welcome! Hazel',
  '/dashboards': 'Live compost and plant tracking',
  '/chatbot': 'Composting Assistant Chatbot',
  '/segmentation': 'Compost Data Segmentation',
  '/predictive': 'Predictive modelling',
  '/user': 'Profile',
  '/community': 'Community Forum',
  '/notification': 'Notification',
  '/faq': 'Frequently Asked Questions'
};

const iconTooltips: { [key: string]: string } = {
  '/community': 'Community Forum',
  '/notification': 'Notifications',
  '/user': 'User Profile',
  '/faq': 'Frequently Asked Questions'
};
export const TopNavbar = () => {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState('');
  const [showPopover, setShowPopover] = useState(false); // ✅ HERE is correct


  useEffect(() => {
  let title = pageTitles[location.pathname] || '';
  if (location.pathname === '/homepage') {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
   
    if (user?.name) {
      // Capitalize the first letter of the first word
      const name = user.name;
      const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
      title = `Welcome! ${capitalized}`;
    }
  }
  setPageTitle(title);
}, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
<div className="flex justify-between items-center h-20 px-6 bg-amber-300/20 shadow-md shadow-yellow-900/20 backdrop-blur-md">
      <h1 className="text-2xl font-bold text-black">{pageTitle}</h1>
      <div className="flex items-center space-x-4">

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


        <div className="relative group">
         
          <Link
            to="/community"
            className={`w-9 h-9 flex items-center justify-center rounded-full transition cursor-pointer hover:scale-[1.2] ${
              isActive('/community')
                ? 'bg-green-950 text-yellow-200'
                : 'bg-white hover:bg-green-950'
            }`}
          >
            <BiMessageAltDetail className="text-xl hover:text-yellow-200" />
          </Link>
          <span className="absolute z-10 w-max left-1/2 -translate-x-1/2 bottom-full mb-0 px-2 py-1 text-xs font-medium text-white bg-green-900/60 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
            Community Forum
          </span>
        </div>

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

            {/* 👇 Popover rendered conditionally here */}
            <div className="absolute right-0 top-full mt-1">
              <UserPopover isOpen={showPopover} onClose={() => setShowPopover(false)} />
            </div>
          </div>
      </div>
    </div>
  );
};