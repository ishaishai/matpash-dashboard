const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys');

module.exports = async (req, res, next) => {
  const token = req.cookies.token || '';
  if (!token) {
    return res.status(401).json('Invalid token');
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    req.user = decodedToken.user;
    return next();
  } catch (error) {
    return res.status(401).json('Invalid token');
  }
};
