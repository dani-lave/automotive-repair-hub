import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Pages.css';

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState({ vehicles: [], repairs: [], rebuilds: [] });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/search?q=${encodeURIComponent(query)}`);
        setResults(response.data);
      } catch (err) {
        console.error('Error searching:', err);
      }
      setLoading(false);
    };
    fetchResults();
  }, [query]);

  const handleVehicleClick = (id) => {
    navigate(`/vehicle/${id}`);
  };

  return (
    <div className="search-page">
      <div className="container">
        <h1 className="page-title">Search Results for "{query}"</h1>

        {loading && <div className="no-results">Searching...</div>}

        {!loading && (
          <div className="search-results">
            {/* Vehicles Results */}
            {results.vehicles.length > 0 && (
              <div className="results-section">
                <h3>🚗 Vehicles ({results.vehicles.length})</h3>
                <div className="vehicles-grid">
                  {results.vehicles.map(vehicle => (
                    <div key={vehicle.id} className="vehicle-card" onClick={() => handleVehicleClick(vehicle.id)}>
                      <h3>{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                      <p><strong>Trim:</strong> {vehicle.trim || 'N/A'}</p>
                      <p><strong>Body Type:</strong> {vehicle.body_type || 'N/A'}</p>
                      <button className="btn" style={{width: '100%', marginTop: '15px'}}>View Details</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Repairs Results */}
            {results.repairs.length > 0 && (
              <div className="results-section">
                <h3>🔧 Repair Guides ({results.repairs.length})</h3>
                {results.repairs.map(repair => (
                  <div key={repair.id} className="repair-card">
                    <h3>{repair.title}</h3>
                    <div style={{marginBottom: '10px'}}>
                      {repair.category && <span className="repair-badge">{repair.category}</span>}
                      {repair.difficulty_level && <span className={`repair-badge ${repair.difficulty_level.toLowerCase()}`}>{repair.difficulty_level}</span>}
                    </div>
                    <p>{repair.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Rebuild Results */}
            {results.rebuilds.length > 0 && (
              <div className="results-section">
                <h3>⚙️ Rebuild Procedures ({results.rebuilds.length})</h3>
                {results.rebuilds.map(rebuild => (
                  <div key={rebuild.id} className="rebuild-card">
                    <h3>{rebuild.component_name}</h3>
                    <p style={{color: '#666'}}>{rebuild.vehicle_type}</p>
                    {rebuild.estimated_cost && <p><strong>Cost:</strong> {rebuild.estimated_cost}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {results.vehicles.length === 0 && results.repairs.length === 0 && results.rebuilds.length === 0 && (
              <div className="no-results">No results found for "{query}"</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;