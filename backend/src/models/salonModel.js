const { pool } = require('../config/db');

const salonProfileColumns = `
  salon_id,
  name,
  address,
  phone,
  email,
  description,
  updated_at
`;

const businessHourColumns = `
  id,
  day_of_week,
  open_time,
  close_time,
  is_closed,
  updated_at
`;

function getFirstRow(rows) {
  return rows[0] || null;
}

async function getSalonProfile() {
  const [rows] = await pool.execute(
    `
      SELECT ${salonProfileColumns}
      FROM salon_profile
      WHERE salon_id = 1
      LIMIT 1
    `
  );

  return getFirstRow(rows);
}

async function upsertSalonProfile({ name, address, phone, email, description }) {
  await pool.execute(
    `
      INSERT INTO salon_profile (salon_id, name, address, phone, email, description)
      VALUES (1, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        address = VALUES(address),
        phone = VALUES(phone),
        email = VALUES(email),
        description = VALUES(description)
    `,
    [name, address, phone, email, description]
  );

  return getSalonProfile();
}

async function listBusinessHours() {
  const [rows] = await pool.execute(
    `
      SELECT ${businessHourColumns}
      FROM business_hours
      ORDER BY day_of_week ASC
    `
  );

  return rows;
}

async function listBusinessHoursByDay() {
  const rows = await listBusinessHours();
  const hoursByDay = new Map();

  for (const row of rows) {
    hoursByDay.set(Number(row.day_of_week), row);
  }

  return hoursByDay;
}

async function replaceBusinessHours(hours) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    for (const hour of hours) {
      await connection.execute(
        `
          INSERT INTO business_hours (day_of_week, open_time, close_time, is_closed)
          VALUES (?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            open_time = VALUES(open_time),
            close_time = VALUES(close_time),
            is_closed = VALUES(is_closed)
        `,
        [hour.dayOfWeek, hour.openTime, hour.closeTime, hour.isClosed]
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  return listBusinessHours();
}

module.exports = {
  getSalonProfile,
  listBusinessHours,
  listBusinessHoursByDay,
  replaceBusinessHours,
  upsertSalonProfile
};
