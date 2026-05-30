const { pool } = require('../config/db');

const availabilityColumns = `
  availability_id,
  stylist_id,
  day_of_week,
  start_time,
  end_time,
  created_at,
  updated_at
`;

async function listAvailabilityForStylist(stylistId) {
  const [rows] = await pool.execute(
    `
      SELECT ${availabilityColumns}
      FROM availability
      WHERE stylist_id = ?
      ORDER BY day_of_week ASC, start_time ASC, availability_id ASC
    `,
    [stylistId]
  );

  return rows;
}

async function replaceAvailabilityForStylist(stylistId, blocks) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.execute(
      'DELETE FROM availability WHERE stylist_id = ?',
      [stylistId]
    );

    for (const block of blocks) {
      await connection.execute(
        `
          INSERT INTO availability (stylist_id, day_of_week, start_time, end_time)
          VALUES (?, ?, ?, ?)
        `,
        [stylistId, block.dayOfWeek, block.startTime, block.endTime]
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  return listAvailabilityForStylist(stylistId);
}

module.exports = {
  listAvailabilityForStylist,
  replaceAvailabilityForStylist
};
