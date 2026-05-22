const app = require('./app');
const { pool } = require('./config/db');
const { config } = require('./config/env');

function logServerStarted() {
  console.log(`SBS backend listening on port ${config.port}`);
}

const server = app.listen(config.port, logServerStarted);

function shutdown(signal) {
  console.log(`${signal} received. Closing SBS backend.`);

  server.close(async function closeServer() {
    await pool.end();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
