import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Pages.css';

function RepairGuides() {
  const [repairs, setRepairs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchRepairs = async () => {
      try {
        const response = await axios.get('/api/repairs');
        setRepairs(response.data);
        
        // Extract unique categories
        const cats = [...new Set(response.data.map(r => r.category))].sort();
        setCategories(cats);
      } catch (err) {
        console.error('Error fetching repairs:', err);
      }
    };
    fetchRepairs();
  }, []);

  const filteredRepairs = selectedCategory
    ? repairs.filter(r => r.category === selectedCategory)
    : repairs;

  const getDifficultyBadgeClass = (level) => {
    if (!level) return '';
    return level.toLowerCase();
  };

  return (
    <div className="repairs">
      <div className="container">
        <h1 className="page-title">Repair Guides</h1>

        <div className="filter-section">
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={{width: '100%'}}>
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          {filteredRepairs.map(repair => (
            <div key={repair.id} className="repair-card">
              <div onClick={() => setExpandedId(expandedId === repair.id ? null : repair.id)} style={{cursor: 'pointer'}}>
                <h3>{repair.title}</h3>
                <div style={{marginBottom: '10px'}}>
                  {repair.category && <span className="repair-badge">{repair.category}</span>}
                  {repair.difficulty_level && <span className={`repair-badge ${getDifficultyBadgeClass(repair.difficulty_level)}`}>{repair.difficulty_level}</span>}
                  {repair.estimated_time && <span className="repair-badge" style={{background: '#667eea'}}>{repair.estimated_time}</span>}
                </div>
                <p style={{color: '#666'}}>{repair.description}</p>
              </div>
              
              {expandedId === repair.id && (
                <div style={{marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eee'}}>
                  {repair.tools_needed && (
                    <div style={{marginBottom: '15px'}}>
                      <strong>Tools Needed:</strong>
                      <p style={{color: '#666'}}>{repair.tools_needed}</p>
                    </div>
                  )}
                  {repair.steps && (
                    <div>
                      <strong>Steps:</strong>
                      <p style={{color: '#666', whiteSpace: 'pre-wrap'}}>{repair.steps}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RepairGuides;