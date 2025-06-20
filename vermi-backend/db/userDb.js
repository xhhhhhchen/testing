const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.USER_DB_URL,
  ssl: {
    rejectUnauthorized: false, // REQUIRED for Neon
  },
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
