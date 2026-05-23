const { pool } = require('../config/db');

const userColumns = `
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

async function findUserById(userId) {
  const [rows] = await pool.execute(
    `SELECT ${userColumns} FROM users WHERE user_id = ? LIMIT 1`,
    [userId]
  );

  return getFirstRow(rows);
}

async function findActiveUserById(userId) {
  const [rows] = await pool.execute(
    `SELECT ${userColumns} FROM users WHERE user_id = ? AND is_active = TRUE LIMIT 1`,
    [userId]
  );

  return getFirstRow(rows);
}

async function findUserByUsername(username) {
  const [rows] = await pool.execute(
    `SELECT ${userColumns} FROM users WHERE username = ? LIMIT 1`,
    [username]
  );

  return getFirstRow(rows);
}

async function findUserByUsernameOrEmail(username, email) {
  const [rows] = await pool.execute(
    `SELECT ${userColumns} FROM users WHERE username = ? OR email = ? LIMIT 1`,
    [username, email]
  );

  return getFirstRow(rows);
}

async function createUser({ username, passwordHash, fullName, email, phone = null, role }) {
  const [result] = await pool.execute(
    `
      INSERT INTO users (username, password, full_name, email, phone, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    [username, passwordHash, fullName, email, phone, role]
  );

  return findUserById(result.insertId);
}

async function listUsers() {
  const [rows] = await pool.execute(
    `
      SELECT ${userColumns}
      FROM users
      ORDER BY created_at DESC, user_id DESC
    `
  );

  return rows;
}

function buildUserUpdateParts(fields) {
  const allowedFields = {
    username: 'username',
    fullName: 'full_name',
    email: 'email',
    phone: 'phone',
    role: 'role',
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

async function updateUser(userId, fields) {
  const { assignments, values } = buildUserUpdateParts(fields);

  if (assignments.length === 0) {
    return findUserById(userId);
  }

  values.push(userId);

  await pool.execute(
    `
      UPDATE users
      SET ${assignments.join(', ')}
      WHERE user_id = ?
    `,
    values
  );

  return findUserById(userId);
}

async function deactivateUser(userId) {
  await pool.execute(
    `
      UPDATE users
      SET is_active = FALSE
      WHERE user_id = ?
    `,
    [userId]
  );

  return findUserById(userId);
}

module.exports = {
  createUser,
  deactivateUser,
  findActiveUserById,
  findUserById,
  findUserByUsername,
  findUserByUsernameOrEmail,
  listUsers,
  updateUser
};
