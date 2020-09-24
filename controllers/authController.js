const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const keys = require('../config/keys');
const storeOperation = require('../services/storeOperation');
const UserService = require('../services/userService');

const userService = new UserService();

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await userService.findUser(username);

    if (!user) {
      return res.status(400).json({ error: 'username does not exists' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'incorrect password' });
    }

    const accessToken = generateAccessToken(user);
    res.cookie('token', accessToken, { httpOnly: true });

    await storeOperation({ type: 'login', username });

    return res.json({ id: user.id, username: user.username });
  } catch (error) {
    return res.json({});
  }
};

exports.registerUser = async (req, res) => {
  const user = req.body;

  try {
    const userExists = await userService.findUser(user.username);

    if (userExists) {
      return res.status(400).json({ error: 'username is already exists' });
    }

    // Hash passwords before saving
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;

    await userService.save(user);

    return res.send({});
  } catch (error) {
    return res.status(400).json({ error });
  }
};

exports.currentUser = async (req, res) => {
  return res.json(req.user);
};

exports.logout = async (req, res) => {
  res.clearCookie('token');
  return res.redirect('/');
};

function generateAccessToken(user) {
  const options = { expiresIn: '12h' };
  const payload = { user: { id: user.ID, username: user.username } };

  const accessToken = jwt.sign(payload, keys.JWT_SECRET, options);

  return accessToken;
}
