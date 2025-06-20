import { useState, useEffect } from 'react';
import { Routes, Route, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { Sidebar } from './components/sidebar';
import { TopNavbar } from './components/topnav';
import { Login } from './components/loginform.tsx';
import { TankSelection } from './components/TankSelection.tsx'; 
import ChatbotPage from './pages/ChatbotPage';
import DashboardPage from './pages/DashboardPage';
import SegmentationPage from './pages/SegmentationPage';
import PredictivePage from './pages/PredictivePage';
import Homepage from './pages/Homepage'
import NotificationPage from './pages/NotificationPage';
import CommunityForum from './pages/CommunityForum';
import FAQs from './pages/FAQ.tsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in on initial load
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // Redirect to homepage if user is already authenticated
      if (window.location.pathname === '/') {
        navigate('/homepage');
      }
    }
  }, [navigate]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    // Don't navigate here - let the login flow handle navigation
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/select-tank" element={<TankSelection />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed} 
        onLogout={handleLogout}
      />
      
      <div className="flex-1 flex flex-col">
        <TopNavbar />
        <main className="flex-1 overflow-auto p-6">
          <Routes>
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
        </main>
      </div>
    </div>
  );
}

function Layout() {
  return <Outlet />;
}

export default App;