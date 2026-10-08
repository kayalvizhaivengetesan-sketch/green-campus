import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { getFlora, getFauna, getFeedback } from '../../utils/storage';
import { Leaf, Bird, MessageSquare } from 'lucide-react';
import './Admin.css';

const DashboardCard = ({ title, count, icon, colorClass }) => (
  <div className={`admin-stat-card ${colorClass}`}>
    <div className="stat-info">
      <h3>{count}</h3>
      <p>{title}</p>
    </div>
    <div className="stat-icon">
      {icon}
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ flora: 0, fauna: 0, feedback: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const flora = await getFlora();
      const fauna = await getFauna();
      const feedback = await getFeedback();
      setStats({
        flora: flora.length,
        fauna: fauna.length,
        feedback: feedback.length
      });
    };
    fetchData();
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <h1 className="admin-page-title">Dashboard Overview</h1>
        
        <div className="grid-3 mb-4">
          <DashboardCard 
            title="Total Flora Records" 
            count={stats.flora} 
            icon={<Leaf size={32} />} 
            colorClass="stat-green"
          />
          <DashboardCard 
            title="Total Fauna Records" 
            count={stats.fauna} 
            icon={<Bird size={32} />} 
            colorClass="stat-blue"
          />
          <DashboardCard 
            title="Total Feedback" 
            count={stats.feedback} 
            icon={<MessageSquare size={32} />} 
            colorClass="stat-orange"
          />
        </div>
        
        <div className="card admin-panel-card">
          <h2>Welcome to Green Campus Admin Panel</h2>
          <p>
            From this dashboard, you can manage all the flora and fauna records displayed on the website.
            You can also view user feedback and generate QR codes to be placed around the campus.
          </p>
          <p className="mt-3">
            <strong>Getting Started:</strong>
          </p>
          <ul className="admin-list mt-2">
            <li>Go to <strong>Manage Flora</strong> or <strong>Manage Fauna</strong> to add, edit, or remove species records.</li>
            <li>Visit <strong>QR Code Management</strong> to generate and download unique QR codes for each record.</li>
            <li>Check <strong>Manage Feedback</strong> regularly to see what users are saying about specific campus flora and fauna.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
