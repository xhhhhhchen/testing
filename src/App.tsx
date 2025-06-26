import React, { useState,useEffect } from 'react';
import { Routes, Route, Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from './components/sidebar';
import { TopNavbar } from './components/topnav';
import { Login } from './components/loginform';
import { TankSelection } from './components/TankSelection';
import ChatbotPage from './pages/ChatbotPage';
import DashboardPage from './pages/DashboardPage';
import SegmentationPage from './pages/SegmentationPage';
import PredictivePage from './pages/PredictivePage';
import Homepage from './pages/Homepage';
import NotificationPage from './pages/NotificationPage';
import ForumPage from './pages/CommunityForum';
import FAQs from './pages/FAQ';
import { AnimatePresence, motion } from 'framer-motion';
import { useUser } from './contexts/UserContext';
import UserProvider from './contexts/UserContext';


import PlantReadyEstimator from './pages/pred/PlantReadyEstimator';
import CO2Estimator from './pages/pred/CO2Estimator';
import NutrientDeficiency from './pages/pred/NutrientDeficiency';
import CompostSimulator from './pages/pred/CompostSimulator';
import WeatherImpact from './pages/pred/WeatherImpact';



function App() {
  const { isAuthenticated, setIsAuthenticated, loading } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated && location.pathname === '/') {
        navigate('/homepage');
      }
      if (!isAuthenticated && !['/', '/login', '/new-acc', '/select-tank'].includes(location.pathname)) {
        navigate('/');
      }
    }
  }, [loading, isAuthenticated, location.pathname, navigate]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    setIsAuthenticated(false);
    await new Promise((resolve) => setTimeout(resolve, 500));
    localStorage.clear();
    navigate('/');
  };

  if (loading) return <div>Loading...</div>; // ✅ this will now stop hanging


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
            transition: { duration: 0.5 },
          }}
          className="flex h-screen"
        >
         
          <Sidebar
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
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
                      <Route path="community" element={<ForumPage />} />
                      <Route path="notification" element={<NotificationPage />} />
                      <Route path="faq" element={<FAQs />} />

                      {/* Predictive Tools Nested Layout */}
                      <Route path="predictive" element={<PredictivePage />}>
                        <Route path="plant-ready" element={<PlantReadyEstimator />} />
                        <Route path="co2-savings" element={<CO2Estimator />} />
                        <Route path="nutrient-deficiency" element={<NutrientDeficiency />} />
                        <Route path="compost-simulator" element={<CompostSimulator />} />
                        <Route path="weather-impact" element={<WeatherImpact />} />
                      </Route>

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

export default function WrappedApp() {
  return (
    <UserProvider>
      <App />
    </UserProvider>
  );
}