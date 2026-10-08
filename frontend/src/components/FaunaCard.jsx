import { Link } from 'react-router-dom';
import { Bird } from 'lucide-react';
import './Card.css';

const FaunaCard = ({ item }) => {
  return (
    <div className="card item-card">
      <div className="card-img-container">
        <img 
          src={item.image1Url || item.image1 || item.image2File || item.image2 || 'https://via.placeholder.com/400x300?text=No+Image'} 
          alt={item.commonName} 
          className="card-img"
        />
        <div className="category-badge">
          <Bird size={14} className="badge-icon" />
          {item.category}
        </div>
      </div>
      <div className="card-content">
        <h3 className="card-title">{item.commonName}</h3>
        <p className="card-subtitle"><em>{item.scientificName}</em> • {item.tamilName}</p>
        <p className="card-desc">{item.description?.substring(0, 80)}...</p>
        <Link to={`/fauna/${item.id}`} className="btn btn-primary w-100">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default FaunaCard;
