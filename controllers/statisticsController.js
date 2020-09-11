const { usersdbpool } = require('../config/dbConfig');

const getStatistics = async (req, res) => {
  const sql = `
    SELECT concat("firstName", ' ', "lastName") as "name", "operation", "role", "organization", "date"
    FROM "eventsTable" JOIN "usersInfoTable" USING("username")
  `;
  const stats = await usersdbpool.query(sql);
  res.json({ statistics: stats.rows });
};

module.exports = { getStatistics };
