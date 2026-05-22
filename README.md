# Automotive Repair Hub

A comprehensive web application for browsing vehicle specifications, repair guides, and rebuild procedures.

## Features

- 🚗 **Browse Vehicles** - Explore detailed specifications for all makes and models
- 📋 **Vehicle Specs** - Engine details, horsepower, dimensions, fuel economy, and more
- 🔧 **Repair Guides** - Step-by-step guides for common maintenance and repairs
- ⚙️ **Rebuild Procedures** - Component rebuilds with preventive maintenance tips
- 🔍 **Full-Text Search** - Search vehicles, repairs, and rebuilds instantly
- 📱 **Responsive Design** - Works on all devices

## Tech Stack

- **Frontend:** React 18, React Router, Axios, CSS3
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL

## Setup Instructions

### Prerequisites
- Node.js v14+
- PostgreSQL v12+
- npm or yarn

### Backend Setup

1. Navigate to server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=automotive_repair_hub
   PORT=5000
   ```

4. Create PostgreSQL database:
   ```bash
   createdb automotive_repair_hub
   ```

5. Start the server:
   ```bash
   npm start
   ```
   Server runs on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   Frontend runs on http://localhost:3000

## API Endpoints

### Vehicles
- `GET /api/vehicles` - Get all vehicles (with filtering)
- `GET /api/vehicles/makes` - Get unique vehicle makes
- `GET /api/vehicles/models/:make` - Get models by make
- `GET /api/vehicles/years/:make/:model` - Get years by make and model
- `GET /api/vehicles/:id` - Get vehicle details with specs

### Repairs
- `GET /api/repairs` - Get all repair guides (with category filter)
- `GET /api/repairs/:id` - Get specific repair guide

### Rebuilds
- `GET /api/rebuild` - Get all rebuild procedures

### Search
- `GET /api/search?q=query` - Search vehicles, repairs, and rebuilds

## Database Schema

### vehicles
- id, year, make, model, trim, body_type, created_at

### vehicle_specs
- id, vehicle_id, engine_type, displacement, horsepower, torque, transmission, drive_type, fuel_type, fuel_economy_city, fuel_economy_highway, length, width, height, wheelbase, curb_weight, cargo_capacity, seating_capacity, towing_capacity, created_at

### repair_guides
- id, title, category, difficulty_level, estimated_time, tools_needed, description, steps, created_at

### rebuild_procedures
- id, component_name, vehicle_type, common_issues, rebuild_steps, parts_needed, estimated_cost, preventive_maintenance, created_at

## Usage

1. Navigate to http://localhost:3000
2. Browse vehicles by make, model, and year
3. View detailed specifications for each vehicle
4. Explore repair guides and rebuild procedures
5. Use the search feature to find specific information

## License

MIT
