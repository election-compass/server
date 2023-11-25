const mysql = require('mysql2/promise');

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.CLOUD_SQL_HOST,
  user: process.env.CLOUD_SQL_USERNAME,
  password: CLOUD_SQL_PASSWORD,
  database: CLOUD_SQL_DATABASE,
  port: CLOUD_SQL_PORT
});

module.exports = pool;
