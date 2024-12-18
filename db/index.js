require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Path to the SSL certificate downloaded from Aiven.io
const sslCert = fs.readFileSync(path.resolve(__dirname, '../ca.pem'));

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: true,
    ca: sslCert.toString(),
  },
});

pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
