import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { getFeedback, deleteFeedback } from '../../utils/storage';
import { Trash2, Eye, X } from 'lucide-react';
import './Admin.css';

const ManageFeedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Sort feedback by date descending
    const data = await getFeedback();
    const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
    setFeedbackList(sortedData);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      await deleteFeedback(id);
      await loadData();
      if (selectedFeedback && selectedFeedback.id === id) {
        setSelectedFeedback(null);
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <h1 className="admin-page-title">Manage Feedback</h1>
        
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Subject Name</th>
                <th>User Name</th>
                <th>Email</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedbackList.length > 0 ? (
                feedbackList.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className={`badge ${item.type === 'Flora' ? 'category-badge' : 'family-badge'}`}>
                        {item.type}
                      </span>
                    </td>
                    <td><strong>{item.recordName}</strong></td>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{formatDate(item.date)}</td>
                    <td>
                      <div className="action-btns">
                        <button className="btn btn-sm btn-outline" onClick={() => setSelectedFeedback(item)}>
                          <Eye size={16} /> View
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No feedback found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* View Feedback Modal */}
        {selectedFeedback && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '500px' }}>
              <div className="modal-header">
                <h2>Feedback Details</h2>
                <button className="close-btn" onClick={() => setSelectedFeedback(null)}>
                  <X size={24} />
                </button>
              </div>
              
              <div className="feedback-details">
                <div className="mb-3">
                  <strong>Subject:</strong> {selectedFeedback.recordName} ({selectedFeedback.type})
                </div>
                <div className="mb-3">
                  <strong>From:</strong> {selectedFeedback.name} &lt;{selectedFeedback.email}&gt;
                </div>
                <div className="mb-3">
                  <strong>Date:</strong> {formatDate(selectedFeedback.date)}
                </div>
                
                <div className="mt-4">
                  <strong>Message:</strong>
                  <div className="card mt-2" style={{ padding: '1rem', backgroundColor: '#f9fafb' }}>
                    {selectedFeedback.message}
                  </div>
                </div>
                
                <div className="mt-4" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleDelete(selectedFeedback.id)}
                  >
                    Delete Feedback
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageFeedback;
