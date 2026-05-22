const mysql = require('mysql2/promise');

const { config } = require('./env');

const pool = mysql.createPool(config.database);

async function testDatabaseConnection() {
  const connection = await pool.getConnection();

  try {
    await connection.ping();
  } finally {
    connection.release();
  }
}

module.exports = {
  pool,
  testDatabaseConnection
};
