import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <Leaf className="logo-icon" size={24} />
            <span>Green Campus</span>
          </div>
          <p className="footer-description">
            Explore and learn about the diverse flora and fauna of our campus through interactive QR technology.
          </p>
        </div>

        <div className="footer-links">
          <h4 className="footer-heading">Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/flora">Flora</Link></li>
            <li><Link to="/fauna">Fauna</Link></li>
            <li><Link to="/about">About Us</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4 className="footer-heading">Categories</h4>
          <ul>
            <li><Link to="/flora">Trees & Plants</Link></li>
            <li><Link to="/flora">Medicinal Herbs</Link></li>
            <li><Link to="/fauna">Birds</Link></li>
            <li><Link to="/fauna">Mammals & Insects</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Green Campus QR Code Information System. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
