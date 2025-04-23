// config/db.js
require('dotenv').config();  // Load environment variables

const { Pool } = require('pg');

// Use the single DATABASE_URL string
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // If your provider requires SSL (Render does), enable it:
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database via DATABASE_URL');
});

module.exports = pool;
