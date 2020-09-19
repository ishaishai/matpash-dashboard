const db = require('../db');

class StatisticsService {
  async getStatistics() {
    const { rows } = await db.query(
      `SELECT concat("firstName", ' ', "lastName") as "name", "operation", "role", "organization", "date"
    FROM "eventsTable" JOIN "usersInfoTable" USING("username")`
    );
    return rows;
  }
}

module.exports = StatisticsService;
