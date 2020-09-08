const { usersdbpool } = require('../config/dbConfig');

const DB_NAME = 'usersInfoTable';

const getUsers = async (req, res) => {
  try {
    const results = await usersdbpool.query(`SELECT * FROM "${DB_NAME}"`);
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(404).json({ error });
  }
};

module.exports = { getUsers};
