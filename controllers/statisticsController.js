const StatisticsService = require('../services/statisticsService');

const statisticsService = new StatisticsService();

const getStatistics = async (req, res) => {
  const statistics = await statisticsService.getStatistics();

  res.json({ statistics });
};

module.exports = { getStatistics };
