import { useState } from 'react';
import { addFeedback } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';
import { MessageSquare, CheckCircle } from 'lucide-react';
import './FeedbackForm.css';

const FeedbackForm = ({ recordId, recordName, type }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    const newFeedback = {
      id: uuidv4(),
      type,
      recordId,
      recordName,
      name: formData.name,
      email: formData.email,
      message: formData.message,
      date: new Date().toISOString()
    };

    await addFeedback(newFeedback);
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
  };

  if (submitted) {
    return (
      <div className="feedback-success card">
        <CheckCircle size={48} className="success-icon" />
        <h3>Thank you for your valuable feedback!</h3>
        <p>Your feedback regarding {recordName} has been submitted successfully.</p>
        <button 
          className="btn btn-outline mt-3" 
          onClick={() => setSubmitted(false)}
        >
          Submit another feedback
        </button>
      </div>
    );
  }

  return (
    <div className="feedback-container card">
      <div className="feedback-header">
        <MessageSquare size={24} className="feedback-icon" />
        <h3>Share Your Feedback</h3>
      </div>
      <p className="feedback-subtitle">Let us know what you think about <strong>{recordName}</strong>.</p>
      
      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
            required
            placeholder="Your Name"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
            required
            placeholder="Your Email"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="message" className="form-label">Feedback Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="form-control"
            required
            placeholder={`Your thoughts on ${recordName}...`}
            rows="4"
          ></textarea>
        </div>
        
        <button type="submit" className="btn btn-primary w-100">
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
