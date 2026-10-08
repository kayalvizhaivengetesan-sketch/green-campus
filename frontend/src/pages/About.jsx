import { BookOpen, TreePine, Target, QrCode } from 'lucide-react';
import aboutImage from '../assets/about.jpg';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="page-header">
        <div className="container">
          <h1>About Green Campus</h1>
          <p>Learn more about our initiative to digitally map and share our campus biodiversity.</p>
        </div>
      </div>
      
      <div className="container section">
        <div className="about-content">
          <div className="card about-main-card">
            <img 
              src={aboutImage} 
              alt="Green Campus Garden" 
              style={{ width: '100%', height: 'auto', borderRadius: '8px', marginBottom: '2rem', objectFit: 'cover', maxHeight: '450px' }} 
            />
            <h2 className="section-title" style={{ textAlign: 'left' }}>Project Introduction</h2>
            <p>
              The Green Campus – Flora & Fauna QR Code Information System is a modern digital initiative 
              aimed at creating awareness about the biodiversity present within our college campus. 
              Our campus is home to a wide variety of plant and animal species, many of which have 
              significant ecological, medicinal, and cultural value.
            </p>
            <p>
              Often, students and visitors walk past these species without knowing their identity or importance. 
              This project bridges that knowledge gap by integrating nature with technology through the use of QR codes.
            </p>
          </div>
          
          <div className="grid-2 mt-4">
            <div className="card icon-card">
              <div className="icon-circle">
                <Target size={32} />
              </div>
              <h3>Our Objectives</h3>
              <ul className="objective-list">
                <li>Provide easy access to biodiversity information</li>
                <li>Increase environmental awareness among students</li>
                <li>Support digital and interactive learning</li>
                <li>Leverage modern QR technology for education</li>
                <li>Promote a smart and sustainable campus environment</li>
              </ul>
            </div>
            
            <div className="card icon-card">
              <div className="icon-circle">
                <QrCode size={32} />
              </div>
              <h3>QR Code Technology</h3>
              <p>
                Every identified plant and animal habitat on campus is marked with a unique QR code. 
                When scanned using any standard smartphone camera or QR reader, it instantly redirects 
                the user to a dedicated web page containing comprehensive details about that specific species, 
                including its scientific name, habitat, uses, and conservation status.
              </p>
            </div>
          </div>
          
          <div className="card about-main-card mt-4">
            <div className="icon-header">
              <TreePine size={28} className="icon-primary" />
              <h2>Importance of Flora and Fauna</h2>
            </div>
            <p>
              Flora and fauna are the foundation of our ecosystem. Plants provide the oxygen we breathe, 
              regulate the climate, and offer numerous medicinal benefits. Animals play a crucial role in 
              pollination, pest control, and maintaining ecological balance.
            </p>
            <p>
              By documenting and learning about our local biodiversity, we foster a culture of conservation 
              and respect for nature. This project serves as a digital repository and an interactive learning 
              tool for current and future generations of students.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
