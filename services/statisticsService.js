const { usersQuery } = require('../db');

class StatisticsService {
  async getStatistics() {
    const { rows } = await usersQuery(
      `SELECT concat("firstName", ' ', "lastName") as "name", "operation", "role", "organization", "date"
    FROM public."eventsTable" JOIN public."usersInfoTable" USING("username")`
    );
    return rows;
  }
}

module.exports = StatisticsService;
