const { usersdbpool } = require('../config/dbConfig');

const getStatistics = async (req, res) => {
  const stats = await usersdbpool.query(
    `SELECT concat("firstName", ' ', "lastName") as "name", "operation", "role", "organization", "date"
    FROM "eventsTable" JOIN "usersInfoTable" USING("username")`
  );
  res.json({ statistics: stats.rows });
};

module.exports = { getStatistics };
