const { pool } = require('../config/db');

const stylistColumns = `
  user_id,
  username,
  password,
  full_name,
  email,
  phone,
  role,
  is_active,
  created_at,
  updated_at
`;

function getFirstRow(rows) {
  return rows[0] || null;
}

async function listActiveStylists() {
  const [rows] = await pool.execute(
    `
      SELECT ${stylistColumns}
      FROM users
      WHERE role = 'Stylist' AND is_active = TRUE
      ORDER BY full_name ASC, user_id ASC
    `
  );

  return rows;
}

async function findActiveStylistById(stylistId) {
  const [rows] = await pool.execute(
    `
      SELECT ${stylistColumns}
      FROM users
      WHERE user_id = ? AND role = 'Stylist' AND is_active = TRUE
      LIMIT 1
    `,
    [stylistId]
  );

  return getFirstRow(rows);
}

module.exports = {
  findActiveStylistById,
  listActiveStylists
};
