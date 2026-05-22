import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Pages.css';

function Browse() {
  const [makes, setMakes] = useState([]);
  const [selectedMake, setSelectedMake] = useState('');
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const navigate = useNavigate();

  // Fetch makes on mount
  useEffect(() => {
    const fetchMakes = async () => {
      try {
        const response = await axios.get('/api/vehicles/makes');
        setMakes(response.data);
      } catch (err) {
        console.error('Error fetching makes:', err);
      }
    };
    fetchMakes();
  }, []);

  // Fetch models when make changes
  useEffect(() => {
    if (!selectedMake) {
      setModels([]);
      return;
    }
    const fetchModels = async () => {
      try {
        const response = await axios.get(`/api/vehicles/models/${selectedMake}`);
        setModels(response.data);
        setSelectedModel('');
        setYears([]);
      } catch (err) {
        console.error('Error fetching models:', err);
      }
    };
    fetchModels();
  }, [selectedMake]);

  // Fetch years when model changes
  useEffect(() => {
    if (!selectedMake || !selectedModel) {
      setYears([]);
      return;
    }
    const fetchYears = async () => {
      try {
        const response = await axios.get(`/api/vehicles/years/${selectedMake}/${selectedModel}`);
        setYears(response.data);
        setSelectedYear('');
      } catch (err) {
        console.error('Error fetching years:', err);
      }
    };
    fetchYears();
  }, [selectedMake, selectedModel]);

  // Fetch vehicles when filters change
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        let url = '/api/vehicles?';
        if (selectedMake) url += `make=${selectedMake}&`;
        if (selectedModel) url += `model=${selectedModel}&`;
        if (selectedYear) url += `year=${selectedYear}`;
        
        const response = await axios.get(url);
        setVehicles(response.data);
        setSelectedVehicle(null);
      } catch (err) {
        console.error('Error fetching vehicles:', err);
      }
    };
    if (selectedMake || selectedModel || selectedYear) {
      fetchVehicles();
    }
  }, [selectedMake, selectedModel, selectedYear]);

  const handleVehicleClick = (id) => {
    navigate(`/vehicle/${id}`);
  };

  return (
    <div className="browse">
      <div className="container">
        <h1 className="page-title">Browse Vehicles</h1>

        <div className="selector-section">
          <div className="selector-group">
            <select value={selectedMake} onChange={(e) => setSelectedMake(e.target.value)}>
              <option value="">Select Make</option>
              {makes.map(make => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>

            {models.length > 0 && (
              <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
                <option value="">Select Model</option>
                {models.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            )}

            {years.length > 0 && (
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                <option value="">Select Year</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {vehicles.length > 0 && (
          <>
            <h2 style={{color: 'white', marginBottom: '20px'}}>Found {vehicles.length} vehicle(s)</h2>
            <div className="vehicles-grid">
              {vehicles.map(vehicle => (
                <div key={vehicle.id} className="vehicle-card" onClick={() => handleVehicleClick(vehicle.id)}>
                  <h3>{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                  <p><strong>Trim:</strong> {vehicle.trim || 'N/A'}</p>
                  <p><strong>Body Type:</strong> {vehicle.body_type || 'N/A'}</p>
                  <button className="btn" style={{width: '100%', marginTop: '15px'}}>View Details</button>
                </div>
              ))}
            </div>
          </>
        )}

        {selectedMake && vehicles.length === 0 && (
          <div className="no-results">No vehicles found. Try different filters.</div>
        )}
      </div>
    </div>
  );
}

export default Browse;