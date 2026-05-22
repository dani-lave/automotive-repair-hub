import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Pages.css';

function RebuildProcedures() {
  const [rebuilds, setRebuilds] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchRebuilds = async () => {
      try {
        const response = await axios.get('/api/rebuild');
        setRebuilds(response.data);
      } catch (err) {
        console.error('Error fetching rebuilds:', err);
      }
    };
    fetchRebuilds();
  }, []);

  return (
    <div className="rebuild">
      <div className="container">
        <h1 className="page-title">Rebuild Procedures</h1>

        <div>
          {rebuilds.map(rebuild => (
            <div key={rebuild.id} className="rebuild-card">
              <div onClick={() => setExpandedId(expandedId === rebuild.id ? null : rebuild.id)} style={{cursor: 'pointer'}}>
                <h3>{rebuild.component_name}</h3>
                <p style={{color: '#666', marginBottom: '10px'}}>
                  {rebuild.vehicle_type && <strong>Vehicle Type:</strong>} {rebuild.vehicle_type}
                </p>
                {rebuild.estimated_cost && (
                  <div style={{background: '#f0f0f0', padding: '10px', borderRadius: '6px', marginTop: '10px'}}>
                    <strong>Estimated Cost:</strong> {rebuild.estimated_cost}
                  </div>
                )}
              </div>
              
              {expandedId === rebuild.id && (
                <div style={{marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #ddd'}}>
                  {rebuild.common_issues && (
                    <div style={{marginBottom: '15px'}}>
                      <h4 style={{color: '#764ba2', marginBottom: '8px'}}>Common Issues:</h4>
                      <p style={{color: '#666'}}>{rebuild.common_issues}</p>
                    </div>
                  )}
                  {rebuild.rebuild_steps && (
                    <div style={{marginBottom: '15px'}}>
                      <h4 style={{color: '#764ba2', marginBottom: '8px'}}>Rebuild Steps:</h4>
                      <p style={{color: '#666', whiteSpace: 'pre-wrap'}}>{rebuild.rebuild_steps}</p>
                    </div>
                  )}
                  {rebuild.parts_needed && (
                    <div style={{marginBottom: '15px'}}>
                      <h4 style={{color: '#764ba2', marginBottom: '8px'}}>Parts Needed:</h4>
                      <p style={{color: '#666'}}>{rebuild.parts_needed}</p>
                    </div>
                  )}
                  {rebuild.preventive_maintenance && (
                    <div>
                      <h4 style={{color: '#764ba2', marginBottom: '8px'}}>Preventive Maintenance:</h4>
                      <p style={{color: '#666'}}>{rebuild.preventive_maintenance}</p>
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

export default RebuildProcedures;