const { usersdbpool } = require('../config/dbConfig');

const getStatistics = async (req, res) => {
  const stats = await usersdbpool.query(
    `SELECT concat("שם פרטי",' ',"שם משפחה") as "שם" ,"סוג הרשאה","תפקיד","פעולה","תאריך","ארגון"
     FROM "eventsTable" JOIN "usersInfoTable" using("שם משתמש")`
  );
  res.send(stats.rows);
};

module.exports = { getStatistics };
