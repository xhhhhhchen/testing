// // require('dotenv').config();
// // const { Pool } = require('pg');

// // const pool = new Pool({
// //   connectionString: process.env.DATABASE_URL,
// //   ssl: {
// //     rejectUnauthorized: false, // required by Supabase SSL setup
// //   },
// // });

// // const query = (text, params) => pool.query(text, params);

// // module.exports = { query };

// import postgres from 'postgres'

// const connectionString = process.env.USER_DB_URL
// const sql = postgres(connectionString)

// export default sql