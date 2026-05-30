const { pool } = require('../config/db');

const serviceColumns = `
  service_id,
  name,
  duration,
  price,
  is_active,
  created_at,
  updated_at
`;

function getFirstRow(rows) {
  return rows[0] || null;
}

async function listActiveServices() {
  const [rows] = await pool.execute(
    `
      SELECT ${serviceColumns}
      FROM services
      WHERE is_active = TRUE
      ORDER BY name ASC, service_id ASC
    `
  );

  return rows;
}

async function findActiveServiceById(serviceId) {
  const [rows] = await pool.execute(
    `
      SELECT ${serviceColumns}
      FROM services
      WHERE service_id = ? AND is_active = TRUE
      LIMIT 1
    `,
    [serviceId]
  );

  return getFirstRow(rows);
}

async function findServiceById(serviceId) {
  const [rows] = await pool.execute(
    `
      SELECT ${serviceColumns}
      FROM services
      WHERE service_id = ?
      LIMIT 1
    `,
    [serviceId]
  );

  return getFirstRow(rows);
}

async function findServiceByName(name) {
  const [rows] = await pool.execute(
    `
      SELECT ${serviceColumns}
      FROM services
      WHERE LOWER(name) = LOWER(?)
      LIMIT 1
    `,
    [name]
  );

  return getFirstRow(rows);
}

async function findServiceByNameExceptId(name, serviceId) {
  const [rows] = await pool.execute(
    `
      SELECT ${serviceColumns}
      FROM services
      WHERE LOWER(name) = LOWER(?) AND service_id <> ?
      LIMIT 1
    `,
    [name, serviceId]
  );

  return getFirstRow(rows);
}

async function createService({ name, duration, price }) {
  const [result] = await pool.execute(
    `
      INSERT INTO services (name, duration, price)
      VALUES (?, ?, ?)
    `,
    [name, duration, price]
  );

  return findServiceById(result.insertId);
}

function buildServiceUpdateParts(fields) {
  const allowedFields = {
    name: 'name',
    duration: 'duration',
    price: 'price',
    isActive: 'is_active'
  };
  const assignments = [];
  const values = [];

  for (const [fieldName, columnName] of Object.entries(allowedFields)) {
    if (Object.prototype.hasOwnProperty.call(fields, fieldName)) {
      assignments.push(`${columnName} = ?`);
      values.push(fields[fieldName]);
    }
  }

  return { assignments, values };
}

async function updateService(serviceId, fields) {
  const { assignments, values } = buildServiceUpdateParts(fields);

  if (assignments.length === 0) {
    return findServiceById(serviceId);
  }

  values.push(serviceId);

  await pool.execute(
    `
      UPDATE services
      SET ${assignments.join(', ')}
      WHERE service_id = ?
    `,
    values
  );

  return findServiceById(serviceId);
}

async function deactivateService(serviceId) {
  await pool.execute(
    `
      UPDATE services
      SET is_active = FALSE
      WHERE service_id = ?
    `,
    [serviceId]
  );

  return findServiceById(serviceId);
}

module.exports = {
  createService,
  deactivateService,
  findActiveServiceById,
  findServiceById,
  findServiceByName,
  findServiceByNameExceptId,
  listActiveServices,
  updateService
};
