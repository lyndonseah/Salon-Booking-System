const dotenv = require('dotenv');

dotenv.config();

function toNumber(value, fallback) {
  const parsed = Number(value);

  if (Number.isFinite(parsed)) {
    return parsed;
  }

  return fallback;
}

function trimText(value) {
  return value.trim();
}

function toList(value, fallback) {
  const source = value || fallback;
  const items = source.split(',');

  return items.map(trimText).filter(Boolean);
}

function normalizeApiPrefix(value) {
  const trimmed = (value || '/api').trim();
  let prefixed = trimmed;

  if (!prefixed.startsWith('/')) {
    prefixed = `/${prefixed}`;
  }

  if (prefixed.endsWith('/')) {
    return prefixed.slice(0, -1);
  }

  return prefixed;
}

const config = {
  env: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  port: toNumber(process.env.PORT, 5000),
  apiPrefix: normalizeApiPrefix(process.env.API_PREFIX),
  cors: {
    origins: toList(process.env.CORS_ORIGIN, 'http://localhost:3000')
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: toNumber(process.env.DB_PORT, 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'salon_booking_system',
    waitForConnections: true,
    connectionLimit: toNumber(process.env.DB_CONNECTION_LIMIT, 10),
    queueLimit: 0
  },
  jwt: {
    secret: process.env.JWT_SECRET || '',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  },
  mailtrap: {
    host: process.env.MAILTRAP_HOST || '',
    port: toNumber(process.env.MAILTRAP_PORT, 2525),
    user: process.env.MAILTRAP_USER || '',
    pass: process.env.MAILTRAP_PASS || '',
    from: process.env.MAIL_FROM || ''
  }
};

module.exports = { config };
