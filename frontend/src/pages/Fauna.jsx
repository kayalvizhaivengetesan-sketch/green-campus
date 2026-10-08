import { useState, useEffect } from 'react';
import { getFauna } from '../utils/storage';
import FaunaCard from '../components/FaunaCard';
import { Search, Filter } from 'lucide-react';
import './Listing.css';

const Fauna = () => {
  const [fauna, setFauna] = useState([]);
  const [filteredFauna, setFilteredFauna] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', 'Birds', 'Mammals', 'Insects', 'Reptiles'];

  useEffect(() => {
    const fetchData = async () => {
      const data = await getFauna();
      setFauna(data);
      setFilteredFauna(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = fauna;
    
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
    
    setFilteredFauna(result);
  }, [searchTerm, selectedCategory, fauna]);

  return (
    <div className="listing-page">
      <div className="page-header">
        <div className="container">
          <h1>Fauna Directory</h1>
          <p>Explore the fascinating animal life that shares our Green Campus.</p>
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
          Showing {filteredFauna.length} results
        </div>
        
        {filteredFauna.length > 0 ? (
          <div className="grid-3">
            {filteredFauna.map(item => (
              <FaunaCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="no-results card">
            <h3>No fauna found</h3>
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

export default Fauna;
