import { useState } from 'react';
import { getLocalStorage, setLocalStorage } from '../utils/storage';

const Feedback = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.message.trim()) newErrors.message = "Feedback message is required";
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for this field when typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccess(false);
      return;
    }

    setErrors({});
    
    // Save to LocalStorage
    const existingFeedback = getLocalStorage('green_campus_feedback') || [];
    const newFeedback = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      message: formData.message,
      date: new Date().toISOString()
    };
    
    setLocalStorage('green_campus_feedback', [...existingFeedback, newFeedback]);
    
    // Reset and show success
    setFormData({ name: '', email: '', message: '' });
    setSuccess(true);
    
    // Hide success message after 8 seconds
    setTimeout(() => setSuccess(false), 8000);
  };

  return (
    <div className="feedback-page">
      <div className="directory-header text-center">
        <div className="container">
          <h1 className="hero-heading" style={{fontSize: '2.5rem', marginBottom: '1rem'}}>Share Your Feedback</h1>
          <p className="hero-subtitle" style={{marginBottom: 0}}>Help us improve the Green Campus experience.</p>
        </div>
      </div>

      <div className="container section">
        <div className="feedback-container card-style">
          {success ? (
            <div className="success-message text-center" style={{padding: '3rem 1rem'}}>
              <div className="success-icon" style={{fontSize: '4rem', marginBottom: '1rem'}}>✅</div>
              <h3 style={{color: 'var(--primary-color)', fontSize: '1.8rem', marginBottom: '1rem'}}>Thank you for your valuable feedback!</h3>
              <p style={{color: 'var(--text-color)'}}>We appreciate you taking the time to share your thoughts with us.</p>
              <button className="btn mt-30" onClick={() => setSuccess(false)}>Submit Another Response</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="feedback-form">
              <div className="form-group">
                <label htmlFor="name">Full Name <span className="required" style={{color: 'red'}}>*</span></label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  className={`form-input ${errors.name ? "input-error" : ""}`}
                  placeholder="Enter your full name"
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address <span className="required" style={{color: 'red'}}>*</span></label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  className={`form-input ${errors.email ? "input-error" : ""}`}
                  placeholder="Enter your email address"
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="message">Feedback Message <span className="required" style={{color: 'red'}}>*</span></label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows="6" 
                  value={formData.message} 
                  onChange={handleChange} 
                  className={`form-input ${errors.message ? "input-error" : ""}`}
                  placeholder="Share your experience or suggestions..."
                ></textarea>
                {errors.message && <span className="error-text">{errors.message}</span>}
              </div>

              <button type="submit" className="btn btn-submit" style={{width: '100%', padding: '15px', fontSize: '1.1rem', marginTop: '10px'}}>
                Submit Feedback
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedback;
