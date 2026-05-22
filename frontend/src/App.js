import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Browse from './pages/Browse';
import VehicleDetails from './pages/VehicleDetails';
import RepairGuides from './pages/RepairGuides';
import RebuildProcedures from './pages/RebuildProcedures';
import Search from './pages/Search';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/vehicle/:id" element={<VehicleDetails />} />
          <Route path="/repairs" element={<RepairGuides />} />
          <Route path="/rebuild" element={<RebuildProcedures />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;