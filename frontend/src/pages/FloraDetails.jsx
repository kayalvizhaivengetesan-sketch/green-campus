import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getFloraById } from '../utils/storage';
import FeedbackForm from '../components/FeedbackForm';
import { ArrowLeft, MapPin, Tag, Info, ShieldCheck, Leaf } from 'lucide-react';
import './Details.css';

const FloraDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flora, setFlora] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getFloraById(id);
      if (data) {
        setFlora(data);
      } else {
        // If not found, navigate back
        navigate('/flora');
      }
    };
    fetchData();
  }, [id, navigate]);

  if (!flora) return <div className="loading">Loading...</div>;

  const images = [];
  if (flora.image1Url || flora.image1) images.push(flora.image1Url || flora.image1);
  if (flora.image2File || flora.image2) images.push(flora.image2File || flora.image2);
  
  if (images.length === 0) {
    images.push('https://via.placeholder.com/800x500?text=No+Image+Available');
  }

  return (
    <div className="details-page">
      <div className="container py-4">
        <Link to="/flora" className="btn btn-outline mb-4">
          <ArrowLeft size={18} /> Back to Flora
        </Link>
        
        <div className="details-header card">
          <div className="details-gallery">
            <div className="main-image-container">
              <img src={images[activeImage]} alt={flora.commonName} className="main-image" />
            </div>
            {images.length > 1 && (
              <div className="thumbnail-container">
                {images.map((img, index) => (
                  <img 
                    key={index}
                    src={img} 
                    alt={`${flora.commonName} ${index + 1}`}
                    className={`thumbnail ${activeImage === index ? 'active' : ''}`}
                    onClick={() => setActiveImage(index)}
                  />
                ))}
              </div>
            )}
          </div>
          
          <div className="details-info">
            <div className="badge-container mb-3">
              <span className="badge category-badge"><Leaf size={14}/> {flora.category}</span>
              <span className="badge family-badge">{flora.family}</span>
            </div>
            
            <h1 className="details-title">{flora.commonName}</h1>
            <h2 className="details-subtitle"><em>{flora.scientificName}</em></h2>
            <p className="tamil-name"><strong>Tamil Name:</strong> {flora.tamilName}</p>
            
            <div className="info-grid mt-4">
              <div className="info-item">
                <MapPin className="info-icon" />
                <div>
                  <h4>Habitat</h4>
                  <p>{flora.habitat}</p>
                </div>
              </div>
              <div className="info-item">
                <Tag className="info-icon" />
                <div>
                  <h4>Native Region</h4>
                  <p>{flora.nativeRegion || 'Unknown'}</p>
                </div>
              </div>
              <div className="info-item">
                <ShieldCheck className="info-icon" />
                <div>
                  <h4>Conservation Status</h4>
                  <p>{flora.conservationStatus}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="content-sections mt-4">
          <div className="section-card card">
            <h3 className="section-heading"><Info size={20} /> Description</h3>
            <p>{flora.description}</p>
          </div>
          
          <div className="grid-2 mt-4">
            {flora.history && (
              <div className="section-card card">
                <h3 className="section-heading">History</h3>
                <p>{flora.history}</p>
              </div>
            )}
            
            {flora.benefits && (
              <div className="section-card card">
                <h3 className="section-heading">General Benefits</h3>
                <p>{flora.benefits}</p>
              </div>
            )}
            
            {flora.medicinalUses && (
              <div className="section-card card">
                <h3 className="section-heading">Medicinal Uses</h3>
                <p>{flora.medicinalUses}</p>
              </div>
            )}
            
            {flora.culturalSignificance && (
              <div className="section-card card">
                <h3 className="section-heading">Cultural & Ornamental Significance</h3>
                <p>{flora.culturalSignificance}</p>
              </div>
            )}
            
            {flora.economicUses && (
              <div className="section-card card">
                <h3 className="section-heading">Economic & Other Uses</h3>
                <p>{flora.economicUses}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* IMPORTANT: FEEDBACK AT THE VERY BOTTOM */}
        <FeedbackForm 
          recordId={flora.id} 
          recordName={flora.commonName} 
          type="Flora" 
        />
        
      </div>
    </div>
  );
};

export default FloraDetails;
