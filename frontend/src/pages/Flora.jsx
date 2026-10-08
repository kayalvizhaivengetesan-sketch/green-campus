import { useState, useEffect } from 'react';
import { getFlora } from '../utils/storage';
import FloraCard from '../components/FloraCard';
import { Search, Filter } from 'lucide-react';
import './Listing.css';

const Flora = () => {
  const [flora, setFlora] = useState([]);
  const [filteredFlora, setFilteredFlora] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', 'Trees', 'Flowering Plants', 'Medicinal Plants', 'Ornamental Plants', 'Fruit Plants'];

  useEffect(() => {
    const fetchData = async () => {
      const data = await getFlora();
      setFlora(data);
      setFilteredFlora(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = flora;
    
    if (searchTerm) {
      result = result.filter(item => 
        item.commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.scientificName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tamilName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'All') {
      result = result.filter(item => (item.category || '').includes(selectedCategory));
    }
    
    setFilteredFlora(result);
  }, [searchTerm, selectedCategory, flora]);

  return (
    <div className="listing-page">
      <div className="page-header">
        <div className="container">
          <h1>Flora Directory</h1>
          <p>Discover the rich plant life thriving on our Green Campus.</p>
        </div>
      </div>
      
      <div className="container section">
        <div className="filters-container card">
          <div className="search-box">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              placeholder="Search by common, scientific, or Tamil name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="category-filter">
            <Filter className="filter-icon" size={20} />
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="results-info">
          Showing {filteredFlora.length} results
        </div>
        
        {filteredFlora.length > 0 ? (
          <div className="grid-3">
            {filteredFlora.map(item => (
              <FloraCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="no-results card">
            <h3>No flora found</h3>
            <p>Try adjusting your search or category filter.</p>
            <button 
              className="btn btn-primary mt-3"
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Flora;
