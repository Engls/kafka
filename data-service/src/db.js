const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'student',
  password: process.env.POSTGRES_PASSWORD || 'student',
  host: process.env.POSTGRES_HOST || 'postgres',
  database: process.env.POSTGRES_DB || 'social',
  port: 5432,
});
module.exports = pool;