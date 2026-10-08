import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Leaf, 
  Bird, 
  MessageSquare, 
  QrCode, 
  LogOut 
} from 'lucide-react';
import { setAdminAuth } from '../utils/storage';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    setAdminAuth(false);
    navigate('/admin/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Manage Flora', path: '/admin/flora', icon: <Leaf size={20} /> },
    { name: 'Manage Fauna', path: '/admin/fauna', icon: <Bird size={20} /> },
    { name: 'Manage Feedback', path: '/admin/feedback', icon: <MessageSquare size={20} /> },
    { name: 'QR Code Management', path: '/admin/qr-codes', icon: <QrCode size={20} /> },
  ];

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h3>Admin Panel</h3>
      </div>
      
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li key={item.name} className="sidebar-item">
            <Link
              to={item.path}
              className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
      
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
