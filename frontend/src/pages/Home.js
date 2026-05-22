import React from 'react';
import { Link } from 'react-router-dom';
import './Pages.css';

function Home() {
  return (
    <div className="home">
      <div className="container">
        <div className="hero">
          <h1>🚗 Welcome to Automotive Repair Hub</h1>
          <p>Your complete guide to vehicle specifications, repair procedures, and rebuild information</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Browse Vehicles</h3>
            <p>Explore detailed specifications for thousands of vehicles including engine specs, dimensions, and performance data.</p>
            <Link to="/browse" className="btn">Get Started</Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔧</div>
            <h3>Repair Guides</h3>
            <p>Access step-by-step repair guides for common maintenance and repairs with difficulty levels and time estimates.</p>
            <Link to="/repairs" className="btn">View Guides</Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚙️</div>
            <h3>Rebuild Procedures</h3>
            <p>Learn about component rebuilds including engines, transmissions, and suspension systems with preventive maintenance tips.</p>
            <Link to="/rebuild" className="btn">Explore Rebuilds</Link>
          </div>
        </div>

        <div className="info-section">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h4>Select Your Vehicle</h4>
              <p>Choose your vehicle's make, model, and year to access specific information.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h4>View Specifications</h4>
              <p>Get comprehensive specs including engine details, dimensions, and performance metrics.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h4>Access Guides</h4>
              <p>Follow detailed repair guides and rebuild procedures for your vehicle type.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;