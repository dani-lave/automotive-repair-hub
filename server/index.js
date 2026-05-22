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
    `);

    console.log('✅ Database tables created');
    await seedDatabase();
  } catch (err) {
    console.error('Database init error:', err);
  }
}

// Seed Database
async function seedDatabase() {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM vehicles');
    
    if (result.rows[0].count === 0) {
      const vehicles = [
        { year: 2023, make: 'Toyota', model: 'Camry', trim: 'LE', body_type: 'Sedan' },
        { year: 2023, make: 'Toyota', model: 'Corolla', trim: 'S', body_type: 'Sedan' },
        { year: 2023, make: 'Toyota', model: 'RAV4', trim: 'XLE', body_type: 'SUV' },
        { year: 2022, make: 'Toyota', model: 'Tacoma', trim: 'SR', body_type: 'Truck' },
        { year: 2023, make: 'Honda', model: 'Civic', trim: 'EX', body_type: 'Sedan' },
        { year: 2023, make: 'Honda', model: 'Accord', trim: 'Sport', body_type: 'Sedan' },
        { year: 2023, make: 'Honda', model: 'CR-V', trim: 'EX', body_type: 'SUV' },
        { year: 2023, make: 'Ford', model: 'F-150', trim: 'XLT', body_type: 'Truck' },
        { year: 2023, make: 'Ford', model: 'Mustang', trim: 'GT', body_type: 'Coupe' },
        { year: 2023, make: 'Ford', model: 'Explorer', trim: 'XLT', body_type: 'SUV' },
        { year: 2023, make: 'Chevrolet', model: 'Silverado', trim: '1500', body_type: 'Truck' },
        { year: 2023, make: 'Chevrolet', model: 'Malibu', trim: 'LT', body_type: 'Sedan' },
        { year: 2023, make: 'Chevrolet', model: 'Equinox', trim: 'LT', body_type: 'SUV' },
        { year: 2023, make: 'BMW', model: '3 Series', trim: '330i', body_type: 'Sedan' },
        { year: 2023, make: 'BMW', model: '5 Series', trim: '540i', body_type: 'Sedan' },
        { year: 2023, make: 'BMW', model: 'X5', trim: 'xDrive40i', body_type: 'SUV' },
        { year: 2023, make: 'Mercedes-Benz', model: 'C-Class', trim: 'C 300', body_type: 'Sedan' },
        { year: 2023, make: 'Mercedes-Benz', model: 'E-Class', trim: 'E 350', body_type: 'Sedan' },
        { year: 2023, make: 'Mercedes-Benz', model: 'GLC', trim: 'GLC 300', body_type: 'SUV' },
        { year: 2023, make: 'Audi', model: 'A4', trim: '40 TFSI', body_type: 'Sedan' },
        { year: 2023, make: 'Audi', model: 'A6', trim: '55 TFSI', body_type: 'Sedan' },
        { year: 2023, make: 'Audi', model: 'Q5', trim: '45 TFSI', body_type: 'SUV' },
        { year: 2023, make: 'Nissan', model: 'Altima', trim: 'SV', body_type: 'Sedan' },
        { year: 2023, make: 'Nissan', model: 'Rogue', trim: 'SV', body_type: 'SUV' },
        { year: 2023, make: 'Hyundai', model: 'Elantra', trim: 'SEL', body_type: 'Sedan' },
        { year: 2023, make: 'Hyundai', model: 'Santa Fe', trim: 'SEL', body_type: 'SUV' },
        { year: 2023, make: 'Kia', model: 'Optima', trim: 'EX', body_type: 'Sedan' },
        { year: 2023, make: 'Kia', model: 'Sorento', trim: 'EX', body_type: 'SUV' },
        { year: 2023, make: 'Subaru', model: 'Outback', trim: '2.5i', body_type: 'Wagon' },
        { year: 2023, make: 'Subaru', model: 'Impreza', trim: '2.0i', body_type: 'Sedan' }
      ];

      for (const vehicle of vehicles) {
        await pool.query(
          'INSERT INTO vehicles (year, make, model, trim, body_type) VALUES ($1, $2, $3, $4, $5)',
          [vehicle.year, vehicle.make, vehicle.model, vehicle.trim, vehicle.body_type]
        );
      }

      // Add specs for first 5 vehicles
      const specsData = [
        { vehicle_id: 1, engine_type: '2.5L 4-Cylinder', displacement: '2.5L', horsepower: 203, torque: 184, transmission: '8-Speed Automatic', drive_type: 'FWD', fuel_type: 'Gasoline', fuel_economy_city: 28, fuel_economy_highway: 39, length: 192.1, width: 71.7, height: 57.1, wheelbase: 112.2, curb_weight: 3315, cargo_capacity: 15, seating_capacity: 5, towing_capacity: 0 },
        { vehicle_id: 2, engine_type: '1.8L 4-Cylinder', displacement: '1.8L', horsepower: 139, torque: 126, transmission: '6-Speed Automatic', drive_type: 'FWD', fuel_type: 'Gasoline', fuel_economy_city: 31, fuel_economy_highway: 40, length: 182.9, width: 70.1, height: 56.5, wheelbase: 106.3, curb_weight: 2920, cargo_capacity: 13, seating_capacity: 5, towing_capacity: 0 },
        { vehicle_id: 3, engine_type: '2.5L 4-Cylinder', displacement: '2.5L', horsepower: 203, torque: 184, transmission: '8-Speed Automatic', drive_type: 'AWD', fuel_type: 'Gasoline', fuel_economy_city: 26, fuel_economy_highway: 35, length: 182.4, width: 74.0, height: 68.6, wheelbase: 107.5, curb_weight: 3550, cargo_capacity: 37, seating_capacity: 5, towing_capacity: 1500 },
        { vehicle_id: 5, engine_type: '2.0L 4-Cylinder Turbo', displacement: '2.0L', horsepower: 174, torque: 162, transmission: 'CVT Automatic', drive_type: 'FWD', fuel_type: 'Gasoline', fuel_economy_city: 28, fuel_economy_highway: 37, length: 182.3, width: 70.9, height: 56.3, wheelbase: 106.3, curb_weight: 3050, cargo_capacity: 12, seating_capacity: 5, towing_capacity: 0 },
        { vehicle_id: 6, engine_type: '1.5L 4-Cylinder Turbo', displacement: '1.5L', horsepower: 192, torque: 185, transmission: 'CVT Automatic', drive_type: 'FWD', fuel_type: 'Gasoline', fuel_economy_city: 33, fuel_economy_highway: 42, length: 191.9, width: 72.8, height: 57.4, wheelbase: 112.3, curb_weight: 3100, cargo_capacity: 14, seating_capacity: 5, towing_capacity: 0 }
      ];

      for (const spec of specsData) {
        await pool.query(
          'INSERT INTO vehicle_specs (vehicle_id, engine_type, displacement, horsepower, torque, transmission, drive_type, fuel_type, fuel_economy_city, fuel_economy_highway, length, width, height, wheelbase, curb_weight, cargo_capacity, seating_capacity, towing_capacity) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)',
          [spec.vehicle_id, spec.engine_type, spec.displacement, spec.horsepower, spec.torque, spec.transmission, spec.drive_type, spec.fuel_type, spec.fuel_economy_city, spec.fuel_economy_highway, spec.length, spec.width, spec.height, spec.wheelbase, spec.curb_weight, spec.cargo_capacity, spec.seating_capacity, spec.towing_capacity]
        );
      }

      const repairs = [
        { title: 'Oil Change', category: 'Maintenance', difficulty_level: 'Easy', estimated_time: '30 minutes', tools_needed: 'Oil pan, wrench, oil filter wrench', description: 'Regular oil change procedure', steps: 'Warm up engine, drain old oil, replace filter, add new oil, check level' },
        { title: 'Brake Pad Replacement', category: 'Brakes', difficulty_level: 'Medium', estimated_time: '1 hour', tools_needed: 'Jack, lug wrench, brake tool set', description: 'Replace worn brake pads', steps: 'Lift vehicle, remove wheel, remove caliper, install new pads, bleed system if needed' },
        { title: 'Battery Replacement', category: 'Electrical', difficulty_level: 'Easy', estimated_time: '20 minutes', tools_needed: 'Socket set, battery terminal cleaner', description: 'Replace vehicle battery', steps: 'Disconnect terminals, remove old battery, install new battery, reconnect terminals, test electrical system' },
        { title: 'Air Filter Replacement', category: 'Maintenance', difficulty_level: 'Easy', estimated_time: '15 minutes', tools_needed: 'Screwdriver, new air filter', description: 'Replace air filter element', steps: 'Open hood, locate air filter box, remove clips, remove old filter, install new filter, secure box' },
        { title: 'Transmission Fluid Check', category: 'Maintenance', difficulty_level: 'Easy', estimated_time: '10 minutes', tools_needed: 'Transmission dipstick, clean rag', description: 'Check transmission fluid level and condition', steps: 'Start engine, warm to operating temperature, locate dipstick, check level and color, top off if needed' },
        { title: 'Spark Plug Replacement', category: 'Engine', difficulty_level: 'Medium', estimated_time: '1.5 hours', tools_needed: 'Spark plug socket, wrench, gap tool', description: 'Replace spark plugs', steps: 'Remove spark plug wires, unscrew old plugs, gap new plugs, install new plugs, reconnect wires' },
        { title: 'Radiator Flush', category: 'Engine', difficulty_level: 'Medium', estimated_time: '2 hours', tools_needed: 'Coolant, drain pan, wrench set', description: 'Flush and refill radiator coolant', steps: 'Drain radiator, flush with water, refill with coolant, bleed air pockets, test system' },
        { title: 'Tire Rotation', category: 'Maintenance', difficulty_level: 'Easy', estimated_time: '45 minutes', tools_needed: 'Jack, lug wrench', description: 'Rotate all four tires', steps: 'Lift vehicle on all corners, remove wheels, rotate tires to different positions, reinstall wheels' },
        { title: 'Alternator Replacement', category: 'Electrical', difficulty_level: 'Hard', estimated_time: '3 hours', tools_needed: 'Socket set, alternator puller', description: 'Replace faulty alternator', steps: 'Disconnect battery, remove serpentine belt, unbolt alternator, disconnect electrical connectors, install new alternator, reconnect all components' },
        { title: 'Suspension Inspection', category: 'Suspension', difficulty_level: 'Medium', estimated_time: '1 hour', tools_needed: 'Jack, inspection tools', description: 'Inspect suspension components', steps: 'Lift vehicle safely, inspect struts and shocks, check ball joints, look for leaks and damage, note any worn components' }
      ];

      for (const repair of repairs) {
        await pool.query(
          'INSERT INTO repair_guides (title, category, difficulty_level, estimated_time, tools_needed, description, steps) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [repair.title, repair.category, repair.difficulty_level, repair.estimated_time, repair.tools_needed, repair.description, repair.steps]
        );
      }

      const rebuilds = [
        { component_name: 'Engine Rebuild', vehicle_type: 'General', common_issues: 'Low compression, metal in oil, hard starting', rebuild_steps: 'Complete teardown, cleaning, honing cylinders, replacing rings and bearings, reassembly with new gaskets', parts_needed: 'Piston rings, bearings, gaskets, seals', estimated_cost: '$2000-$5000', preventive_maintenance: 'Regular oil changes, proper warm-up, avoid overheating' },
        { component_name: 'Transmission Rebuild', vehicle_type: 'General', common_issues: 'Slipping, delayed engagement, hard shifts', rebuild_steps: 'Remove transmission, complete disassembly, inspect all components, replace worn seals and clutches, reassemble with proper torque specs', parts_needed: 'Seals, clutch packs, bands, gaskets', estimated_cost: '$1500-$3000', preventive_maintenance: 'Regular fluid changes, avoid overloading, smooth driving habits' },
        { component_name: 'Brake System Rebuild', vehicle_type: 'General', common_issues: 'Soft pedal, excessive noise, uneven braking', rebuild_steps: 'Remove brake components, clean caliper bores, replace seals and pistons, bleed entire system, test pressure', parts_needed: 'Brake fluid, seal kits, pistons, hoses', estimated_cost: '$500-$1500', preventive_maintenance: 'Regular inspections, fluid flushes every 2 years, pad replacements' },
        { component_name: 'Suspension Rebuild', vehicle_type: 'General', common_issues: 'Poor handling, excessive bounce, clunking noises', rebuild_steps: 'Remove suspension components, inspect for damage, replace struts and shocks, install new springs if needed, realign wheels', parts_needed: 'Struts, shocks, springs, ball joints, alignment shims', estimated_cost: '$1000-$2500', preventive_maintenance: 'Regular inspections, smooth driving, avoid pothole impacts' },
        { component_name: 'Steering Rebuild', vehicle_type: 'General', common_issues: 'Loose steering, wandering, difficulty turning', rebuild_steps: 'Remove steering wheel, disassemble column, inspect for wear, replace tie rods and joints, test alignment', parts_needed: 'Tie rod ends, steering column bushings, grease', estimated_cost: '$800-$1500', preventive_maintenance: 'Avoid hard impacts, regular alignment checks, power steering fluid flushes' }
      ];

      for (const rebuild of rebuilds) {
        await pool.query(
          'INSERT INTO rebuild_procedures (component_name, vehicle_type, common_issues, rebuild_steps, parts_needed, estimated_cost, preventive_maintenance) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [rebuild.component_name, rebuild.vehicle_type, rebuild.common_issues, rebuild.rebuild_steps, rebuild.parts_needed, rebuild.estimated_cost, rebuild.preventive_maintenance]
        );
      }

      console.log('✅ Database seeded with sample data');
    }
  } catch (err) {
    console.error('Seed error:', err);
  }
}

// Initialize on startup
initializeDatabase();

// API Routes

// Get all vehicles (with filtering)
app.get('/api/vehicles', async (req, res) => {
  try {
    const { make, model, year } = req.query;
    let query = 'SELECT * FROM vehicles WHERE 1=1';
    const params = [];

    if (make) {
      params.push(make);
      query += ` AND make = $${params.length}`;
    }
    if (model) {
      params.push(model);
      query += ` AND model = $${params.length}`;
    }
    if (year) {
      params.push(year);
      query += ` AND year = $${params.length}`;
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get unique makes
app.get('/api/vehicles/makes', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT make FROM vehicles ORDER BY make');
    res.json(result.rows.map(r => r.make));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get models by make
app.get('/api/vehicles/models/:make', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT model FROM vehicles WHERE make = $1 ORDER BY model', [req.params.make]);
    res.json(result.rows.map(r => r.model));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get years by make and model
app.get('/api/vehicles/years/:make/:model', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT year FROM vehicles WHERE make = $1 AND model = $2 ORDER BY year DESC', [req.params.make, req.params.model]);
    res.json(result.rows.map(r => r.year));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get vehicle details
app.get('/api/vehicles/:id', async (req, res) => {
  try {
    const vehicleResult = await pool.query('SELECT * FROM vehicles WHERE id = $1', [req.params.id]);
    const specsResult = await pool.query('SELECT * FROM vehicle_specs WHERE vehicle_id = $1', [req.params.id]);

    res.json({
      vehicle: vehicleResult.rows[0],
      specs: specsResult.rows[0] || null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all repair guides
app.get('/api/repairs', async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM repair_guides';
    const params = [];

    if (category) {
      params.push(category);
      query += ` WHERE category = $${params.length}`;
    }

    query += ' ORDER BY category, title';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get repair guide by ID
app.get('/api/repairs/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM repair_guides WHERE id = $1', [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all rebuild procedures
app.get('/api/rebuild', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rebuild_procedures ORDER BY component_name');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search
app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ vehicles: [], repairs: [], rebuilds: [] });

    const vehicleResult = await pool.query(
      'SELECT * FROM vehicles WHERE make ILIKE $1 OR model ILIKE $1 OR trim ILIKE $1',
      [`%${q}%`]
    );

    const repairResult = await pool.query(
      'SELECT * FROM repair_guides WHERE title ILIKE $1 OR description ILIKE $1 OR category ILIKE $1',
      [`%${q}%`]
    );

    const rebuildResult = await pool.query(
      'SELECT * FROM rebuild_procedures WHERE component_name ILIKE $1 OR common_issues ILIKE $1',
      [`%${q}%`]
    );

    res.json({
      vehicles: vehicleResult.rows,
      repairs: repairResult.rows,
      rebuilds: rebuildResult.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});