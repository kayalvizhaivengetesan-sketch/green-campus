import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isAdminAuthenticated } from './utils/storage';

// Layouts & Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Flora from './pages/Flora';
import FloraDetails from './pages/FloraDetails';
import Fauna from './pages/Fauna';
import FaunaDetails from './pages/FaunaDetails';
import About from './pages/About';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import ManageFlora from './pages/admin/ManageFlora';
import ManageFauna from './pages/admin/ManageFauna';
import ManageFeedback from './pages/admin/ManageFeedback';
import QRCodeManagement from './pages/admin/QRCodeManagement';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

function App() {
  useEffect(() => {
    // Initial data is now loaded directly from backend
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/flora" element={<Flora />} />
            <Route path="/flora/:id" element={<FloraDetails />} />
            <Route path="/fauna" element={<Fauna />} />
            <Route path="/fauna/:id" element={<FaunaDetails />} />
            <Route path="/about" element={<About />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/flora" element={<ProtectedRoute><ManageFlora /></ProtectedRoute>} />
            <Route path="/admin/fauna" element={<ProtectedRoute><ManageFauna /></ProtectedRoute>} />
            <Route path="/admin/feedback" element={<ProtectedRoute><ManageFeedback /></ProtectedRoute>} />
            <Route path="/admin/qr-codes" element={<ProtectedRoute><QRCodeManagement /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
