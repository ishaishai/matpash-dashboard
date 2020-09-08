const recordOperation = require('../services/recordOperation');

exports.login = async (req, res) => {
  recordOperation({ type: 'login', data: 'loggedIn' });

  return res.send({});
};
