import { Link } from 'react-router-dom';

const FeaturedCard = ({ item, type }) => {
  const images = item.images && item.images.length > 0 
    ? item.images 
    : (item.image ? [item.image] : []);
    
  const displayImage = images[0] || (type === 'flora' 
    ? 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1920&h=800'
    : 'https://images.unsplash.com/photo-1563211516-c117d3bc2ce9?auto=format&fit=crop&q=80&w=1920&h=800');

  return (
    <div className="card">
      <img 
        src={displayImage} 
        alt={item.name} 
        onError={(e) => { e.target.src = displayImage; }} 
      />
      <div className="card-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '5px' }}>
          <h3 style={{ margin: 0 }}>{item.name}</h3>
          {item.category && <span className="category-badge">{item.category}</span>}
        </div>
        {item.tamilName && <p className="tamil-name">{item.tamilName}</p>}
        <p className="scientific-name"><i>{item.scientificName}</i></p>
        <p className="card-desc">{item.description.substring(0, 80)}...</p>
        <Link to={`/${type}/${item.id}`} className="btn">View Details</Link>
      </div>
    </div>
  );
};

export default FeaturedCard;
