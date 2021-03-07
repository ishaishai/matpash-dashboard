module.exports = async (req, res, next) => {
  console.log(req.user);
  try {
    if (req.user == 'tester') {
      return res.status(200).json('test user has no effect');
    }
    next();
  } catch (error) {
    return res.status(401).json('Invalid token');
  }
};
