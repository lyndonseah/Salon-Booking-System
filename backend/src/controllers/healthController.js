const { testDatabaseConnection } = require('../config/db');

async function getHealth(_req, res) {
  try {
    await testDatabaseConnection();

    return res.status(200).json({
      status: 'ok',
      service: 'sbs-backend',
      database: {
        status: 'connected'
      }
    });
  } catch (error) {
    return res.status(503).json({
      status: 'degraded',
      service: 'sbs-backend',
      database: {
        status: 'unavailable',
        message: error.message
      }
    });
  }
}

module.exports = { getHealth };
