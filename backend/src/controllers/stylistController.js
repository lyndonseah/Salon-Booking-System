const { listActiveStylists } = require('../models/stylistModel');
const { toPublicUser } = require('../utils/users');

async function getStylists(_req, res) {
  const stylists = await listActiveStylists();
  const publicStylists = stylists.map(toPublicUser);

  return res.status(200).json({
    stylists: publicStylists
  });
}

module.exports = { getStylists };
