import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getFaunaById } from '../utils/storage';
import FeedbackForm from '../components/FeedbackForm';
import { ArrowLeft, MapPin, Tag, Info, ShieldCheck, Bird, Activity } from 'lucide-react';
import './Details.css';

const FaunaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fauna, setFauna] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getFaunaById(id);
      if (data) {
        setFauna(data);
      } else {
        navigate('/fauna');
      }
    };
    fetchData();
  }, [id, navigate]);

  if (!fauna) return <div className="loading">Loading...</div>;

  const images = [];
  if (fauna.image1Url || fauna.image1) images.push(fauna.image1Url || fauna.image1);
  if (fauna.image2File || fauna.image2) images.push(fauna.image2File || fauna.image2);
  
  if (images.length === 0) {
    images.push('https://via.placeholder.com/800x500?text=No+Image+Available');
  }

  return (
    <div className="details-page">
      <div className="container py-4">
        <Link to="/fauna" className="btn btn-outline mb-4">
          <ArrowLeft size={18} /> Back to Fauna
        </Link>
        
        <div className="details-header card">
          <div className="details-gallery">
            <div className="main-image-container">
              <img src={images[activeImage]} alt={fauna.commonName} className="main-image" />
            </div>
            {images.length > 1 && (
              <div className="thumbnail-container">
                {images.map((img, index) => (
                  <img 
                    key={index}
                    src={img} 
                    alt={`${fauna.commonName} ${index + 1}`}
                    className={`thumbnail ${activeImage === index ? 'active' : ''}`}
                    onClick={() => setActiveImage(index)}
                  />
                ))}
              </div>
            )}
          </div>
          
          <div className="details-info">
            <div className="badge-container mb-3">
              <span className="badge category-badge"><Bird size={14}/> {fauna.category}</span>
            </div>
            
            <h1 className="details-title">{fauna.commonName}</h1>
            <h2 className="details-subtitle"><em>{fauna.scientificName}</em></h2>
            <p className="tamil-name"><strong>Tamil Name:</strong> {fauna.tamilName}</p>
            
            <div className="info-grid mt-4">
              <div className="info-item">
                <MapPin className="info-icon" />
                <div>
                  <h4>Habitat</h4>
                  <p>{fauna.habitat}</p>
                </div>
              </div>
              <div className="info-item">
                <Activity className="info-icon" />
                <div>
                  <h4>Diet</h4>
                  <p>{fauna.diet || 'Unknown'}</p>
                </div>
              </div>
              <div className="info-item">
                <ShieldCheck className="info-icon" />
                <div>
                  <h4>Conservation Status</h4>
                  <p>{fauna.conservationStatus}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="content-sections mt-4">
          <div className="section-card card">
            <h3 className="section-heading"><Info size={20} /> Description</h3>
            <p>{fauna.description}</p>
          </div>
          
          <div className="grid-2 mt-4">
            {fauna.behaviour && (
              <div className="section-card card">
                <h3 className="section-heading">Behaviour</h3>
                <p>{fauna.behaviour}</p>
              </div>
            )}
            
            {fauna.importanceToEcosystem && (
              <div className="section-card card">
                <h3 className="section-heading">Importance to Ecosystem</h3>
                <p>{fauna.importanceToEcosystem}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* IMPORTANT: FEEDBACK AT THE VERY BOTTOM */}
        <FeedbackForm 
          recordId={fauna.id} 
          recordName={fauna.commonName} 
          type="Fauna" 
        />
        
      </div>
    </div>
  );
};

export default FaunaDetails;
