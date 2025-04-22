/// config/db.js
require('dotenv').config();  // Load environment variables

const { Pool } = require('pg');

// Create the PostgreSQL connection pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
});

// Confirm the database connection
pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database');
});

module.exports = pool;
