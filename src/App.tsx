import { useState, useEffect } from 'react';
import { Routes, Route, Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from './components/sidebar';
import { TopNavbar } from './components/topnav';
import { Login } from './components/loginform.tsx';
import { TankSelection } from './components/TankSelection.tsx'; 
import ChatbotPage from './pages/ChatbotPage';
import DashboardPage from './pages/DashboardPage';
import SegmentationPage from './pages/SegmentationPage';
import PredictivePage from './pages/PredictivePage';
import Homepage from './pages/Homepage';
import NotificationPage from './pages/NotificationPage';
import CommunityForum from './pages/CommunityForum';
import FAQs from './pages/FAQ.tsx';
import CheckEmailPage from './components/check-email.tsx'; 
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      if (window.location.pathname === '/') {
        navigate('/homepage');
      }
    }
    setLoading(false);
  }, [navigate]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };
  
  const handleLogout = async () => {
    // Start logout animation
    setIsAuthenticated(false);
    
    // Wait for animation to complete (500ms matches your exit animation duration)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Clear storage and navigate
    localStorage.clear();
    navigate('/');
  };


  return (
    <AnimatePresence mode="wait">
      {isAuthenticated ? (
        <motion.div
          key="auth-layout"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            x: -50,
            transition: { duration: 0.5 }
          }}
          className="flex h-screen"
        >
          <Sidebar 
            isCollapsed={isSidebarCollapsed} 
            setIsCollapsed={setIsSidebarCollapsed} 
            onLogout={handleLogout}
          />

          <div className="flex-1 flex flex-col relative">
            <div className="sticky top-0 z-50">
              <TopNavbar />
            </div>
            
            <main className="flex-1 overflow-auto p-6 relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="h-full"
                >
                  <Routes location={location}>
                    <Route path="/" element={<Layout />}>
                      <Route path="homepage" element={<Homepage />} />
                        <Route path="chatbot" element={<ChatbotPage />} />
                        <Route path="dashboards" element={<DashboardPage />} />
                        <Route path="segmentation" element={<SegmentationPage />} />
                        <Route path="predictive" element={<PredictivePage />} />
                        <Route path="community" element={<CommunityForum />} />
                        <Route path="notification" element={<NotificationPage />} />
                        <Route path="faq" element={<FAQs />} />
                        <Route path="*" element={<Navigate to="/homepage" replace />} />
                        </Route>
                  </Routes>
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="unauth-layout"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Routes location={location}>
            <Route path="/" element={<Login onLogin={handleLogin} />} />
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/select-tank" element={<TankSelection />} />
              <Route path="/new-acc" element={<CheckEmailPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Layout() {
  return <Outlet />;
}

export default App;

// function App() {
//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

//   return (
//     <div className="flex h-screen bg-gray-100">
//       <Sidebar 
//         isCollapsed={isSidebarCollapsed} 
//         setIsCollapsed={setIsSidebarCollapsed} 
//         onLogout={() => {}} // or remove this prop from Sidebar if not needed
//       />
      
//       <div className="flex-1 flex flex-col">
//         <TopNavbar />
//         <main className="flex-1 overflow-auto p-6">
//           <Routes>
//             <Route path="/" element={<Layout />}>
//               <Route path="homepage" element={<Homepage />} />
//               <Route path="chatbot" element={<ChatbotPage />} />
//               <Route path="dashboards" element={<DashboardPage />} />
//               <Route path="segmentation" element={<SegmentationPage />} />
//               <Route path="predictive" element={<PredictivePage />} />
//               <Route path="community" element={<CommunityForum />} />
//               <Route path="notification" element={<NotificationPage />} />
//               <Route path="faq" element={<FAQs />} />
//               <Route path="*" element={<Navigate to="/homepage" replace />} />
//             </Route>
//           </Routes>
//         </main>
//       </div>
//     </div>
//   );
// }



// function Layout() {
//   return <Outlet />;
// }

// export default App;
