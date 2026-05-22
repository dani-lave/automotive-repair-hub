const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database Connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'automotive_repair_hub'
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Initialize Database
async function initializeDatabase() {
  try {
    // Create Tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        year INTEGER NOT NULL,
        make VARCHAR(50) NOT NULL,
        model VARCHAR(100) NOT NULL,
        trim VARCHAR(100),
        body_type VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS vehicle_specs (
        id SERIAL PRIMARY KEY,
        vehicle_id INTEGER UNIQUE REFERENCES vehicles(id),
        engine_type VARCHAR(100),
        displacement VARCHAR(50),
        horsepower INTEGER,
        torque INTEGER,
        transmission VARCHAR(100),
        drive_type VARCHAR(50),
        fuel_type VARCHAR(50),
        fuel_economy_city INTEGER,
        fuel_economy_highway INTEGER,
        length DECIMAL(10, 2),
        width DECIMAL(10, 2),
        height DECIMAL(10, 2),
        wheelbase DECIMAL(10, 2),
        curb_weight INTEGER,
        cargo_capacity INTEGER,
        seating_capacity INTEGER,
        towing_capacity INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS repair_guides (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        difficulty_level VARCHAR(20),
        estimated_time VARCHAR(50),
        tools_needed TEXT,
        description TEXT,
        steps TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS rebuild_procedures (
        id SERIAL PRIMARY KEY,
        component_name VARCHAR(255) NOT NULL,
        vehicle_type VARCHAR(100),
        common_issues TEXT,
        rebuild_steps TEXT,
        parts_needed TEXT,
        estimated_cost VARCHAR(100),
        preventive_maintenance TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_vehicles_make_model ON vehicles(make, model);
      CREATE INDEX IF NOT EXISTS idx_repair_guides_category ON repair_guides(category);
    `);

    console.log('✅ Database tables created/verified');
    await seedDatabase();
  } catch (err) {
    console.error('Database initialization error:', err);
  }
}

// Seed Database with Sample Data
async function seedDatabase() {
  try {
    const vehicleCount = await pool.query('SELECT COUNT(*) FROM vehicles');
    
    if (vehicleCount.rows[0].count === 0) {
      // Sample vehicles data
      const vehicles = [
        // Toyota
        { year: 2023, make: 'Toyota', model: 'Camry', trim: 'LE', body_type: 'Sedan' },
        { year: 2023, make: 'Toyota', model: 'Corolla', trim: 'S', body_type: 'Sedan' },
        { year: 2023, make: 'Toyota', model: 'RAV4', trim: 'XLE', body_type: 'SUV' },
        { year: 2022, make: 'Toyota', model: 'Tacoma', trim: 'SR', body_type: 'Truck' },
        
        // Honda
        { year: 2023, make: 'Honda', model: 'Civic', trim: 'EX', body_type: 'Sedan' },
        { year: 2023, make: 'Honda', model: 'Accord', trim: 'Sport', body_type: 'Sedan' },
        { year: 2023, make: 'Honda', model: 'CR-V', trim: 'EX', body_type: 'SUV' },
        
        // Ford
        { year: 2023, make: 'Ford', model: 'F-150', trim: 'XLT', body_type: 'Truck' },
        { year: 2023, make: 'Ford', model: 'Mustang', trim: 'GT', body_type: 'Coupe' },
        { year: 2023, make: 'Ford', model: 'Explorer', trim: 'XLT', body_type: 'SUV' },
        
        // Chevrolet
        { year: 2023, make: 'Chevrolet', model: 'Silverado', trim: '1500', body_type: 'Truck' },
        { year: 2023, make: 'Chevrolet', model: 'Malibu', trim: 'LT', body_type: 'Sedan' },
        { year: 2023, make: 'Chevrolet', model: 'Equinox', trim: 'LT', body_type: 'SUV' },
        
        // BMW
        { year: 2023, make: 'BMW', model: '3 Series', trim: '330i', body_type: 'Sedan' },
        { year: 2023, make: 'BMW', model: '5 Series', trim: '540i', body_type: 'Sedan' },
        { year: 2023, make: 'BMW', model: 'X5', trim: 'xDrive40i', body_type: 'SUV' },
        
        // Mercedes-Benz
        { year: 2023, make: 'Mercedes-Benz', model: 'C-Class', trim: 'C 300', body_type: 'Sedan' },
        { year: 2023, make: 'Mercedes-Benz', model: 'E-Class', trim: 'E 350', body_type: 'Sedan' },
        { year: 2023, make: 'Mercedes-Benz', model: 'GLC', trim: 'GLC 300', body_type: 'SUV' },
        
        // Audi
        { year: 2023, make: 'Audi', model: 'A4', trim: '40 TFSI', body_type: 'Sedan' },
        { year: 2023, make: 'Audi', model: 'A6', trim: '55 TFSI', body_type: 'Sedan' },
        {](#)`
