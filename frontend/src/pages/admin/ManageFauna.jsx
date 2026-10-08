import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { getFauna, addFauna, updateFauna, deleteFauna } from '../../utils/storage';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import './Admin.css';

const initialFormState = {
  id: '',
  commonName: '',
  tamilName: '',
  scientificName: '',
  category: 'Birds',
  habitat: '',
  description: '',
  diet: '',
  behaviour: '',
  conservationStatus: '',
  importanceToEcosystem: '',
  image1Url: '',
  image2File: '',
  image1: '', // for backward compatibility
  image2: ''  // for backward compatibility
};

const ManageFauna = () => {
  const [faunaList, setFaunaList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [isEditing, setIsEditing] = useState(false);

  const categories = ['Birds', 'Mammals', 'Insects', 'Reptiles'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getFauna();
    setFaunaList(data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setFormData(item);
      setIsEditing(true);
    } else {
      setFormData(initialFormState);
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(initialFormState);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Only JPG, JPEG, PNG and WEBP formats are allowed.');
      e.target.value = '';
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) { 
      alert('Image size must be less than 2MB.');
      e.target.value = '';
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, image2File: reader.result, image2: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateFauna(formData);
        alert('Update successful');
      } else {
        await addFauna({ ...formData, id: uuidv4() });
        alert('Record added successfully');
      }
      await loadData();
      handleCloseModal();
    } catch (error) {
      console.error(error);
      alert(error.message || 'An error occurred');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      await deleteFauna(id);
      await loadData();
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="d-flex justify-content-between align-items-center mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="admin-page-title" style={{ margin: 0 }}>Manage Fauna</h1>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={18} /> Add New Fauna
          </button>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Common Name</th>
                <th>Scientific Name</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {faunaList.length > 0 ? (
                faunaList.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <img 
                        src={item.image1Url || item.image1 || item.image2File || item.image2 || 'https://via.placeholder.com/50'} 
                        alt={item.commonName} 
                        className="table-img"
                      />
                    </td>
                    <td>{item.commonName}</td>
                    <td><em>{item.scientificName}</em></td>
                    <td>{item.category}</td>
                    <td>
                      <div className="action-btns">
                        <button className="btn btn-sm btn-outline" onClick={() => handleOpenModal(item)}>
                          <Edit size={16} /> Edit
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
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No fauna records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>{isEditing ? 'Edit Fauna' : 'Add New Fauna'}</h2>
                <button className="close-btn" onClick={handleCloseModal}>
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Common Name</label>
                    <input type="text" name="commonName" value={formData.commonName} onChange={handleInputChange} className="form-control" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tamil Name</label>
                    <input type="text" name="tamilName" value={formData.tamilName} onChange={handleInputChange} className="form-control" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Scientific Name</label>
                    <input type="text" name="scientificName" value={formData.scientificName} onChange={handleInputChange} className="form-control" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category (Select multiple)</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
                      {categories.map(cat => (
                        <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            value={cat} 
                            checked={(formData.category || '').includes(cat)} 
                            onChange={(e) => {
                              let selected = (formData.category || '').split(',').map(s => s.trim()).filter(Boolean);
                              if (e.target.checked) {
                                if (!selected.includes(cat)) selected.push(cat);
                              } else {
                                selected = selected.filter(s => s !== cat);
                              }
                              setFormData({...formData, category: selected.join(', ')});
                            }}
                          />
                          <span style={{ fontSize: '0.9rem' }}>{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Habitat</label>
                    <input type="text" name="habitat" value={formData.habitat} onChange={handleInputChange} className="form-control" />
                  </div>
                </div>

                <div className="form-group mt-3">
                  <label className="form-label">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} className="form-control" required rows="3"></textarea>
                </div>

                <h4 className="mt-4 mb-3">Additional Details (Optional)</h4>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Diet</label>
                    <textarea name="diet" value={formData.diet} onChange={handleInputChange} className="form-control" rows="2"></textarea>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Behaviour</label>
                    <textarea name="behaviour" value={formData.behaviour} onChange={handleInputChange} className="form-control" rows="2"></textarea>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Conservation Status</label>
                    <input type="text" name="conservationStatus" value={formData.conservationStatus} onChange={handleInputChange} className="form-control" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Importance to Ecosystem</label>
                    <textarea name="importanceToEcosystem" value={formData.importanceToEcosystem} onChange={handleInputChange} className="form-control" rows="2"></textarea>
                  </div>
                </div>

                <h4 className="mt-4 mb-3">Images (Maximum 2)</h4>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Image 1 URL</label>
                    <input 
                      type="url" 
                      name="image1Url" 
                      value={formData.image1Url || formData.image1 || ''} 
                      onChange={(e) => setFormData({...formData, image1Url: e.target.value, image1: e.target.value})} 
                      className="form-control" 
                      placeholder="https://..." 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Upload Image 2</label>
                    <input 
                      type="file" 
                      accept=".jpg,.jpeg,.png,.webp" 
                      onChange={handleFileChange} 
                      className="form-control" 
                    />
                  </div>
                </div>

                <div className="grid-2 mt-3">
                  <div>
                    {(formData.image1Url || formData.image1) && (
                      <div className="image-preview-container text-center mt-2">
                        <img src={formData.image1Url || formData.image1} alt="Preview 1" style={{ width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '8px' }} />
                        <button type="button" className="btn btn-sm btn-danger mt-2" onClick={() => setFormData({...formData, image1Url: '', image1: ''})}>Remove Image 1</button>
                      </div>
                    )}
                  </div>
                  <div>
                    {(formData.image2File || formData.image2) && (
                      <div className="image-preview-container text-center mt-2">
                        <img src={formData.image2File || formData.image2} alt="Preview 2" style={{ width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '8px' }} />
                        <button type="button" className="btn btn-sm btn-danger mt-2" onClick={() => setFormData({...formData, image2File: '', image2: ''})}>Remove Image 2</button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-outline" onClick={handleCloseModal}>Cancel</button>
                  <button type="submit" className="btn btn-primary">
                    {isEditing ? 'Update Record' : 'Save Record'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageFauna;
