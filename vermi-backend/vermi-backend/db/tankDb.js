const { Pool } = require('pg');
require('dotenv').config();

const tankPool = new Pool({
  user: process.env.TANK_DB_USER,
  host: process.env.TANK_DB_HOST,
  database: process.env.TANK_DB_NAME,
  password: process.env.TANK_DB_PASSWORD,
  port: Number(process.env.TANK_DB_PORT), // Ensure it's a number
  ssl: { rejectUnauthorized: false } // Add this for remote DBs
});

module.exports = {
  query: (text, params) => tankPool.query(text, params),
};

