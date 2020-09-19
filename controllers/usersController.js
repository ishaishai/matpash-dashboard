const UserService = require('../services/userService');

const userService = new UserService();

exports.getUsers = async (req, res) => {
  try {
    const users = await userService.getAll();
    res.status(200).json({ users });
  } catch (error) {
    res.status(404).json({ error });
  }
};
