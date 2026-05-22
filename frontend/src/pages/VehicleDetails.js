import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Pages.css';

function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [specs, setSpecs] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`/api/vehicles/${id}`);
        setVehicle(response.data.vehicle);
        setSpecs(response.data.specs);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching vehicle details:', err);
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <div className="no-results">Loading...</div>;
  if (!vehicle) return <div className="no-results">Vehicle not found</div>;

  return (
    <div className="browse">
      <div className="container">
        <button className="btn btn-secondary" onClick={() => navigate('/browse')} style={{marginBottom: '20px'}}>
          ← Back to Browse
        </button>

        <h1 style={{color: 'white', marginBottom: '30px'}}>
          {vehicle.year} {vehicle.make} {vehicle.model}
        </h1>

        <div className="vehicle-specs">
          <h2 style={{color: '#667eea', marginBottom: '20px'}}>Basic Information</h2>
          <div className="specs-grid">
            <div className="spec-item">
              <div className="spec-label">Year</div>
              <div className="spec-value">{vehicle.year}</div>
            </div>
            <div className="spec-item">
              <div className="spec-label">Make</div>
              <div className="spec-value">{vehicle.make}</div>
            </div>
            <div className="spec-item">
              <div className="spec-label">Model</div>
              <div className="spec-value">{vehicle.model}</div>
            </div>
            <div className="spec-item">
              <div className="spec-label">Trim</div>
              <div className="spec-value">{vehicle.trim || 'N/A'}</div>
            </div>
            <div className="spec-item">
              <div className="spec-label">Body Type</div>
              <div className="spec-value">{vehicle.body_type || 'N/A'}</div>
            </div>
          </div>
        </div>

        {specs && (
          <div className="vehicle-specs" style={{marginTop: '30px'}}>
            <h2 style={{color: '#667eea', marginBottom: '20px'}}>Detailed Specifications</h2>
            
            <h3 style={{color: '#333', marginTop: '20px', marginBottom: '15px'}}>Engine & Performance</h3>
            <div className="specs-grid">
              {specs.engine_type && <div className="spec-item">
                <div className="spec-label">Engine Type</div>
                <div className="spec-value">{specs.engine_type}</div>
              </div>}
              {specs.displacement && <div className="spec-item">
                <div className="spec-label">Displacement</div>
                <div className="spec-value">{specs.displacement}</div>
              </div>}
              {specs.horsepower && <div className="spec-item">
                <div className="spec-label">Horsepower</div>
                <div className="spec-value">{specs.horsepower} hp</div>
              </div>}
              {specs.torque && <div className="spec-item">
                <div className="spec-label">Torque</div>
                <div className="spec-value">{specs.torque} lb-ft</div>
              </div>}
              {specs.transmission && <div className="spec-item">
                <div className="spec-label">Transmission</div>
                <div className="spec-value">{specs.transmission}</div>
              </div>}
              {specs.drive_type && <div className="spec-item">
                <div className="spec-label">Drive Type</div>
                <div className="spec-value">{specs.drive_type}</div>
              </div>}
            </div>

            <h3 style={{color: '#333', marginTop: '20px', marginBottom: '15px'}}>Fuel & Efficiency</h3>
            <div className="specs-grid">
              {specs.fuel_type && <div className="spec-item">
                <div className="spec-label">Fuel Type</div>
                <div className="spec-value">{specs.fuel_type}</div>
              </div>}
              {specs.fuel_economy_city && <div className="spec-item">
                <div className="spec-label">City MPG</div>
                <div className="spec-value">{specs.fuel_economy_city}</div>
              </div>}
              {specs.fuel_economy_highway && <div className="spec-item">
                <div className="spec-label">Highway MPG</div>
                <div className="spec-value">{specs.fuel_economy_highway}</div>
              </div>}
            </div>

            <h3 style={{color: '#333', marginTop: '20px', marginBottom: '15px'}}>Dimensions & Capacity</h3>
            <div className="specs-grid">
              {specs.length && <div className="spec-item">
                <div className="spec-label">Length</div>
                <div className="spec-value">{specs.length} in</div>
              </div>}
              {specs.width && <div className="spec-item">
                <div className="spec-label">Width</div>
                <div className="spec-value">{specs.width} in</div>
              </div>}
              {specs.height && <div className="spec-item">
                <div className="spec-label">Height</div>
                <div className="spec-value">{specs.height} in</div>
              </div>}
              {specs.wheelbase && <div className="spec-item">
                <div className="spec-label">Wheelbase</div>
                <div className="spec-value">{specs.wheelbase} in</div>
              </div>}
              {specs.curb_weight && <div className="spec-item">
                <div className="spec-label">Curb Weight</div>
                <div className="spec-value">{specs.curb_weight} lbs</div>
              </div>}
              {specs.seating_capacity && <div className="spec-item">
                <div className="spec-label">Seating</div>
                <div className="spec-value">{specs.seating_capacity} passengers</div>
              </div>}
              {specs.cargo_capacity && <div className="spec-item">
                <div className="spec-label">Cargo Capacity</div>
                <div className="spec-value">{specs.cargo_capacity} cu ft</div>
              </div>}
              {specs.towing_capacity && specs.towing_capacity > 0 && <div className="spec-item">
                <div className="spec-label">Towing Capacity</div>
                <div className="spec-value">{specs.towing_capacity} lbs</div>
              </div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VehicleDetails;