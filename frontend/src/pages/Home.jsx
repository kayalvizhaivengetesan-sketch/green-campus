import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Bird, QrCode, Smartphone, Info } from 'lucide-react';
import { getFlora, getFauna } from '../utils/storage';
import FloraCard from '../components/FloraCard';
import FaunaCard from '../components/FaunaCard';
import heroImage from '../assets/hero.jpg';
import homeAboutImage from '../assets/home-about.jpg';
import './Home.css';

const Home = () => {
  const [floraData, setFloraData] = useState([]);
  const [faunaData, setFaunaData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const flora = await getFlora();
      const fauna = await getFauna();
      setFloraData(flora.slice(0, 3));
      setFaunaData(fauna.slice(0, 3));
    };
    fetchData();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <h1 className="hero-title">GREEN CAMPUS</h1>
          <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '1rem', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Flora & Fauna QR Code Information System
          </h2>
          <p className="hero-subtitle" style={{ fontStyle: 'italic' }}>
            "Explore the biodiversity of our campus"
          </p>
          <div className="hero-buttons">
            <Link to="/flora" className="btn btn-primary btn-lg">
              Explore Flora & Fauna
            </Link>
          </div>
        </div>
      </section>

      {/* About Green Campus */}
      <section className="section bg-light">
        <div className="container">
          <div className="about-preview">
            <div className="about-text">
              <h2 className="section-title" style={{ textAlign: 'left' }}>About Green Campus</h2>
              <p className="about-desc">
                Our college campus is home to a rich diversity of trees, plants, birds, and animals. 
                The Green Campus initiative aims to bridge the gap between nature and technology by 
                providing instant access to information about our local biodiversity.
              </p>
              <p className="about-desc">
                By scanning the QR codes placed near various species across the campus, students and 
                visitors can learn about their scientific details, ecological importance, and cultural significance.
              </p>
              <Link to="/about" className="btn btn-outline mt-3">
                Read More <Info size={18} />
              </Link>
            </div>
            <div className="about-image">
              <img src={homeAboutImage} alt="Green Campus" className="rounded-image shadow" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="grid-3 steps-container">
            <div className="step-card card">
              <div className="step-icon">
                <QrCode size={40} />
              </div>
              <h3>Step 1</h3>
              <h4>Scan QR Code</h4>
              <p>Find a QR code placed near a plant or animal habitat on campus and scan it with your phone.</p>
            </div>
            
            <div className="step-card card">
              <div className="step-icon">
                <Smartphone size={40} />
              </div>
              <h3>Step 2</h3>
              <h4>Open Green Campus</h4>
              <p>The scan will instantly direct you to the specific profile page on our web platform.</p>
            </div>
            
            <div className="step-card card">
              <div className="step-icon">
                <Leaf size={40} />
              </div>
              <h3>Step 3</h3>
              <h4>Explore & Learn</h4>
              <p>Discover detailed scientific info, uses, and conservation status of the flora or fauna.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Flora */}
      <section className="section bg-light">
        <div className="container">
          <h2 className="section-title">Featured Flora</h2>
          <div className="grid-3">
            {floraData.map(item => (
              <FloraCard key={item.id} item={item} />
            ))}
          </div>
          <div className="text-center mt-4">
            <Link to="/flora" className="btn btn-primary">View All Flora</Link>
          </div>
        </div>
      </section>

      {/* Featured Fauna */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Featured Fauna</h2>
          <div className="grid-3">
            {faunaData.map(item => (
              <FaunaCard key={item.id} item={item} />
            ))}
          </div>
          <div className="text-center mt-4">
            <Link to="/fauna" className="btn btn-primary">View All Fauna</Link>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="cta-section">
        <div className="container text-center">
          <h2>Ready to explore our campus biodiversity?</h2>
          <p>Grab your smartphone and start scanning today!</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
